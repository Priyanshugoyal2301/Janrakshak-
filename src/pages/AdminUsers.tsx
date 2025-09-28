import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  User,
  Heart,
  Star,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Settings,
  Plus,
  Target,
  Globe,
  Award,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Mock data for development
const mockData = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "user",
      status: "active",
      region: "Sector 17",
      reportsSubmitted: 5,
      lastActivity: "2024-01-15T10:30:00Z",
      joinedAt: "2024-01-01T00:00:00Z",
      phone: "+91 98765 43210",
      avatar: null,
      verified: true,
      volunteer: false,
      emergencyContact: "+91 98765 43211"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "volunteer",
      status: "active",
      region: "Sector 22",
      reportsSubmitted: 12,
      lastActivity: "2024-01-15T09:15:00Z",
      joinedAt: "2023-12-15T00:00:00Z",
      phone: "+91 98765 43212",
      avatar: null,
      verified: true,
      volunteer: true,
      emergencyContact: "+91 98765 43213",
      specialization: "Water Rescue",
      experience: "2 years"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "rescue_team",
      status: "active",
      region: "Sector 35",
      reportsSubmitted: 8,
      lastActivity: "2024-01-15T08:45:00Z",
      joinedAt: "2023-11-20T00:00:00Z",
      phone: "+91 98765 43214",
      avatar: null,
      verified: true,
      volunteer: true,
      emergencyContact: "+91 98765 43215",
      specialization: "Medical Response",
      experience: "5 years",
      team: "Team Alpha"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "admin",
      status: "active",
      region: "All Regions",
      reportsSubmitted: 0,
      lastActivity: "2024-01-15T11:00:00Z",
      joinedAt: "2023-10-01T00:00:00Z",
      phone: "+91 98765 43216",
      avatar: null,
      verified: true,
      volunteer: false,
      emergencyContact: "+91 98765 43217"
    },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      role: "user",
      status: "suspended",
      region: "Sector 8",
      reportsSubmitted: 2,
      lastActivity: "2024-01-10T15:30:00Z",
      joinedAt: "2024-01-05T00:00:00Z",
      phone: "+91 98765 43218",
      avatar: null,
      verified: false,
      volunteer: false,
      emergencyContact: "+91 98765 43219",
      suspensionReason: "Inappropriate content"
    }
  ],
  volunteers: [
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      region: "Sector 22",
      specialization: "Water Rescue",
      experience: "2 years",
      status: "active",
      lastActivity: "2024-01-15T09:15:00Z",
      missionsCompleted: 15,
      rating: 4.8,
      availability: "24/7"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      region: "Sector 35",
      specialization: "Medical Response",
      experience: "5 years",
      status: "active",
      lastActivity: "2024-01-15T08:45:00Z",
      missionsCompleted: 32,
      rating: 4.9,
      availability: "Weekdays"
    },
    {
      id: 6,
      name: "Lisa Chen",
      email: "lisa@example.com",
      region: "Sector 11",
      specialization: "Search & Rescue",
      experience: "3 years",
      status: "active",
      lastActivity: "2024-01-14T16:20:00Z",
      missionsCompleted: 28,
      rating: 4.7,
      availability: "Weekends"
    },
    {
      id: 7,
      name: "Raj Patel",
      email: "raj@example.com",
      region: "Sector 8",
      specialization: "Logistics",
      experience: "1 year",
      status: "standby",
      lastActivity: "2024-01-13T12:00:00Z",
      missionsCompleted: 8,
      rating: 4.5,
      availability: "Evenings"
    }
  ],
  roles: [
    { value: "user", label: "User" },
    { value: "volunteer", label: "Volunteer" },
    { value: "rescue_team", label: "Rescue Team" },
    { value: "admin", label: "Admin" }
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

const AdminUsers = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Manage user form state
  const [manageForm, setManageForm] = useState({
    role: '',
    status: '',
    region: '',
    notes: ''
  });

  // Mock data state
  const [data, setData] = useState(mockData);

  // Real-time user status updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => ({
          ...user,
          isOnline: Math.random() > 0.3, // 70% chance of being online
          lastActivity: new Date().toISOString(),
          status: Math.random() > 0.1 ? user.status : (user.status === 'active' ? 'suspended' : 'active')
        })),
        volunteers: prev.volunteers.map(volunteer => ({
          ...volunteer,
          isOnline: Math.random() > 0.4, // 60% chance of being online
          lastActivity: new Date().toISOString(),
          availability: Math.random() > 0.2 ? volunteer.availability : (volunteer.availability === 'available' ? 'busy' : 'available')
        }))
      }));
      setLastUpdate(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => ({
          ...user,
          lastActive: new Date().toISOString()
        }))
      }));
      setLoading(false);
      toast.success('User data refreshed successfully');
    }, 1000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'rescue_team': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'volunteer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'standby': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'rescue_team': return <Shield className="h-4 w-4" />;
      case 'volunteer': return <Heart className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
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

  const handleManageUser = (user: any) => {
    setSelectedUser(user);
    setManageForm({
      role: user.role,
      status: user.status,
      region: user.region,
      notes: user.notes || ''
    });
    setShowManageDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === selectedUser.id 
            ? { 
                ...user, 
                role: manageForm.role,
                status: manageForm.status,
                region: manageForm.region,
                notes: manageForm.notes,
                updatedAt: new Date().toISOString()
              }
            : user
        )
      }));
      setLoading(false);
      setShowManageDialog(false);
      setSelectedUser(null);
      toast.success('User updated successfully');
    }, 1000);
  };

  const handleSuspendUser = async (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === userId 
            ? { ...user, status: 'suspended', updatedAt: new Date().toISOString() }
            : user
        )
      }));
      setLoading(false);
      toast.success('User suspended successfully');
    }, 1000);
  };

  const handleActivateUser = async (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.map(user => 
          user.id === userId 
            ? { ...user, status: 'active', updatedAt: new Date().toISOString() }
            : user
        )
      }));
      setLoading(false);
      toast.success('User activated successfully');
    }, 1000);
  };

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        users: prev.users.filter(user => user.id !== userId)
      }));
      setLoading(false);
      toast.success('User deleted successfully');
    }, 1000);
  };





  const openManageDialog = (user: any) => {
    setSelectedUser(user);
    setManageForm({
      role: user.role,
      status: user.status,
      region: user.region,
      notes: ''
    });
    setShowManageDialog(true);
  };

  const filteredUsers = data.users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRegion = filterRegion === 'all' || user.region === filterRegion;
    
    return matchesSearch && matchesRole && matchesStatus && matchesRegion;
  });

  const totalUsers = data.users.length;
  const activeUsers = data.users.filter(u => u.status === 'active').length;
  const volunteers = data.users.filter(u => u.volunteer).length;
  const admins = data.users.filter(u => u.role === 'admin').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live User Status' : 'Paused'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-green-600">
            Online: {data.users.filter(u => u.isOnline).length}/{data.users.length}
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
          <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts, roles, and permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volunteers</CardTitle>
            <Heart className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volunteers}</div>
            <p className="text-xs text-muted-foreground">Active volunteers</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
            <Crown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{admins}</div>
            <p className="text-xs text-muted-foreground">Administrators</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="users" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Users className="h-4 w-4 mr-2" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Heart className="h-4 w-4 mr-2" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* All Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-teal-600" />
                    User List
                  </CardTitle>
                  <CardDescription>Manage all registered users</CardDescription>
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
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="rescue_team">Rescue Team</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {data.regions.slice(1).map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar || ''} />
                              <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(user.role)}
                            <Badge className={getRoleColor(user.role)}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            {user.isOnline && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600">Online</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{user.region}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{user.reportsSubmitted}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(user.lastActivity)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openManageDialog(user)}
                              className="hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {user.status === 'active' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSuspendUser(user.id)}
                                className="hover:bg-red-100 text-red-600"
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleActivateUser(user.id)}
                                className="hover:bg-green-100 text-green-600"
                              >
                                <UserCheck className="h-4 w-4" />
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  toast.info(`Viewing details for user: ${user.name}`);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  toast.success(`Email sent to ${user.email}`);
                                }}>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  toast.success(`Contacting ${user.name} at ${user.phone}`);
                                }}>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Contact
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-purple-600" />
                    Volunteer Directory
                  </CardTitle>
                  <CardDescription>Manage volunteers and their specializations</CardDescription>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.volunteers.map((volunteer) => (
                  <Card key={volunteer.id} className="bg-white/50 border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{volunteer.name}</h4>
                          <p className="text-sm text-muted-foreground">{volunteer.email}</p>
                        </div>
                        <Badge className={getStatusColor(volunteer.status)}>
                          {volunteer.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">{volunteer.specialization}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{volunteer.experience} experience</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{volunteer.region}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">{volunteer.missionsCompleted} missions</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">{volunteer.rating}/5.0 rating</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-teal-600" />
                        <span className="text-sm">{volunteer.availability}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Last active: {formatDate(volunteer.lastActivity)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => toast.success(`Calling ${volunteer.name} at ${volunteer.phone}`)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => toast.success(`Email sent to ${volunteer.email}`)}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2"
                            onClick={() => handleManageUser(volunteer)}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  User Role Distribution
                </CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{data.users.filter(u => u.role === 'user').length}</div>
                        <div className="text-sm text-gray-600">Regular Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data.users.filter(u => u.role === 'volunteer').length}</div>
                        <div className="text-sm text-gray-600">Volunteers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{data.users.filter(u => u.role === 'rescue_team').length}</div>
                        <div className="text-sm text-gray-600">Rescue Teams</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{data.users.filter(u => u.role === 'admin').length}</div>
                        <div className="text-sm text-gray-600">Admins</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Total: {data.users.length} users
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-green-600" />
                  User Growth Trend
                </CardTitle>
                <CardDescription>Monthly user registration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data.users.filter(u => u.status === 'active').length}</div>
                        <div className="text-sm text-gray-600">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{data.users.filter(u => u.status === 'pending').length}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{data.users.filter(u => u.status === 'suspended').length}</div>
                        <div className="text-sm text-gray-600">Suspended</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      Status Distribution
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Active Users</span>
                        <span className="font-medium">{Math.round((data.users.filter(u => u.status === 'active').length / data.users.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(data.users.filter(u => u.status === 'active').length / data.users.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Manage User Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage User</DialogTitle>
            <DialogDescription>
              Update user role, status, and region
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                    {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={manageForm.role} onValueChange={(value) => setManageForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {data.roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={manageForm.status} onValueChange={(value) => setManageForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={manageForm.region} onValueChange={(value) => setManageForm(prev => ({ ...prev, region: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data.regions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={manageForm.notes}
                  onChange={(e) => setManageForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this user..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleManageUser} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Edit className="h-4 w-4 mr-2" />}
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
