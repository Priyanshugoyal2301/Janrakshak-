import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Shield,
  Activity,
  MapPin,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Trash2,
  Edit,
  Mail,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Clock,
  Globe,
  Settings
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getUserStatisticsFromSupabase, getAllUsersFromSupabase, UserProfile } from '@/lib/userSync';
import { useSupabaseAuthMinimal } from '@/contexts/SupabaseAuthContextMinimal';
import { toast } from 'sonner';

// shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const { user: supabaseUser, isAdmin } = useSupabaseAuthMinimal();
  
  // Statistics state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    criticalReports: 0,
    verifiedReports: 0,
  });

  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Reports state
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    console.log('AdminDashboard mounted, user:', supabaseUser, 'isAdmin:', isAdmin);
    fetchData();
    fetchUsers();
    fetchReports();
  }, []);

  const fetchData = async () => {
    console.log('Fetching admin data...');
    setLoading(true);
    try {
      // Fetch reports from Supabase
      const { data: reports, error: reportsError } = await supabase.from('flood_reports').select('id, status, severity');
      if (reportsError) {
        console.error('Reports error:', reportsError);
        // Don't throw error, just use empty array
      }

      // Fetch user statistics from Supabase
      const userStats = await getUserStatisticsFromSupabase();
      console.log('User stats:', userStats);

      setStats({
        totalUsers: userStats.total_users || 0,
        activeUsers: userStats.active_users || 0,
        totalReports: reports?.length || 0,
        pendingReports: reports?.filter(r => r.status === 'pending').length || 0,
        criticalReports: reports?.filter(r => r.severity === 'critical').length || 0,
        verifiedReports: reports?.filter(r => r.status === 'verified').length || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    console.log('Fetching users...');
    setUsersLoading(true);
    try {
      const allUsers = await getAllUsersFromSupabase(100, 0, searchTerm || undefined);
      console.log('Fetched users:', allUsers);
      
      // Ensure all users have proper structure
      const safeUsers = (allUsers || []).map(user => ({
        ...user,
        email: user.email || 'unknown@example.com',
        display_name: user.display_name || 'Unknown User',
        role: user.role || 'user',
        disabled: user.disabled || false,
        created_at: user.created_at || new Date().toISOString(),
        last_login: user.last_login || null,
        joined_at: user.joined_at || user.created_at || new Date().toISOString()
      }));
      
      setUsers(safeUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      toast.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchReports = async () => {
    console.log('Fetching reports...');
    setReportsLoading(true);
    try {
      const { data: reportsData, error } = await supabase
        .from('flood_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Reports error:', error);
        setReports([]);
        return;
      }
      
      // Ensure all reports have proper structure
      const safeReports = (reportsData || []).map(report => ({
        ...report,
        title: report.title || 'Untitled Report',
        description: report.description || 'No description available',
        location: report.location || 'Unknown Location',
        status: report.status || 'pending',
        severity: report.severity || 'low',
        created_at: report.created_at || new Date().toISOString()
      }));
      
      console.log('Fetched reports:', safeReports);
      setReports(safeReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
      toast.error('Failed to fetch reports');
    } finally {
      setReportsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.display_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'emergency_responder': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color, description }: any) => (
    <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
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
      </CardContent>
    </Card>
  );

  console.log('Rendering AdminDashboard, loading:', loading, 'isAdmin:', isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Manage your flood monitoring platform</p>
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Welcome, {supabaseUser?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Users"
                value={stats.totalUsers.toLocaleString()}
                change={12}
                icon={Users}
                color="text-blue-600"
                description="Registered users"
              />
              <StatCard
                title="Active Users"
                value={stats.activeUsers.toLocaleString()}
                change={8}
                icon={UserCheck}
                color="text-green-600"
                description="Recently active"
              />
              <StatCard
                title="Total Reports"
                value={stats.totalReports.toLocaleString()}
                change={-3}
                icon={FileText}
                color="text-purple-600"
                description="Flood reports"
              />
              <StatCard
                title="Critical Reports"
                value={stats.criticalReports.toLocaleString()}
                change={5}
                icon={AlertTriangle}
                color="text-red-600"
                description="Urgent alerts"
              />
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="h-6 w-6 mb-2 text-blue-600" />
                    <span className="font-medium">Manage Users</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col hover:bg-green-50 hover:border-green-200 transition-colors"
                    onClick={() => setActiveTab('reports')}
                  >
                    <FileText className="h-6 w-6 mb-2 text-green-600" />
                    <span className="font-medium">Review Reports</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-24 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors"
                    onClick={() => setActiveTab('analytics')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2 text-purple-600" />
                    <span className="font-medium">View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Recent Reports
                  </CardTitle>
                  <CardDescription>Latest flood reports from users</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {reports.slice(0, 5).map((report) => (
                        <div key={report.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md">
                            <MapPin className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{report.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {typeof report.location === 'string' 
                                ? report.location 
                                : report.location?.address || 'Unknown Location'
                              }
                            </p>
                          </div>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                      {reports.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No reports found</p>
                          <p className="text-sm">Reports will appear here as users submit them</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    System Status
                  </CardTitle>
                  <CardDescription>Platform health and performance</CardDescription>
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
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={fetchUsers} disabled={usersLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${usersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-white/50 border-gray-200">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter: {filterRole === 'all' ? 'All Roles' : filterRole}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterRole('all')}>All Roles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRole('user')}>Users</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRole('admin')}>Admins</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterRole('emergency_responder')}>Emergency Responders</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="border rounded-lg overflow-hidden bg-white/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading users...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No users found</p>
                            <p className="text-sm">Users will appear here once they register</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id} className="hover:bg-gray-50/50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.photo_url || ''} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                    {(user.display_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.display_name || 'Unknown User'}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getRoleColor(user.role)}>
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={user.disabled ? 'bg-red-100 text-red-800 border-red-200' : 'bg-green-100 text-green-800 border-green-200'}>
                                {user.disabled ? 'Disabled' : 'Active'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(user.last_login)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(user.joined_at)}
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
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-green-600" />
                      Report Management
                    </CardTitle>
                    <CardDescription>Review and manage flood reports</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={fetchReports} disabled={reportsLoading}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${reportsLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm" className="bg-white/50 border-gray-200">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead>Report</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportsLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                              Loading reports...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : reports.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No reports found</p>
                            <p className="text-sm">Reports will appear here as users submit them</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        reports.map((report) => (
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
                                <span className="text-sm">
                                  {typeof report.location === 'string' 
                                    ? report.location 
                                    : report.location?.address || 'Unknown Location'
                                  }
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(report.severity)}>
                                {report.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(report.created_at)}
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
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Verify Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Mark Critical
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Report
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
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
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    User Growth
                  </CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mr-4 text-gray-300" />
                    <div>
                      <p className="font-medium">Chart coming soon</p>
                      <p className="text-sm">Data visualization will be added here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-green-600" />
                    Report Status
                  </CardTitle>
                  <CardDescription>Distribution of report statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mr-4 text-gray-300" />
                    <div>
                      <p className="font-medium">Chart coming soon</p>
                      <p className="text-sm">Analytics will be added here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-purple-600" />
                  Platform Metrics
                </CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-sm text-green-700 font-medium">Uptime</div>
                    <div className="text-xs text-green-600 mt-1">Last 30 days</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
                    <div className="text-sm text-blue-700 font-medium">Avg Response Time</div>
                    <div className="text-xs text-blue-600 mt-1">API calls</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="text-3xl font-bold text-purple-600 mb-2">1,234</div>
                    <div className="text-sm text-purple-700 font-medium">API Calls Today</div>
                    <div className="text-xs text-purple-600 mt-1">Active requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;