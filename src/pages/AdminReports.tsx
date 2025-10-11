import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  FileText,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  RefreshCw,
  Clock,
  User,
  Camera,
  AlertTriangle,
  Home,
  Route,
  Shield,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  X,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import HeatmapMap from "@/components/HeatmapMap";
import {
  getFloodReports,
  updateFloodReportStatus,
  deleteFloodReport,
  subscribeToFloodReports,
} from "@/lib/adminSupabase";

// Component to handle map view updates
const MapViewUpdater: React.FC<{
  center: [number, number];
  zoom: number;
  reports: any[];
}> = ({ center, zoom, reports }) => {
  const map = useMap();
  const [hasInitialized, setHasInitialized] = React.useState(false);

  React.useEffect(() => {
    if (map && !hasInitialized) {
      map.setView(center, zoom, { animate: false });
      setHasInitialized(true);
    }
  }, [map, center, zoom, hasInitialized]);

  // Update view when reports change significantly
  React.useEffect(() => {
    if (map && hasInitialized && reports.length > 0) {
      const validReports = reports.filter((report) => {
        const coords = report.location || report.coordinates;
        return (
          coords &&
          coords.lat &&
          coords.lng &&
          !isNaN(coords.lat) &&
          !isNaN(coords.lng)
        );
      });

      if (validReports.length > 1) {
        const lats = validReports.map((r) => (r.location || r.coordinates).lat);
        const lngs = validReports.map((r) => (r.location || r.coordinates).lng);
        const bounds = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ];

        map.fitBounds(bounds as [[number, number], [number, number]], {
          padding: [20, 20],
          animate: true,
          duration: 1,
        });
      }
    }
  }, [map, reports.length, hasInitialized]);

  return null;
};

// Real data structure based on Supabase tables
const initialData = {
  reports: [],
  categories: [
    "Flood severity",
    "Damage",
    "Rescue request",
    "Infrastructure issue",
    "Shelter request",
    "Road closure",
  ],
  regions: [
    "All Regions",
    "Sector 17",
    "Sector 22",
    "Sector 35",
    "Sector 8",
    "Sector 11",
  ],
};

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  // Heatmap controls
  const [heatRadius, setHeatRadius] = useState<number>(25);
  const [heatBlur, setHeatBlur] = useState<number>(15);
  const [timeRange, setTimeRange] = useState<string>("30d"); // 24h, 7d, 30d, all
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Mock data state
  const [data, setData] = useState(initialData);
  const [reports, setReports] = useState([]);

  // Load initial data
  useEffect(() => {
    loadReports();
  }, []);

  // Real-time report updates
  useEffect(() => {
    if (!isLive) return;

    const subscription = subscribeToFloodReports((payload) => {
      if (payload.eventType === "UPDATE" && payload.new) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === payload.new.id
              ? { ...report, ...payload.new }
              : report
          )
        );
      } else if (payload.eventType === "INSERT" && payload.new) {
        setReports((prevReports) => [payload.new, ...prevReports]);
      } else if (payload.eventType === "DELETE" && payload.old) {
        setReports((prevReports) =>
          prevReports.filter((report) => report.id !== payload.old.id)
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLive]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const reportData = await getFloodReports();
      setReports(reportData);

      // Update the data structure for the UI using real Supabase data
      setData({
        ...initialData,
        reports: reportData.map((report) => ({
          id: report.id || "",
          title: report.title || "Untitled Report",
          description: report.description || "No description",
          location: report.location?.address || "Unknown Location",
          category: report.category || "General",
          severity: report.severity || "medium",
          status: report.status || "pending",
          user: {
            id: report.user_id || "",
            name: report.user_name || "Unknown User",
            email: report.user_email || "unknown@example.com",
            avatar: null,
          },
          timestamp: report.created_at || new Date().toISOString(),
          images: Array.isArray(report.images)
            ? report.images.map((img, index) => ({
                id: index + 1,
                url: img, // This will be either a Supabase URL or base64 data URL
                alt: `Report image ${index + 1}`,
              }))
            : [],
          coordinates: report.location || { lat: 0, lng: 0 },
          verified: report.status === "verified",
          priority:
            report.severity === "critical"
              ? "high"
              : report.severity === "high"
              ? "medium"
              : "low",
        })),
      });
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadReports();
    toast.success("Reports refreshed successfully");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Flood severity":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Damage":
        return "bg-red-100 text-red-800 border-red-200";
      case "Rescue request":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Infrastructure issue":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Shelter request":
        return "bg-green-100 text-green-800 border-green-200";
      case "Road closure":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleApproveReport = async (reportId: string) => {
    setLoading(true);
    try {
      const success = await updateFloodReportStatus(reportId, "verified");
      if (success) {
        // Update local state
        setData((prev) => ({
          ...prev,
          reports: prev.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  status: "verified",
                  verified: true,
                  verifiedAt: new Date().toISOString(),
                }
              : report
          ),
        }));
        // Also update the reports state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: "verified" } : report
          )
        );
        toast.success("Report approved successfully");
      } else {
        toast.error("Failed to approve report");
      }
    } catch (error) {
      console.error("Error approving report:", error);
      toast.error("Failed to approve report");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectReport = async (reportId: string) => {
    setLoading(true);
    try {
      const success = await updateFloodReportStatus(reportId, "rejected");
      if (success) {
        // Update local state
        setData((prev) => ({
          ...prev,
          reports: prev.reports.map((report) =>
            report.id === reportId
              ? {
                  ...report,
                  status: "rejected",
                  rejectedAt: new Date().toISOString(),
                }
              : report
          ),
        }));
        // Also update the reports state
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: "rejected" } : report
          )
        );
        toast.success("Report rejected");
      } else {
        toast.error("Failed to reject report");
      }
    } catch (error) {
      console.error("Error rejecting report:", error);
      toast.error("Failed to reject report");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this report? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const success = await deleteFloodReport(reportId);
      if (success) {
        toast.success("Report deleted successfully");
        // Remove from local state
        setData((prev) => ({
          ...prev,
          reports: prev.reports.filter((report) => report.id !== reportId),
        }));
      } else {
        toast.error("Failed to delete report");
      }
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  const handleViewReportDetails = (reportId: string) => {
    const report = data.reports.find((r) => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowDetailsSidebar(true);
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const filteredReports = data.reports.filter((report) => {
    const matchesSearch =
      searchTerm === "" ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || report.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || report.status === filterStatus;
    const matchesSeverity =
      filterSeverity === "all" || report.severity === filterSeverity;
    const matchesRegion =
      filterRegion === "all" || report.location.includes(filterRegion);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      matchesSeverity &&
      matchesRegion
    );
  });

  const pendingReports = filteredReports.filter((r) => r.status === "pending");
  const verifiedReports = filteredReports.filter(
    (r) => r.status === "verified"
  );
  const rejectedReports = filteredReports.filter(
    (r) => r.status === "rejected"
  );

  // Calculate map center and bounds based on report locations with real-time updates
  const calculateMapCenter = () => {
    // Use the real reports data instead of data.reports
    const currentReports = reports.length > 0 ? reports : data.reports;

    if (currentReports.length === 0) {
      return { center: [30.7333, 76.7794], zoom: 12 }; // Default to Chandigarh
    }

    const validReports = currentReports.filter((report) => {
      const coords = report.location || report.coordinates;
      return (
        coords &&
        coords.lat &&
        coords.lng &&
        coords.lat !== 0 &&
        coords.lng !== 0 &&
        !isNaN(coords.lat) &&
        !isNaN(coords.lng)
      );
    });

    if (validReports.length === 0) {
      return { center: [30.7333, 76.7794], zoom: 12 }; // Default to Chandigarh
    }

    // Calculate bounds
    const lats = validReports.map((r) => {
      const coords = r.location || r.coordinates;
      return coords.lat;
    });
    const lngs = validReports.map((r) => {
      const coords = r.location || r.coordinates;
      return coords.lng;
    });

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Calculate center
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Calculate zoom based on spread of coordinates
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let zoom = 12; // Default zoom
    if (maxDiff > 0.1) zoom = 10; // Large area
    else if (maxDiff > 0.05) zoom = 11; // Medium area
    else if (maxDiff > 0.01) zoom = 13; // Small area
    else if (maxDiff > 0.005) zoom = 14; // Very small area
    else zoom = 15; // Single point or very close points

    return { center: [centerLat, centerLng], zoom };
  };

  const mapConfig = calculateMapCenter();

  // Calculate report density by location to highlight areas with more reports
  const calculateReportDensity = () => {
    const currentReports = reports.length > 0 ? reports : data.reports;

    const validReports = currentReports.filter((report) => {
      const coords = report.location || report.coordinates;
      return (
        coords &&
        coords.lat &&
        coords.lng &&
        coords.lat !== 0 &&
        coords.lng !== 0 &&
        !isNaN(coords.lat) &&
        !isNaN(coords.lng)
      );
    });

    if (validReports.length === 0) return [];

    // Group reports by location (rounded to 3 decimal places for clustering)
    const locationGroups = new Map();

    validReports.forEach((report) => {
      const coords = report.location || report.coordinates;
      const key = `${coords.lat.toFixed(3)},${coords.lng.toFixed(3)}`;

      if (!locationGroups.has(key)) {
        locationGroups.set(key, {
          lat: coords.lat,
          lng: coords.lng,
          reports: [],
          count: 0,
        });
      }

      locationGroups.get(key).reports.push(report);
      locationGroups.get(key).count++;
    });

    // Convert to array and sort by count (highest first)
    return Array.from(locationGroups.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 locations
  };

  const reportDensity = calculateReportDensity();

  // Build heatmap data from reports
  const getAdminHeatmapData = () => {
    const now = Date.now();
    const maxAgeMs =
      timeRange === "24h"
        ? 24 * 60 * 60 * 1000
        : timeRange === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : timeRange === "30d"
        ? 30 * 24 * 60 * 60 * 1000
        : Infinity;
    const currentReports = reports.length > 0 ? reports : data.reports;

    const valid = currentReports
      .filter((r) => {
        const coords = r.location || r.coordinates;
        return (
          coords &&
          typeof coords.lat === "number" &&
          typeof coords.lng === "number"
        );
      })
      .filter((r) => !onlyVerified || r.status === "verified")
      .filter((r) => {
        if (maxAgeMs === Infinity) return true;
        const ts = new Date(
          r.created_at || r.timestamp || new Date()
        ).getTime();
        return now - ts <= maxAgeMs;
      });

    return valid.map((r) => {
      const coords = r.location || r.coordinates;
      const severityWeight: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };
      const created = new Date(
        r.created_at || r.timestamp || new Date()
      ).getTime();
      const daysSince = Math.max(0, (now - created) / (1000 * 60 * 60 * 24));
      const recencyWeight = Math.max(0.1, 1 - daysSince / 30);
      const intensity = (severityWeight[r.severity] || 1) * recencyWeight;
      return { lat: coords.lat, lng: coords.lng, intensity };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Real-time Status Bar */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {isLive ? "Live Report Submissions" : "Paused"}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <div className="text-xs text-blue-600">
              Pending:{" "}
              {data.reports.filter((r) => r.status === "pending").length}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className={
                isLive
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-50 border-gray-200 text-gray-700"
              }
            >
              <Activity className="h-4 w-4 mr-2" />
              {isLive ? "Live" : "Paused"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Reports Management
            </h1>
            <p className="text-gray-600">
              Review and manage flood reports from users
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.reports.length}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReports.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{verifiedReports.length}</div>
              <p className="text-xs text-muted-foreground">Approved reports</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Critical
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.reports.filter((r) => r.severity === "critical").length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Map Widget */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                    Reports Map
                  </div>
                  <div className="text-sm text-gray-500">
                    {data.reports.length > 0 ? (
                      <>
                        Center: {mapConfig.center[0].toFixed(4)},{" "}
                        {mapConfig.center[1].toFixed(4)}
                        <span className="ml-2">Zoom: {mapConfig.zoom}</span>
                      </>
                    ) : (
                      "No reports to display"
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  Real-time geographic distribution of flood reports
                  {(reports.length > 0 || data.reports.length > 0) && (
                    <span className="ml-2 text-blue-600">
                      ({reports.length || data.reports.length} reports across{" "}
                      {reportDensity.length} locations)
                    </span>
                  )}
                  {isLive && (
                    <span className="ml-2 text-green-600 text-xs">
                      🔴 Live Updates
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <MapContainer
                    center={mapConfig.center}
                    zoom={mapConfig.zoom}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapViewUpdater
                      center={mapConfig.center}
                      zoom={mapConfig.zoom}
                      reports={reports.length > 0 ? reports : data.reports}
                    />
                    {reportDensity.map((densityPoint) => {
                      const currentReports =
                        reports.length > 0 ? reports : data.reports;
                      const reportsAtLocation =
                        densityPoint.reports ||
                        currentReports.filter((report) => {
                          const coords = report.location || report.coordinates;
                          return (
                            coords &&
                            coords.lat.toFixed(3) ===
                              densityPoint.lat.toFixed(3) &&
                            coords.lng.toFixed(3) ===
                              densityPoint.lng.toFixed(3)
                          );
                        });

                      const getMarkerColor = (severity: string) => {
                        switch (severity) {
                          case "critical":
                            return "#ef4444";
                          case "high":
                            return "#f59e0b";
                          case "medium":
                            return "#eab308";
                          case "low":
                            return "#10b981";
                          default:
                            return "#6b7280";
                        }
                      };

                      // Use the highest severity at this location
                      const highestSeverity = reportsAtLocation.reduce(
                        (highest, report) => {
                          const severityOrder = {
                            critical: 4,
                            high: 3,
                            medium: 2,
                            low: 1,
                          };
                          return severityOrder[report.severity] >
                            severityOrder[highest]
                            ? report.severity
                            : highest;
                        },
                        "low"
                      );

                      const markerSize =
                        densityPoint.count > 5
                          ? 30
                          : densityPoint.count > 2
                          ? 25
                          : 20;
                      const customIcon = L.divIcon({
                        className: "custom-marker",
                        html: `<div style="background-color: ${getMarkerColor(
                          highestSeverity
                        )}; width: ${markerSize}px; height: ${markerSize}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: ${
                          densityPoint.count > 9 ? "10px" : "12px"
                        };">${densityPoint.count}</div>`,
                        iconSize: [markerSize, markerSize],
                        iconAnchor: [markerSize / 2, markerSize / 2],
                      });

                      return (
                        <Marker
                          key={`${densityPoint.lat}-${densityPoint.lng}`}
                          position={[densityPoint.lat, densityPoint.lng]}
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">
                                {densityPoint.count} Report
                                {densityPoint.count > 1 ? "s" : ""} at this
                                location
                              </h3>
                              <div className="space-y-1 mt-2">
                                {reportsAtLocation
                                  .slice(0, 3)
                                  .map((report, index) => (
                                    <div
                                      key={report.id || index}
                                      className="text-xs border-b border-gray-100 pb-1"
                                    >
                                      <p className="font-medium">
                                        {report.title || "Untitled Report"}
                                      </p>
                                      <p className="text-gray-600">
                                        Severity:{" "}
                                        <span
                                          className={`font-medium ${
                                            report.severity === "critical"
                                              ? "text-red-600"
                                              : report.severity === "high"
                                              ? "text-orange-600"
                                              : report.severity === "medium"
                                              ? "text-yellow-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {report.severity || "medium"}
                                        </span>
                                      </p>
                                      <p className="text-gray-500">
                                        {new Date(
                                          report.created_at ||
                                            report.timestamp ||
                                            new Date()
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  ))}
                                {reportsAtLocation.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    ... and {reportsAtLocation.length - 3} more
                                  </p>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Critical</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>High</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Medium</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Low</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isLive && (
                        <div className="flex items-center space-x-1 text-green-600 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live Updates</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          loadReports();
                          toast.success("Map data refreshed");
                        }}
                        disabled={loading}
                      >
                        <RefreshCw
                          className={`w-4 h-4 mr-2 ${
                            loading ? "animate-spin" : ""
                          }`}
                        />
                        Refresh Map
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <span>Single report</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <span>Multiple reports</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        5+
                      </div>
                      <span>High density</span>
                    </div>
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    Map automatically centers on areas with the most reports •
                    Updates in real-time
                  </div>
                  {reportDensity.length > 0 && (
                    <div className="text-center text-xs text-gray-500">
                      Top density locations:{" "}
                      {reportDensity
                        .slice(0, 3)
                        .map((d) => `${d.count} reports`)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Reports Heatmap */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-600" />
                    Reports Heatmap
                  </div>
                  <div className="text-sm text-gray-500">
                    {getAdminHeatmapData().length} locations
                  </div>
                </CardTitle>
                <CardDescription>
                  Density and severity-weighted heatmap of reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-600">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Last 30 days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Radius</label>
                    <Select
                      value={String(heatRadius)}
                      onValueChange={(v) => setHeatRadius(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">Small</SelectItem>
                        <SelectItem value="25">Medium</SelectItem>
                        <SelectItem value="40">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Blur</label>
                    <Select
                      value={String(heatBlur)}
                      onValueChange={(v) => setHeatBlur(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Blur" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">Low</SelectItem>
                        <SelectItem value="15">Medium</SelectItem>
                        <SelectItem value="25">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <label className="mr-2 text-xs text-gray-600">
                      Verified only
                    </label>
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                    />
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border">
                  <HeatmapMap
                    data={getAdminHeatmapData()}
                    height="420px"
                    center={mapConfig.center as [number, number]}
                    zoom={mapConfig.zoom}
                    radius={heatRadius}
                    blur={heatBlur}
                    minOpacity={0.4}
                    fitToData={true}
                    showMarkersOnZoom={true}
                    markersZoomThreshold={12}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1"></span>
                      Low
                    </span>
                    <span className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-1"></span>
                      Medium
                    </span>
                    <span className="flex items-center">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded mr-1"></span>
                      High
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={loading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        loading ? "animate-spin" : ""
                      }`}
                    />
                    Refresh Heatmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Queue */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Report Queue
                </CardTitle>
                <CardDescription>Reports awaiting review</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {pendingReports.slice(0, 5).map((report) => (
                      <div
                        key={report.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm">
                            {report.title}
                          </h4>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {report.location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingReports.length === 0 && (
                      <div className="text-center text-muted-foreground py-8">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No pending reports</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.slice(0, 6).map((report) => (
            <Card
              key={report.id}
              className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {report.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                  <Badge className={getSeverityColor(report.severity)}>
                    {report.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {report.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(report.timestamp)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs">
                      {report.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {report.user.name}
                  </span>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReport(report)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {report.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApproveReport(report.id)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteReport(report.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Reports Found
              </h3>
              <p className="text-gray-600">
                {data.reports.length === 0
                  ? "No reports have been submitted yet."
                  : "No reports match your current filters."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Report Details Dialog */}
        <Dialog open={showReportDetails} onOpenChange={setShowReportDetails}>
          <DialogContent
            className="w-[90vw] h-[80vh] max-w-none overflow-y-auto"
            style={{ aspectRatio: "16/9" }}
          >
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected report
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Report Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Title:</span>
                        <p className="text-sm">{selectedReport.title}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          Description:
                        </span>
                        <p className="text-sm">{selectedReport.description}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Location:</span>
                        <p className="text-sm">{selectedReport.location}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Category:</span>
                        <Badge
                          className={getCategoryColor(selectedReport.category)}
                        >
                          {selectedReport.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Status & Priority</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">Severity:</span>
                        <Badge
                          className={getSeverityColor(selectedReport.severity)}
                        >
                          {selectedReport.severity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Status:</span>
                        <Badge
                          className={getStatusColor(selectedReport.status)}
                        >
                          {selectedReport.status}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Priority:</span>
                        <span className="text-sm">
                          {selectedReport.priority}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Submitted:</span>
                        <p className="text-sm">
                          {formatDate(selectedReport.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Reporter Information</h3>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                        {selectedReport.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedReport.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedReport.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedReport.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Attached Media</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedReport.images.map((image) => {
                        const isVideo =
                          image.url &&
                          (image.url.includes(".mp4") ||
                            image.url.includes(".mov") ||
                            image.url.includes(".avi") ||
                            image.url.startsWith("data:video/"));

                        return (
                          <div
                            key={image.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="h-32 bg-gray-100 flex items-center justify-center">
                              {image.url ? (
                                isVideo ? (
                                  <video
                                    src={image.url}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                    controls
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <img
                                    src={image.url}
                                    alt={image.alt}
                                    className="w-full h-full object-cover cursor-pointer hover:opacity-90"
                                    onClick={() => {
                                      setSelectedImageUrl(image.url);
                                      setShowImageViewer(true);
                                    }}
                                  />
                                )
                              ) : (
                                <Camera className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <p className="p-2 text-sm text-muted-foreground">
                              {image.alt}{" "}
                              {isVideo && (
                                <span className="text-blue-600">(Video)</span>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Location on Map</h3>
                  <div className="h-64 rounded-lg overflow-hidden border">
                    <MapContainer
                      center={[
                        selectedReport.coordinates.lat,
                        selectedReport.coordinates.lng,
                      ]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker
                        position={[
                          selectedReport.coordinates.lat,
                          selectedReport.coordinates.lng,
                        ]}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm">
                              {selectedReport.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">
                              {selectedReport.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Coordinates:{" "}
                              {selectedReport.coordinates.lat.toFixed(6)},{" "}
                              {selectedReport.coordinates.lng.toFixed(6)}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Coordinates: {selectedReport.coordinates.lat.toFixed(6)},{" "}
                      {selectedReport.coordinates.lng.toFixed(6)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const googleMapsUrl = `https://www.google.com/maps?q=${selectedReport.coordinates.lat},${selectedReport.coordinates.lng}`;
                        window.open(googleMapsUrl, "_blank");
                      }}
                      className="text-xs"
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowReportDetails(false)}
              >
                Close
              </Button>
              {selectedReport?.status === "pending" && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleRejectReport(selectedReport.id);
                      setShowReportDetails(false);
                    }}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => {
                      handleApproveReport(selectedReport.id);
                      setShowReportDetails(false);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Viewer Modal */}
        <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black">
            <div className="relative w-full h-full">
              <img
                src={selectedImageUrl}
                alt="Full size image"
                className="w-full h-full object-contain"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageViewer(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
