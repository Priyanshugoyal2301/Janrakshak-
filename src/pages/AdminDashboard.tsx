import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart as RechartsAreaChart, Area } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data for development
const mockData = {
  stats: {
    totalUsers: 1247,
    activeUsers: 892,
    totalReports: 156,
    pendingReports: 23,
    criticalReports: 8,
    verifiedReports: 125,
    sheltersActivated: 12,
    shelterCapacity: 85,
    avgResponseTime: 2.3,
    systemUptime: 99.9,
  },
  recentReports: [
    {
      id: 1,
      title: "Flooding in Sector 17",
      location: "Chandigarh, Sector 17",
      severity: "critical",
      status: "pending",
      user: "John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      description: "Water level rising rapidly in residential area"
    },
    {
      id: 2,
      title: "Road Blockage Near Mall",
      location: "Chandigarh, Sector 22",
      severity: "high",
      status: "verified",
      user: "Jane Smith",
      timestamp: "2024-01-15T09:15:00Z",
      description: "Main road completely blocked due to waterlogging"
    },
    {
      id: 3,
      title: "Shelter Request - Family of 4",
      location: "Chandigarh, Sector 35",
      severity: "medium",
      status: "pending",
      user: "Mike Johnson",
      timestamp: "2024-01-15T08:45:00Z",
      description: "Need immediate shelter for elderly parents"
    },
    {
      id: 4,
      title: "Infrastructure Damage",
      location: "Chandigarh, Sector 8",
      severity: "low",
      status: "verified",
      user: "Sarah Wilson",
      timestamp: "2024-01-15T07:20:00Z",
      description: "Street lights not working in affected area"
    },
    {
      id: 5,
      title: "Rescue Request - Trapped Vehicle",
      location: "Chandigarh, Sector 11",
      severity: "critical",
      status: "pending",
      user: "David Brown",
      timestamp: "2024-01-15T06:30:00Z",
      description: "Car stuck in floodwater, need immediate rescue"
    }
  ],
  alerts: [
    {
      id: 1,
      type: "Flood Warning",
      severity: "critical",
      message: "Heavy rainfall expected in next 2 hours",
      timestamp: "2024-01-15T11:00:00Z",
      status: "active"
    },
    {
      id: 2,
      type: "River Level Alert",
      severity: "high",
      message: "Sukhna Lake water level rising",
      timestamp: "2024-01-15T10:30:00Z",
      status: "active"
    },
    {
      id: 3,
      type: "Weather Update",
      severity: "medium",
      message: "Rainfall intensity decreasing",
      timestamp: "2024-01-15T09:45:00Z",
      status: "active"
    }
  ],
  shelters: [
    {
      id: 1,
      name: "Sector 17 Community Center",
      location: "Chandigarh, Sector 17",
      capacity: 100,
      currentOccupancy: 75,
      status: "near_full",
      coordinates: [30.7333, 76.7794],
      contact: "+91-98765-43210",
      facilities: ["Food", "Medical", "Water", "Electricity"]
    },
    {
      id: 2,
      name: "Government School Sector 22",
      location: "Chandigarh, Sector 22",
      capacity: 150,
      currentOccupancy: 45,
      status: "available",
      coordinates: [30.7400, 76.7850],
      contact: "+91-98765-43211",
      facilities: ["Food", "Water", "Electricity"]
    },
    {
      id: 3,
      name: "Sports Complex Sector 35",
      location: "Chandigarh, Sector 35",
      capacity: 200,
      currentOccupancy: 200,
      status: "full",
      coordinates: [30.7500, 76.7900],
      contact: "+91-98765-43212",
      facilities: ["Food", "Medical", "Water", "Electricity", "Sanitation"]
    },
    {
      id: 4,
      name: "Amritsar Relief Center",
      location: "Amritsar, Punjab",
      capacity: 300,
      currentOccupancy: 180,
      status: "available",
      coordinates: [31.6340, 74.8723],
      contact: "+91-98765-43213",
      facilities: ["Food", "Medical", "Water", "Electricity", "Sanitation", "Transport"]
    },
    {
      id: 5,
      name: "Ludhiana Community Hall",
      location: "Ludhiana, Punjab",
      capacity: 250,
      currentOccupancy: 200,
      status: "near_full",
      coordinates: [30.9010, 75.8573],
      contact: "+91-98765-43214",
      facilities: ["Food", "Water", "Electricity", "Sanitation"]
    },
    {
      id: 6,
      name: "Jalandhar Sports Complex",
      location: "Jalandhar, Punjab",
      capacity: 400,
      currentOccupancy: 320,
      status: "near_full",
      coordinates: [31.3260, 75.5762],
      contact: "+91-98765-43215",
      facilities: ["Food", "Medical", "Water", "Electricity", "Sanitation", "Transport", "Communication"]
    },
    {
      id: 7,
      name: "Patiala Government School",
      location: "Patiala, Punjab",
      capacity: 180,
      currentOccupancy: 120,
      status: "available",
      coordinates: [30.3398, 76.3869],
      contact: "+91-98765-43216",
      facilities: ["Food", "Water", "Electricity"]
    },
    {
      id: 8,
      name: "Bathinda Relief Camp",
      location: "Bathinda, Punjab",
      capacity: 220,
      currentOccupancy: 220,
      status: "full",
      coordinates: [30.2110, 74.9455],
      contact: "+91-98765-43217",
      facilities: ["Food", "Medical", "Water", "Electricity", "Sanitation"]
    },
    {
      id: 9,
      name: "Mohali Community Center",
      location: "Mohali, Punjab",
      capacity: 160,
      currentOccupancy: 80,
      status: "available",
      coordinates: [30.7046, 76.7179],
      contact: "+91-98765-43218",
      facilities: ["Food", "Water", "Electricity", "Sanitation"]
    },
    {
      id: 10,
      name: "Firozpur Emergency Shelter",
      location: "Firozpur, Punjab",
      capacity: 280,
      currentOccupancy: 150,
      status: "available",
      coordinates: [30.9251, 74.6107],
      contact: "+91-98765-43219",
      facilities: ["Food", "Medical", "Water", "Electricity", "Transport"]
    }
  ],
  trends: {
    userGrowth: [
      { month: 'Jan', users: 120, active: 95 },
      { month: 'Feb', users: 180, active: 142 },
      { month: 'Mar', users: 250, active: 198 },
      { month: 'Apr', users: 320, active: 256 },
      { month: 'May', users: 400, active: 320 },
      { month: 'Jun', users: 480, active: 384 }
    ],
    reportSubmissions: [
      { day: 'Mon', count: 8 },
      { day: 'Tue', count: 12 },
      { day: 'Wed', count: 15 },
      { day: 'Thu', count: 10 },
      { day: 'Fri', count: 18 },
      { day: 'Sat', count: 14 },
      { day: 'Sun', count: 9 }
    ]
  },
  floodRegions: [
    {
      id: 1,
      name: "Sector 17 Flood Zone",
      center: [30.7333, 76.7794],
      radius: 500,
      severity: "high",
      population: 5000,
      reports: 15
    },
    {
      id: 2,
      name: "Sector 22 Flood Zone",
      center: [30.7400, 76.7850],
      radius: 300,
      severity: "medium",
      population: 3500,
      reports: 8
    },
    {
      id: 3,
      name: "Sector 35 Flood Zone",
      center: [30.7500, 76.7900],
      radius: 400,
      severity: "low",
      population: 6000,
      reports: 5
    }
  ],
  mapReports: [
    {
      id: 1,
      title: "Flooding in Sector 17",
      location: "Chandigarh, Sector 17",
      coordinates: [30.7333, 76.7794],
      severity: "critical",
      status: "pending",
      user: "John Doe",
      timestamp: "2024-01-15T10:30:00Z",
      description: "Water level rising rapidly in residential area",
      emoji: "🚨"
    },
    {
      id: 2,
      title: "Road Blockage Near Mall",
      location: "Chandigarh, Sector 22",
      coordinates: [30.7400, 76.7850],
      severity: "high",
      status: "verified",
      user: "Jane Smith",
      timestamp: "2024-01-15T09:15:00Z",
      description: "Main road completely blocked due to waterlogging",
      emoji: "⚠️"
    },
    {
      id: 3,
      title: "Shelter Request - Family of 4",
      location: "Chandigarh, Sector 35",
      coordinates: [30.7500, 76.7900],
      severity: "medium",
      status: "pending",
      user: "Mike Johnson",
      timestamp: "2024-01-15T08:45:00Z",
      description: "Need immediate shelter for elderly parents",
      emoji: "🏠"
    },
    {
      id: 4,
      title: "Infrastructure Damage",
      location: "Chandigarh, Sector 8",
      coordinates: [30.7200, 76.7700],
      severity: "low",
      status: "verified",
      user: "Sarah Wilson",
      timestamp: "2024-01-15T07:20:00Z",
      description: "Street lights not working in affected area",
      emoji: "🔧"
    },
    {
      id: 5,
      title: "Rescue Request - Trapped Vehicle",
      location: "Chandigarh, Sector 11",
      coordinates: [30.7600, 76.8000],
      severity: "critical",
      status: "pending",
      user: "David Brown",
      timestamp: "2024-01-15T06:30:00Z",
      description: "Car stuck in floodwater, need immediate rescue",
      emoji: "🚗"
    }
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data state
  const [data, setData] = useState(mockData);

  // Real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalUsers: prev.stats.totalUsers + Math.floor(Math.random() * 3),
          totalReports: prev.stats.totalReports + Math.floor(Math.random() * 2),
          activeShelters: prev.stats.activeShelters + (Math.random() > 0.8 ? 1 : 0),
          criticalAlerts: Math.max(0, prev.stats.criticalAlerts + (Math.random() > 0.9 ? 1 : -1))
        },
        recentReports: [
          ...prev.recentReports.slice(0, 4),
          {
            id: Date.now(),
            title: `New Report - ${['Flood', 'Damage', 'Rescue', 'Infrastructure'][Math.floor(Math.random() * 4)]}`,
            location: `Sector ${Math.floor(Math.random() * 50) + 1}`,
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            status: 'pending',
            user: `User ${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            description: 'Real-time report submission'
          }
        ],
        alerts: [
          ...prev.alerts.slice(0, 2),
          {
            id: Date.now(),
            type: "Real-time Alert",
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            message: `Live update: ${new Date().toLocaleTimeString()}`,
            timestamp: new Date().toISOString(),
            status: 'active'
          }
        ]
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
        stats: {
          ...prev.stats,
          totalUsers: prev.stats.totalUsers + Math.floor(Math.random() * 5),
          totalReports: prev.stats.totalReports + Math.floor(Math.random() * 3),
          activeShelters: prev.stats.activeShelters + (Math.random() > 0.5 ? 1 : 0),
          criticalAlerts: Math.max(0, prev.stats.criticalAlerts + (Math.random() > 0.7 ? 1 : -1))
        }
      }));
      setLastUpdate(new Date());
      setLoading(false);
      toast.success('Dashboard data refreshed successfully');
    }, 1000);
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

  const getShelterStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'near_full': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
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

  // Quick Actions Handlers
  const handleSendAlert = () => {
    toast.success('Opening alert broadcast form...');
    // Navigate to alerts page with broadcast form open
    navigate('/admin/alerts?action=broadcast');
  };

  const handleAddShelter = () => {
    toast.success('Opening shelter creation form...');
    // Navigate to shelters page with add form open
    navigate('/admin/shelters?action=add');
  };

  const handleAssignRescue = () => {
    toast.success('Opening rescue assignment form...');
    // Navigate to routes page with assignment form open
    navigate('/admin/routes?action=assign');
  };

  const handleViewAnalytics = () => {
    toast.success('Opening analytics dashboard...');
    navigate('/admin/analytics');
  };

  const handleManageUsers = () => {
    toast.success('Opening user management...');
    navigate('/admin/users');
  };

  const handleViewReports = () => {
    toast.success('Opening reports management...');
    navigate('/admin/reports');
  };

  // KPI Card click handlers
  const handleKPIClick = (type: string) => {
    switch (type) {
      case 'users':
        handleManageUsers();
        break;
      case 'reports':
        handleViewReports();
        break;
      case 'shelters':
        navigate('/admin/shelters');
        break;
      case 'alerts':
        navigate('/admin/alerts');
        break;
      default:
        break;
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, description, trend, type }: any) => (
    <Card 
      className="relative overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer hover:scale-105"
      onClick={() => handleKPIClick(type)}
    >
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
              {Math.abs(change)}% from last month
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

  const filteredReports = data.recentReports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || report.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live Updates' : 'Paused'}
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
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {data.alerts.filter(alert => alert.severity === 'critical').length > 0 && (
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center space-x-3 animate-pulse">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Critical Alert Active</p>
            <p className="text-sm opacity-90">
              {data.alerts.filter(alert => alert.severity === 'critical').length} critical alerts require immediate attention
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto bg-white/20 border-white/30 text-white hover:bg-white/30"
            onClick={() => navigate('/admin/alerts')}
          >
            View Details
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.stats.totalUsers.toLocaleString()}
          change={12}
          icon={Users}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          description="Registered users"
          trend={85}
          type="users"
        />
        <StatCard
          title="Active Users"
          value={data.stats.activeUsers.toLocaleString()}
          change={8}
          icon={UserCheck}
          color="bg-gradient-to-r from-green-500 to-green-600"
          description="Recently active"
          trend={72}
          type="users"
        />
        <StatCard
          title="Total Reports"
          value={data.stats.totalReports.toLocaleString()}
          change={-3}
          icon={FileText}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          description="Flood reports"
          trend={68}
          type="reports"
        />
        <StatCard
          title="Critical Reports"
          value={data.stats.criticalReports.toLocaleString()}
          change={5}
          icon={AlertTriangle}
          color="bg-gradient-to-r from-red-500 to-red-600"
          description="Urgent alerts"
          trend={45}
          type="alerts"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Shelters Activated"
          value={data.stats.sheltersActivated}
          change={2}
          icon={Home}
          color="bg-gradient-to-r from-teal-500 to-teal-600"
          description="Active shelters"
          trend={80}
          type="shelters"
        />
        <StatCard
          title="Shelter Capacity"
          value={`${data.stats.shelterCapacity}%`}
          change={-5}
          icon={Target}
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          description="Occupancy rate"
          trend={data.stats.shelterCapacity}
          type="shelters"
        />
        <StatCard
          title="Avg Response Time"
          value={`${data.stats.avgResponseTime}s`}
          change={-15}
          icon={Zap}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          description="Response time"
          trend={92}
          type="system"
        />
        <StatCard
          title="System Uptime"
          value={`${data.stats.systemUptime}%`}
          change={0.1}
          icon={Activity}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
          description="Platform availability"
          trend={99}
          type="system"
        />
      </div>

      {/* Quick Actions */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-teal-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button 
              variant="outline" 
              className="h-24 flex-col hover:bg-teal-50 hover:border-teal-200 transition-colors"
              onClick={handleSendAlert}
            >
              <Bell className="h-6 w-6 mb-2 text-teal-600" />
              <span className="font-medium">Send Alert</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors"
              onClick={handleAddShelter}
            >
              <Home className="h-6 w-6 mb-2 text-blue-600" />
              <span className="font-medium">Add Shelter</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col hover:bg-green-50 hover:border-green-200 transition-colors"
              onClick={handleAssignRescue}
            >
              <Users className="h-6 w-6 mb-2 text-green-600" />
              <span className="font-medium">Assign Rescue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-24 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors"
              onClick={handleViewAnalytics}
            >
              <BarChart3 className="h-6 w-6 mb-2 text-purple-600" />
              <span className="font-medium">View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <FileText className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="shelters" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Home className="h-4 w-4 mr-2" />
            Shelters
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Map Widget */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                  Live Map
                </CardTitle>
                <CardDescription>Active shelters, reports, and flood zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[30.9010, 75.8573]}
                    zoom={8}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Flood Regions */}
                    {data.floodRegions.map((region) => {
                      const getFloodColor = (severity: string) => {
                        switch (severity) {
                          case 'high': return '#ef4444';
                          case 'medium': return '#f59e0b';
                          case 'low': return '#3b82f6';
                          default: return '#6b7280';
                        }
                      };
                      
                      return (
                        <Circle
                          key={region.id}
                          center={region.center}
                          radius={region.radius}
                          pathOptions={{
                            color: getFloodColor(region.severity),
                            fillColor: getFloodColor(region.severity),
                            fillOpacity: 0.3,
                            weight: 2
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">{region.name}</h3>
                              <p className="text-xs text-gray-600">Severity: <span className={`font-medium ${region.severity === 'high' ? 'text-red-600' : region.severity === 'medium' ? 'text-orange-600' : 'text-blue-600'}`}>{region.severity}</span></p>
                              <p className="text-xs">Population: {region.population.toLocaleString()}</p>
                              <p className="text-xs">Reports: {region.reports}</p>
                            </div>
                          </Popup>
                        </Circle>
                      );
                    })}
                    
                    {/* Shelters */}
                    {data.shelters.map((shelter) => {
                      const getShelterIcon = (status: string) => {
                        switch (status) {
                          case 'available': return '🟢';
                          case 'near_full': return '🟡';
                          case 'full': return '🔴';
                          default: return '🏠';
                        }
                      };
                      
                      const customIcon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background-color: white; border: 2px solid #0ea5e9; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${getShelterIcon(shelter.status)}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                      });
                      
                      const openGoogleMaps = () => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates[0]},${shelter.coordinates[1]}`;
                        window.open(url, '_blank');
                      };
                      
                      return (
                        <Marker
                          key={shelter.id}
                          position={shelter.coordinates}
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">{shelter.name}</h3>
                              <p className="text-xs text-gray-600">{shelter.location}</p>
                              <p className="text-xs">Capacity: {shelter.capacity}</p>
                              <p className="text-xs">Occupancy: {shelter.currentOccupancy}</p>
                              <p className="text-xs">Status: <span className={`font-medium ${shelter.status === 'available' ? 'text-green-600' : shelter.status === 'near_full' ? 'text-yellow-600' : 'text-red-600'}`}>{shelter.status.replace('_', ' ')}</span></p>
                              <p className="text-xs">Contact: {shelter.contact}</p>
                              <p className="text-xs">Facilities: {shelter.facilities.join(', ')}</p>
                              <div className="mt-2 space-y-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/admin/shelters?id=${shelter.id}`)}
                                  className="w-full text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Manage
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={openGoogleMaps}
                                  className="w-full text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                >
                                  <MapPin className="h-3 w-3 mr-1" />
                                  Get Directions
                                </Button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                    
                    {/* Reports */}
                    {data.mapReports.map((report) => {
                      const getReportColor = (severity: string) => {
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
                        html: `<div style="background-color: ${getReportColor(report.severity)}; border: 2px solid white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${report.emoji}</div>`,
                        iconSize: [25, 25],
                        iconAnchor: [12, 12]
                      });
                      
                      return (
                        <Marker
                          key={report.id}
                          position={report.coordinates}
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">{report.title}</h3>
                              <p className="text-xs text-gray-600">{report.location}</p>
                              <p className="text-xs">Severity: <span className={`font-medium ${report.severity === 'critical' ? 'text-red-600' : report.severity === 'high' ? 'text-orange-600' : report.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{report.severity}</span></p>
                              <p className="text-xs">Status: <span className={`font-medium ${report.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>{report.status}</span></p>
                              <p className="text-xs">User: {report.user}</p>
                              <p className="text-xs">Time: {new Date(report.timestamp).toLocaleString()}</p>
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/admin/reports?id=${report.id}`)}
                                  className="w-full text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View Details
                                </Button>
                              </div>
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
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">🏠</span>
                    <span>Shelters</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  System Health
                </CardTitle>
                <CardDescription>Platform performance and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Response</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Fast
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    75% Used
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Storage Usage</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
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
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-teal-600" />
                    Recent Reports
                  </CardTitle>
                  <CardDescription>Latest flood reports from users</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
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
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead>Report</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{report.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{report.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-xs">
                                {report.user.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{report.user}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(report.timestamp)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => navigate(`/admin/reports?id=${report.id}`)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setData(prev => ({
                                  ...prev,
                                  recentReports: prev.recentReports.map(r => 
                                    r.id === report.id ? { ...r, status: 'verified' } : r
                                  )
                                }));
                                toast.success('Report approved successfully');
                              }}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setData(prev => ({
                                  ...prev,
                                  recentReports: prev.recentReports.map(r => 
                                    r.id === report.id ? { ...r, status: 'rejected' } : r
                                  )
                                }));
                                toast.success('Report rejected');
                              }}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setData(prev => ({
                                    ...prev,
                                    recentReports: prev.recentReports.filter(r => r.id !== report.id)
                                  }));
                                  toast.success('Report deleted');
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Active Alerts
              </CardTitle>
              <CardDescription>Real-time flood warnings and system alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{alert.type}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(alert.timestamp)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {alert.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/alerts?id=${alert.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shelters Tab */}
        <TabsContent value="shelters" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2 text-green-600" />
                Shelter Status
              </CardTitle>
              <CardDescription>Current shelter capacity and occupancy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.shelters.map((shelter) => (
                  <div key={shelter.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Home className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{shelter.name}</h4>
                      <p className="text-sm text-muted-foreground">{shelter.location}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">
                          <span className="font-medium">{shelter.currentOccupancy}</span> / {shelter.capacity} people
                        </span>
                        <div className="flex-1 max-w-32">
                          <Progress value={(shelter.currentOccupancy / shelter.capacity) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getShelterStatusColor(shelter.status)}>
                        {shelter.status.replace('_', ' ')}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/shelters?id=${shelter.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
