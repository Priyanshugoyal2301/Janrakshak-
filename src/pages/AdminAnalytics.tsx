import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  Home,
  Activity,
  Clock,
  Target,
  Globe,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Eye,
  PieChart,
  LineChart,
  AreaChart,
  Zap,
  Shield,
  Heart,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Award,
  Settings,
  Route,
  Navigation,
  Droplets,
  UserCheck,
  UserX,
  Building,
  Map,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart as RechartsAreaChart, Area, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// Mock data for development
const mockData = {
  kpis: {
    avgReportsPerDay: 12.5,
    avgResponseTime: 2.3,
    shelterUtilizationRate: 78.5,
    userSatisfactionScore: 4.2,
    systemUptime: 99.9,
    totalUsers: 1247,
    totalReports: 3421,
    totalShelters: 15,
    criticalAlerts: 3,
    activeUsers: 856,
    pendingReports: 44
  },
  trends: {
    userGrowth: [
      { month: 'Jan', users: 120, reports: 45, active: 95 },
      { month: 'Feb', users: 180, reports: 67, active: 142 },
      { month: 'Mar', users: 250, reports: 89, active: 198 },
      { month: 'Apr', users: 320, reports: 112, active: 256 },
      { month: 'May', users: 400, reports: 134, active: 320 },
      { month: 'Jun', users: 480, reports: 156, active: 384 }
    ],
    reportSubmissions: [
      { day: 'Mon', count: 8, critical: 1, high: 3, medium: 3, low: 1 },
      { day: 'Tue', count: 12, critical: 2, high: 4, medium: 4, low: 2 },
      { day: 'Wed', count: 15, critical: 3, high: 5, medium: 5, low: 2 },
      { day: 'Thu', count: 10, critical: 1, high: 3, medium: 4, low: 2 },
      { day: 'Fri', count: 18, critical: 4, high: 6, medium: 6, low: 2 },
      { day: 'Sat', count: 14, critical: 2, high: 5, medium: 5, low: 2 },
      { day: 'Sun', count: 9, critical: 1, high: 3, medium: 3, low: 2 }
    ],
    shelterOccupancy: [
      { shelter: 'Sector 17', capacity: 100, occupancy: 75, status: 'busy' },
      { shelter: 'Sector 22', capacity: 150, occupancy: 45, status: 'available' },
      { shelter: 'Sector 35', capacity: 200, occupancy: 200, status: 'full' },
      { shelter: 'Sector 8', capacity: 80, occupancy: 30, status: 'available' },
      { shelter: 'Sector 11', capacity: 120, occupancy: 0, status: 'available' }
    ],
    floodAlerts: [
      { month: 'Jan', alerts: 3, critical: 1, high: 1, medium: 1 },
      { month: 'Feb', alerts: 7, critical: 2, high: 2, medium: 3 },
      { month: 'Mar', alerts: 12, critical: 3, high: 4, medium: 5 },
      { month: 'Apr', alerts: 18, critical: 5, high: 6, medium: 7 },
      { month: 'May', alerts: 25, critical: 7, high: 8, medium: 10 },
      { month: 'Jun', alerts: 32, critical: 9, high: 11, medium: 12 }
    ]
  },
  heatmapData: [
    { region: 'Sector 17', risk: 'high', reports: 45, population: 5000 },
    { region: 'Sector 22', risk: 'medium', reports: 32, population: 4500 },
    { region: 'Sector 35', risk: 'low', reports: 18, population: 6000 },
    { region: 'Sector 8', risk: 'high', reports: 28, population: 3500 },
    { region: 'Sector 11', risk: 'medium', reports: 22, population: 4000 }
  ],
  topPerformers: [
    { name: 'Team Alpha', missions: 45, successRate: 98.5, avgTime: 2.1 },
    { name: 'Team Beta', missions: 38, successRate: 96.2, avgTime: 2.3 },
    { name: 'Team Gamma', missions: 32, successRate: 94.8, avgTime: 2.5 }
  ]
};

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Mock data state
  const [data, setData] = useState(mockData);

  // Real-time analytics updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        kpis: {
          ...prev.kpis,
          totalUsers: prev.kpis.totalUsers + Math.floor(Math.random() * 3),
          totalReports: prev.kpis.totalReports + Math.floor(Math.random() * 5),
          activeUsers: prev.kpis.activeUsers + Math.floor(Math.random() * 2),
          pendingReports: Math.max(0, prev.kpis.pendingReports + Math.floor(Math.random() * 3) - 1),
          avgReportsPerDay: Math.max(0, prev.kpis.avgReportsPerDay + (Math.random() - 0.5) * 2),
          avgResponseTime: Math.max(0, prev.kpis.avgResponseTime + (Math.random() - 0.5) * 0.5),
          shelterUtilizationRate: Math.max(0, Math.min(100, prev.kpis.shelterUtilizationRate + (Math.random() - 0.5) * 5))
        },
        trends: {
          ...prev.trends,
          reportSubmissions: prev.trends.reportSubmissions.map(day => ({
            ...day,
            count: Math.max(0, day.count + Math.floor(Math.random() * 3) - 1),
            critical: Math.max(0, day.critical + (Math.random() > 0.8 ? 1 : 0)),
            high: Math.max(0, day.high + Math.floor(Math.random() * 2)),
            medium: Math.max(0, day.medium + Math.floor(Math.random() * 2)),
            low: Math.max(0, day.low + Math.floor(Math.random() * 2))
          })),
          shelterOccupancy: prev.trends.shelterOccupancy.map(shelter => ({
            ...shelter,
            occupancy: Math.max(0, Math.min(shelter.capacity, shelter.occupancy + Math.floor(Math.random() * 5) - 2)),
            status: shelter.occupancy >= shelter.capacity * 0.9 ? 'full' : 
                   shelter.occupancy >= shelter.capacity * 0.7 ? 'busy' : 'available'
          }))
        }
      }));
      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        kpis: {
          ...prev.kpis,
          totalUsers: prev.kpis.totalUsers + Math.floor(Math.random() * 10),
          totalReports: prev.kpis.totalReports + Math.floor(Math.random() * 15),
          activeUsers: prev.kpis.activeUsers + Math.floor(Math.random() * 5),
          pendingReports: Math.max(0, prev.kpis.pendingReports + Math.floor(Math.random() * 5) - 2)
        }
      }));
      setLastUpdate(new Date());
      setLoading(false);
      toast.success('Analytics data refreshed successfully');
    }, 1000);
  };

  const downloadReport = (type: string) => {
    toast.success(`Downloading ${type} report...`);
    setTimeout(() => {
      toast.success(`${type} report downloaded successfully`);
    }, 2000);
  };

  const generateMonthlyReport = () => {
    toast.success('Generating comprehensive monthly report...');
    setTimeout(() => {
      toast.success('Monthly report generated and ready for download');
    }, 3000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const KPICard = ({ title, value, change, icon: Icon, color, description, trend }: any) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change && (
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {change > 0 ? (
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
            )}
            <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
              {Math.abs(change)}% from last period
            </span>
          </p>
        )}
        {trend && (
          <div className="mt-2">
            <Progress value={trend} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{trend}% of target</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live Analytics' : 'Paused'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-blue-600">
            Time Range: {timeRange}
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white/50 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => downloadReport('analytics')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            size="sm"
            onClick={generateMonthlyReport}
          >
            <FileText className="h-4 w-4 mr-2" />
            Monthly Report
          </Button>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">Comprehensive analytics and performance metrics</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Users"
          value={data.kpis.totalUsers.toLocaleString()}
          change={8}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          description="Registered users"
          trend={85}
        />
        <KPICard
          title="Total Reports"
          value={data.kpis.totalReports.toLocaleString()}
          change={12}
          icon={FileText}
          color="bg-gradient-to-r from-green-500 to-green-600"
          description="All time reports"
          trend={92}
        />
        <KPICard
          title="Active Users"
          value={data.kpis.activeUsers.toLocaleString()}
          change={5}
          icon={UserCheck}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          description="Currently active"
          trend={data.kpis.activeUsers}
        />
        <KPICard
          title="Pending Reports"
          value={data.kpis.pendingReports}
          change={-2}
          icon={Clock}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          description="Awaiting review"
          trend={84}
        />
      </div>

      {/* Secondary KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Avg Reports/Day"
          value={data.kpis.avgReportsPerDay.toFixed(1)}
          change={8}
          icon={BarChart3}
          color="bg-gradient-to-r from-teal-500 to-teal-600"
          description="Daily submissions"
          trend={85}
        />
        <KPICard
          title="Avg Response Time"
          value={`${data.kpis.avgResponseTime}s`}
          change={-15}
          icon={Zap}
          color="bg-gradient-to-r from-red-500 to-red-600"
          description="Response to reports"
          trend={92}
        />
        <KPICard
          title="Shelter Utilization"
          value={`${data.kpis.shelterUtilizationRate}%`}
          change={5}
          icon={Home}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          description="Capacity usage"
          trend={data.kpis.shelterUtilizationRate}
        />
        <KPICard
          title="System Uptime"
          value={`${data.kpis.systemUptime}%`}
          change={0}
          icon={Shield}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          description="Service availability"
          trend={data.kpis.systemUptime}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Target className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="geographic" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Map className="h-4 w-4 mr-2" />
            Geographic
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Eye className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user registration and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={data.trends.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#0ea5e9" strokeWidth={2} name="Users" />
                      <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} name="Active" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Report Categories
                </CardTitle>
                <CardDescription>Distribution of report types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={data.trends.reportSubmissions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ day, count }) => `${day}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.trends.reportSubmissions.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#ec4899'][index % 7]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  System Health
                </CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm font-bold text-green-600">{data.kpis.systemUptime}%</span>
                </div>
                <Progress value={data.kpis.systemUptime} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm font-bold text-blue-600">{data.kpis.avgResponseTime}s</span>
                </div>
                <Progress value={92} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User Satisfaction</span>
                  <span className="text-sm font-bold text-yellow-600">{data.kpis.userSatisfactionScore}/5.0</span>
                </div>
                <Progress value={84} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-teal-600" />
                  Regional Overview
                </CardTitle>
                <CardDescription>Activity by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.heatmapData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{region.region}</span>
                        <div className="text-xs text-muted-foreground">
                          {region.reports} reports, {region.population} people
                        </div>
                      </div>
                      <Badge className={getRiskColor(region.risk)}>
                        {region.risk}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Top Performers
                </CardTitle>
                <CardDescription>Best performing teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topPerformers.map((team, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{team.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {team.missions} missions, {team.successRate}% success
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{team.avgTime}s</div>
                        <div className="text-xs text-muted-foreground">avg time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Report Submissions Trend
                </CardTitle>
                <CardDescription>Daily report submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={data.trends.reportSubmissions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0ea5e9" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AreaChart className="h-5 w-5 mr-2 text-green-600" />
                  Shelter Occupancy Trend
                </CardTitle>
                <CardDescription>Shelter capacity utilization over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsAreaChart data={data.trends.shelterOccupancy}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="shelter" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="occupancy" stackId="1" stroke="#10b981" fill="#10b981" />
                    </RechartsAreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                  Flood Alerts Frequency
                </CardTitle>
                <CardDescription>Monthly flood alert trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={data.trends.floodAlerts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="alerts" stroke="#8b5cf6" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-orange-600" />
                  User Activity Patterns
                </CardTitle>
                <CardDescription>Peak usage times and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <Users className="h-12 w-12 mr-4 text-gray-300" />
                  <div>
                    <p className="font-medium">Chart coming soon</p>
                    <p className="text-sm">Data visualization will be added here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Response Time Analysis
                </CardTitle>
                <CardDescription>Average response times by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Critical Reports</span>
                    <span className="text-sm font-bold text-red-600">1.2s</span>
                  </div>
                  <Progress value={95} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Priority</span>
                    <span className="text-sm font-bold text-orange-600">2.1s</span>
                  </div>
                  <Progress value={88} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Priority</span>
                    <span className="text-sm font-bold text-yellow-600">3.5s</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Priority</span>
                    <span className="text-sm font-bold text-green-600">5.2s</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Mission Success Rates
                </CardTitle>
                <CardDescription>Success rates by team and type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.topPerformers.map((team, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{team.name}</span>
                        <span className="text-sm font-bold text-green-600">{team.successRate}%</span>
                      </div>
                      <Progress value={team.successRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {team.missions} missions completed
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Average Resolution Time
                </CardTitle>
                <CardDescription>Time to resolve reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.2h</div>
                  <div className="text-sm text-muted-foreground">Average resolution time</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Critical</span>
                      <span>1.5h</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>High</span>
                      <span>3.2h</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Medium</span>
                      <span>5.8h</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Low</span>
                      <span>8.1h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-600" />
                  Volunteer Performance
                </CardTitle>
                <CardDescription>Volunteer activity and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">4.7/5</div>
                  <div className="text-sm text-muted-foreground">Average volunteer rating</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Active Volunteers</span>
                      <span>24</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Missions</span>
                      <span>156</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Success Rate</span>
                      <span>96.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-teal-600" />
                  Shelter Efficiency
                </CardTitle>
                <CardDescription>Shelter utilization and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">68.5%</div>
                  <div className="text-sm text-muted-foreground">Average utilization</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Total Shelters</span>
                      <span>12</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Active Shelters</span>
                      <span>10</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Total Capacity</span>
                      <span>1,200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-blue-600" />
                  Geographic Analytics
                </CardTitle>
                <CardDescription>Regional distribution and heatmap</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Map className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                      <p className="font-medium text-blue-800">Geographic Analytics Map</p>
                      <p className="text-sm text-blue-600">Interactive map with regional data</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm">High Risk ({data.heatmapData.filter(r => r.risk === 'high').length})</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Medium Risk ({data.heatmapData.filter(r => r.risk === 'medium').length})</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Low Risk ({data.heatmapData.filter(r => r.risk === 'low').length})</span>
                        </div>
                      </div>
                      <Button 
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          toast.info('Map integration - Click on regions to see detailed analytics');
                        }}
                      >
                        <Map className="h-4 w-4 mr-2" />
                        View Map
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Regional Statistics
                </CardTitle>
                <CardDescription>Top regions by activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.heatmapData.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-sm">{region.region}</h4>
                        <p className="text-xs text-gray-600">{region.population?.toLocaleString()} people</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{region.reports}</div>
                        <Badge className={getRiskColor(region.risk)}>
                          {region.risk}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="h-5 w-5 mr-2 text-purple-600" />
                Route Analytics
              </CardTitle>
              <CardDescription>GraphHopper API integration for route optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden">
                <div className="h-full bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                    <p className="font-medium text-purple-800">Route Optimization</p>
                    <p className="text-sm text-purple-600">GraphHopper API integration</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Optimal Routes</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Traffic Data</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Distance Matrix</span>
                      </div>
                    </div>
                    <Button 
                      className="mt-4 bg-purple-600 hover:bg-purple-700"
                      onClick={() => {
                        toast.info('Route optimization feature - Enter origin and destination to see optimal routes');
                      }}
                    >
                      <Route className="h-4 w-4 mr-2" />
                      Optimize Routes
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Key Insights
                </CardTitle>
                <CardDescription>Important trends and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Positive Trend</span>
                    </div>
                    <p className="text-sm text-green-700">
                      User satisfaction has increased by 12% this month, indicating improved service quality.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Performance</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Response times have improved by 15% due to optimized routing algorithms.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Attention Needed</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Sector 17 shows high flood risk with 45 reports this month. Consider additional resources.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Recommendations
                </CardTitle>
                <CardDescription>Actionable insights for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">User Engagement</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Consider implementing a rewards system to increase volunteer participation.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Home className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">Shelter Management</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Sector 35 shelter is at full capacity. Consider opening additional shelters in the area.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="h-4 w-4 text-teal-600" />
                      <span className="font-medium text-teal-800">Technology</span>
                    </div>
                    <p className="text-sm text-teal-700">
                      Implement real-time GPS tracking for rescue teams to improve response accuracy.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Regional Risk Assessment
              </CardTitle>
              <CardDescription>Flood risk analysis by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.heatmapData.map((region, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{region.region}</h4>
                      <Badge className={getRiskColor(region.risk)}>
                        {region.risk} risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Reports</span>
                        <span className="font-medium">{region.reports}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Population</span>
                        <span className="font-medium">{region.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Score</span>
                        <span className="font-medium">
                          {region.risk === 'high' ? '8.5' : region.risk === 'medium' ? '6.2' : '3.8'}/10
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
