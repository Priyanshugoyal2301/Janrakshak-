import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  FileText,
  AlertTriangle,
  MapPin,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Home,
  Droplets,
  Zap,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Bell,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  BookOpen,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
  Area,
  Legend,
} from "recharts";
import {
  getDashboardStats,
  getAnalyticsData,
  getSystemLogs,
  getAdminUsers,
  getAdminAlerts,
  getAdminShelters,
  getAdminMissions,
  logDashboardAccess,
  subscribeToReports,
  subscribeToUsers,
  subscribeToAlerts,
  subscribeToShelters,
} from "@/lib/adminSupabase";

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Real dashboard data state
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    criticalReports: 0,
    verifiedReports: 0,
    totalShelters: 0,
    activeShelters: 0,
    totalAlerts: 0,
    activeAlerts: 0,
    totalMissions: 0,
    pendingMissions: 0,
    avgResponseTime: 0,
    systemUptime: 0,
    shelterCapacity: 0,
  });

  // Real analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    reportSubmissions: [],
    shelterOccupancy: [],
    floodAlerts: [],
    avgReportsPerDay: 0,
    shelterUtilizationRate: 0,
    userSatisfactionScore: 0,
  });

  // Recent activities state
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);

  // Load all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Loading dashboard data...");

      // Load dashboard stats and analytics in parallel
      const [stats, analytics, logs] = await Promise.all([
        getDashboardStats(),
        getAnalyticsData(),
        getSystemLogs(),
      ]);

      console.log("Dashboard stats loaded:", stats);
      console.log("Analytics data loaded:", analytics);
      console.log("System logs loaded:", logs);

      setDashboardData(stats);
      setAnalyticsData(analytics);
      setSystemLogs(logs.slice(0, 5)); // Show only latest 5 logs as activities

      // Convert system logs to activity format
      const activities = logs.slice(0, 5).map((log) => ({
        id: log.id,
        type: log.level,
        message: log.message,
        service: log.service,
        timestamp: log.timestamp,
        details: log.details,
      }));
      setRecentActivities(activities);

      setLastUpdate(new Date());

      // Log dashboard access
      await logDashboardAccess();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions
  useEffect(() => {
    let subscriptions = [];

    if (isLive) {
      // Subscribe to real-time updates
      const reportsSubscription = subscribeToReports((payload) => {
        console.log("Real-time reports update:", payload);
        loadDashboardData(); // Refresh data when reports change
      });

      const usersSubscription = subscribeToUsers((payload) => {
        console.log("Real-time users update:", payload);
        loadDashboardData(); // Refresh data when users change
      });

      const alertsSubscription = subscribeToAlerts((payload) => {
        console.log("Real-time alerts update:", payload);
        loadDashboardData(); // Refresh data when alerts change
      });

      const sheltersSubscription = subscribeToShelters((payload) => {
        console.log("Real-time shelters update:", payload);
        loadDashboardData(); // Refresh data when shelters change
      });

      subscriptions = [
        reportsSubscription,
        usersSubscription,
        alertsSubscription,
        sheltersSubscription,
      ];
    }

    return () => {
      // Cleanup subscriptions
      subscriptions.forEach((sub) => {
        if (sub && sub.unsubscribe) {
          sub.unsubscribe();
        }
      });
    };
  }, [isLive]);

  // Initial data load and periodic refresh
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      if (isLive) {
        setLastUpdate(new Date());
        loadDashboardData(); // Refresh real data
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = async () => {
    try {
      await loadDashboardData();
      toast.success("Dashboard data refreshed");
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast.error("Failed to refresh dashboard data");
    }
  };

  return (
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
              {isLive ? "Live Updates" : "Paused"}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="text-teal-600 border-teal-300 hover:bg-teal-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isLive ? "Live" : "Paused"}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading && (
          <div className="col-span-full flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-2 text-lg text-gray-600">
              Loading dashboard data...
            </span>
          </div>
        )}
        {!loading && (
          <>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-800">
                  {dashboardData.totalUsers.toLocaleString()}
                </div>
                <p className="text-xs text-blue-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Active Volunteers
                </CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-800">
                  {dashboardData.activeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-700">
                  Pending Reports
                </CardTitle>
                <FileText className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-800">
                  {dashboardData.pendingReports}
                </div>
                <p className="text-xs text-yellow-600 flex items-center">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  -15% from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">
                  Critical Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">
                  {dashboardData.criticalReports}
                </div>
                <p className="text-xs text-red-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +3 from last hour
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  Active Shelters
                </CardTitle>
                <Home className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-800">
                  {dashboardData.activeShelters}
                </div>
                <p className="text-xs text-purple-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +2 from yesterday
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-teal-700">
                  Ongoing Missions
                </CardTitle>
                <Target className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-teal-800">
                  {dashboardData.pendingMissions}
                </div>
                <p className="text-xs text-teal-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +5 from this morning
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Additional Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {!loading && (
          <>
            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-700">
                  System Health
                </CardTitle>
                <Activity className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-800">
                  {dashboardData.systemUptime}%
                </div>
                <p className="text-xs text-indigo-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All systems operational
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-700">
                  Response Time
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800">
                  {dashboardData.avgResponseTime.toFixed(1)} min
                </div>
                <p className="text-xs text-orange-600 flex items-center">
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                  -30s from target
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-pink-700">
                  Training Completed
                </CardTitle>
                <BookOpen className="h-4 w-4 text-pink-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-pink-800">
                  {Math.floor(dashboardData.totalUsers * 0.6)}
                </div>
                <p className="text-xs text-pink-600 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +125 this week
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-cyan-700">
                  Equipment Status
                </CardTitle>
                <Shield className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-800">
                  {dashboardData.shelterCapacity}%
                </div>
                <p className="text-xs text-cyan-600 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Ready for deployment
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-emerald-700">
                  Deployed Teams
                </CardTitle>
                <Users className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-800">
                  {Math.floor(dashboardData.activeUsers * 0.3)}
                </div>
                <p className="text-xs text-emerald-600 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  Active across {Math.ceil(
                    dashboardData.activeShelters / 3
                  )}{" "}
                  regions
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-violet-700">
                  Weather Alerts
                </CardTitle>
                <Droplets className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-violet-800">
                  {dashboardData.activeAlerts}
                </div>
                <p className="text-xs text-violet-600 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {dashboardData.criticalReports} severe warnings
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Actions Panel */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used administrative functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50"
              onClick={() => navigate("/admin/emergency-alerts")}
            >
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <span className="text-xs">Emergency Alert</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50"
              onClick={() => navigate("/admin/volunteers")}
            >
              <Users className="w-6 h-6 text-green-500" />
              <span className="text-xs">Deploy Teams</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50"
              onClick={() => navigate("/admin/gis-mapping")}
            >
              <MapPin className="w-6 h-6 text-purple-500" />
              <span className="text-xs">GIS Mapping</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-yellow-50"
              onClick={() => navigate("/admin/reports")}
            >
              <FileText className="w-6 h-6 text-yellow-500" />
              <span className="text-xs">Generate Report</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-indigo-50"
              onClick={() => navigate("/admin/training")}
            >
              <BookOpen className="w-6 h-6 text-indigo-500" />
              <span className="text-xs">Training Hub</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-cyan-50"
              onClick={() => navigate("/admin/system")}
            >
              <Settings className="w-6 h-6 text-cyan-500" />
              <span className="text-xs">System Health</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activities Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Live Activity Feed
              </span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    Loading activities...
                  </span>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => {
                  const getActivityColor = (level) => {
                    switch (level) {
                      case "error":
                        return "bg-red-50 text-red-900 border-red-500";
                      case "warning":
                        return "bg-yellow-50 text-yellow-900 border-yellow-500";
                      case "info":
                        return "bg-blue-50 text-blue-900 border-blue-500";
                      default:
                        return "bg-gray-50 text-gray-900 border-gray-500";
                    }
                  };

                  const getTimeAgo = (timestamp) => {
                    const now = new Date();
                    const activityTime = new Date(timestamp);
                    const diffInMinutes = Math.floor(
                      (now.getTime() - activityTime.getTime()) / (1000 * 60)
                    );

                    if (diffInMinutes < 1) return "Just now";
                    if (diffInMinutes < 60)
                      return `${diffInMinutes} minutes ago`;
                    const diffInHours = Math.floor(diffInMinutes / 60);
                    if (diffInHours < 24) return `${diffInHours} hours ago`;
                    const diffInDays = Math.floor(diffInHours / 24);
                    return `${diffInDays} days ago`;
                  };

                  return (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${getActivityColor(
                        activity.type
                      )}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "error"
                            ? "bg-red-500"
                            : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.message}
                        </p>
                        <p className="text-xs opacity-75">
                          {getTimeAgo(activity.timestamp)} • {activity.service}
                        </p>
                        {activity.details && (
                          <p className="text-xs opacity-60 mt-1">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Activity className="h-8 w-8 text-gray-300" />
                  <span className="ml-2 text-sm text-gray-500">
                    No recent activities
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Monthly Incidents Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={analyticsData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Total Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="active"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Active Users"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.shelterOccupancy.map(
                        (shelter, index) => ({
                          name: shelter.shelter,
                          value: shelter.occupancy,
                          color: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                            index % 4
                          ],
                        })
                      )}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.shelterOccupancy.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                              index % 4
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports Overview</CardTitle>
              <CardDescription>Recent reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Reports section coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Latest system activities and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Activities timeline coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardContent;
