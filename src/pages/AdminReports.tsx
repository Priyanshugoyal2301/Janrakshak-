import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
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
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  getFloodReports, 
  updateFloodReportStatus,
  subscribeToFloodReports
} from '@/lib/adminSupabase';

// Real data structure based on Supabase tables
const initialData = {
  reports: [],
  categories: [
    "Flood severity",
    "Damage",
    "Rescue request",
    "Infrastructure issue",
    "Shelter request",
    "Road closure"
  ],
  regions: [
    "All Regions",
    "Sector 17",
    "Sector 22",
    "Sector 35",
    "Sector 8",
    "Sector 11"
  ]
};

const AdminReports = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportDetails, setShowReportDetails] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
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
      console.log('Report update received:', payload);
      
      if (payload.eventType === 'UPDATE' && payload.new) {
        setReports(prevReports => 
          prevReports.map(report => 
            report.id === payload.new.id ? { ...report, ...payload.new } : report
          )
        );
      } else if (payload.eventType === 'INSERT' && payload.new) {
        setReports(prevReports => [payload.new, ...prevReports]);
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setReports(prevReports => prevReports.filter(report => report.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLive]);

  const loadReports = async () => {
    setLoading(true);
    try {
      console.log('Loading flood reports from Supabase...');
      const reportData = await getFloodReports();
      console.log('Loaded reports:', reportData);
      setReports(reportData);
      
      // Update the data structure for the UI using real Supabase data
      setData({
        ...initialData,
        reports: reportData.map(report => ({
          id: report.id || '',
          title: report.title || 'Untitled Report',
          description: report.description || 'No description',
          location: report.location?.address || 'Unknown Location',
          category: report.category || 'General',
          severity: report.severity || 'medium',
          status: report.status || 'pending',
          user: {
            id: report.user_id || '',
            name: report.user_name || 'Unknown User',
            email: report.user_email || 'unknown@example.com',
            avatar: null
          },
          timestamp: report.created_at || new Date().toISOString(),
          images: Array.isArray(report.images) ? report.images.map((img, index) => ({
            id: index + 1,
            url: img,
            alt: `Report image ${index + 1}`
          })) : [],
          coordinates: report.location || { lat: 0, lng: 0 },
          verified: report.status === 'verified',
          priority: report.severity === 'critical' ? 'high' : 
                   report.severity === 'high' ? 'medium' : 'low'
        }))
      });
      
      console.log('Reports state updated:', reportData.length, 'reports loaded');
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await loadReports();
    toast.success('Reports refreshed successfully');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Flood severity': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Damage': return 'bg-red-100 text-red-800 border-red-200';
      case 'Rescue request': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Infrastructure issue': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Shelter request': return 'bg-green-100 text-green-800 border-green-200';
      case 'Road closure': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApproveReport = async (reportId: string) => {
    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        reports: prev.reports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'verified', verified: true, verifiedAt: new Date().toISOString() }
            : report
        )
      }));
      setLoading(false);
      toast.success('Report approved successfully');
    }, 1000);
  };

  const handleRejectReport = async (reportId: string) => {
    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        reports: prev.reports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'rejected', rejectedAt: new Date().toISOString() }
            : report
        )
      }));
      setLoading(false);
      toast.success('Report rejected');
    }, 1000);
  };

  const handleDeleteReport = async (reportId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        reports: prev.reports.filter(report => report.id !== reportId)
      }));
      setLoading(false);
      toast.success('Report deleted');
    }, 1000);
  };

  const handleViewReportDetails = (reportId: string) => {
    const report = data.reports.find(r => r.id === reportId);
    if (report) {
      setSelectedReport(report);
      setShowDetailsSidebar(true);
    }
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const filteredReports = data.reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    const matchesRegion = filterRegion === 'all' || report.location.includes(filterRegion);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesSeverity && matchesRegion;
  });

  const pendingReports = filteredReports.filter(r => r.status === 'pending');
  const verifiedReports = filteredReports.filter(r => r.status === 'verified');
  const rejectedReports = filteredReports.filter(r => r.status === 'rejected');

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live Report Submissions' : 'Paused'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-blue-600">
            Pending: {data.reports.filter(r => r.status === 'pending').length}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
          <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
          <p className="text-gray-600">Review and manage flood reports from users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reports.length}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedReports.length}</div>
            <p className="text-xs text-muted-foreground">Approved reports</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.reports.filter(r => r.severity === 'critical').length}</div>
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
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                Reports Map
              </CardTitle>
              <CardDescription>Geographic distribution of flood reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[30.7333, 76.7794]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {data.reports.map((report) => {
                    const getMarkerColor = (severity: string) => {
                      switch (severity) {
                        case 'critical': return '#ef4444';
                        case 'high': return '#f59e0b';
                        case 'medium': return '#eab308';
                        case 'low': return '#10b981';
                        default: return '#6b7280';
                      }
                    };

                    const customIcon = L.divIcon({
                      className: 'custom-marker',
                      html: `<div style="background-color: ${getMarkerColor(report.severity)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                      iconSize: [20, 20],
                      iconAnchor: [10, 10]
                    });

                    return (
                      <Marker
                        key={report.id}
                        position={[report.coordinates.lat, report.coordinates.lng]}
                        icon={customIcon}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold text-sm">{report.title}</h3>
                            <p className="text-xs text-gray-600">{report.location}</p>
                            <p className="text-xs">Severity: <span className={`font-medium ${report.severity === 'critical' ? 'text-red-600' : report.severity === 'high' ? 'text-orange-600' : report.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{report.severity}</span></p>
                            <p className="text-xs">Status: <span className={`font-medium ${report.status === 'pending' ? 'text-yellow-600' : report.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{report.status}</span></p>
                            <p className="text-xs">User: {report.user}</p>
                            <p className="text-xs">Time: {new Date(report.timestamp).toLocaleString()}</p>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
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
                    <div key={report.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{report.location}</span>
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
          <Card key={report.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold line-clamp-1">{report.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{report.description}</CardDescription>
                </div>
                <Badge className={getSeverityColor(report.severity)}>
                  {report.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{report.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{formatDate(report.timestamp)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs">
                    {report.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{report.user.name}</span>
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
                {report.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveReport(report.id)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              {data.reports.length === 0 ? 'No reports have been submitted yet.' : 'No reports match your current filters.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Report Details Dialog */}
      <Dialog open={showReportDetails} onOpenChange={setShowReportDetails}>
        <DialogContent className="max-w-4xl">
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
                      <span className="text-sm font-medium">Description:</span>
                      <p className="text-sm">{selectedReport.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Location:</span>
                      <p className="text-sm">{selectedReport.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Category:</span>
                      <Badge className={getCategoryColor(selectedReport.category)}>
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
                      <Badge className={getSeverityColor(selectedReport.severity)}>
                        {selectedReport.severity}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Status:</span>
                      <Badge className={getStatusColor(selectedReport.status)}>
                        {selectedReport.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Priority:</span>
                      <span className="text-sm">{selectedReport.priority}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Submitted:</span>
                      <p className="text-sm">{formatDate(selectedReport.timestamp)}</p>
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
                    <p className="text-sm text-muted-foreground">{selectedReport.user.email}</p>
                  </div>
                </div>
              </div>

              {selectedReport.images.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Attached Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedReport.images.map((image) => (
                      <div key={image.id} className="border rounded-lg overflow-hidden">
                        <div className="h-32 bg-gray-100 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="p-2 text-sm text-muted-foreground">{image.alt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Location on Map</h3>
                <div className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                    <p className="text-sm text-teal-800">Map integration coming soon</p>
                    <p className="text-xs text-teal-600">Coordinates: {selectedReport.coordinates.lat}, {selectedReport.coordinates.lng}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportDetails(false)}>
              Close
            </Button>
            {selectedReport?.status === 'pending' && (
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
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
