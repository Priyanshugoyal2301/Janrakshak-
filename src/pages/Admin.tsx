import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle,
  Activity,
  MapPin,
  Bell,
  RefreshCw,
  ShieldCheck,
  ArrowUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import UserManagement from '@/components/UserManagement';
import ReportManagement from '@/components/ReportManagement';
import StatCard from '@/components/StatCard';
import AdminBarChart from '@/components/AdminBarChart';
import AdminLineChart from '@/components/AdminLineChart';
import AdminPieChart from '@/components/AdminPieChart';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    criticalReports: 0,
    verifiedReports: 0,
    recentActivity: [],
    recentLocations: []
  });

  // Framer Motion variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const gridVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  useEffect(() => {
    fetchData();
    const reportsSubscription = supabase
      .channel('flood_reports_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'flood_reports' 
      }, fetchData)
      .subscribe();

    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'user_profiles' 
      }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(reportsSubscription);
      supabase.removeChannel(usersSubscription);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: recentActivity, error: activityError } = await supabase
        .from('flood_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (activityError) throw new Error('Failed to fetch recent activity');

      const { data: recentLocations, error: locationsError } = await supabase
        .from('flood_reports')
        .select('location, severity, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (locationsError) throw new Error('Failed to fetch recent locations');

      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('id, last_sign_in_at, created_at');
      if (usersError) throw new Error('Failed to fetch users');

      const { data: reports, error: reportsError } = await supabase.from('flood_reports').select('id, status, severity');
      if (reportsError) throw new Error('Failed to fetch reports');

      // Compute active users as those signed in within the last 30 days
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
      const now = Date.now();
      const activeUsersCount = (users || []).filter((u: any) => {
        if (!u.last_sign_in_at) return false;
        const last = new Date(u.last_sign_in_at).getTime();
        return !isNaN(last) && (now - last) <= THIRTY_DAYS_MS;
      }).length;

      setStats({
        totalUsers: users.length,
        activeUsers: activeUsersCount,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        verifiedReports: reports.filter(r => r.status === 'verified').length,
        recentActivity: recentActivity.map((item: any) => ({
          id: item.id,
          title: item.title,
          severity: item.severity,
          status: item.status,
          time: new Date(item.created_at).toLocaleString(),
          user: item.user_name || 'Unknown User',
          avatar: undefined
        })),
        recentLocations: recentLocations.map(item => ({
          location: item.location,
          severity: item.severity,
          time: new Date(item.created_at).toLocaleString()
        }))
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-teal-500 to-green-400 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
        <div className="relative z-10 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ShieldCheck className="h-10 w-10 text-white" />
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <Badge variant="outline" className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-white/20 text-white">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span className="text-sm">Real-time</span>
            </Badge>
          </div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Manage users, reports, and system analytics for the JalRakshak platform with a modern, unified dashboard experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
              <BarChart3 className="w-4 h-4 mr-2" />
              Report Analytics
            </Button>
          </div>
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full opacity-10"></div>
        </div>
      </div>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm opacity-80">Total Users</div>
            <div className="flex items-center justify-center mt-2 text-xs">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>{stats.activeUsers} active</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <div className="text-sm opacity-80">Total Reports</div>
            <div className="flex items-center justify-center mt-2 text-xs">
              <Activity className="w-3 h-3 mr-1" />
              <span>{stats.pendingReports} pending</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold">{stats.criticalReports}</div>
            <div className="text-sm opacity-80">Critical Reports</div>
            <div className="flex items-center justify-center mt-2 text-xs">
              <Bell className="w-3 h-3 mr-1" />
              <span>{stats.totalReports > 0 ? Math.round((stats.criticalReports / stats.totalReports) * 100) : 0}% of total</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold">{stats.verifiedReports}</div>
            <div className="text-sm opacity-80">Verified Reports</div>
            <div className="flex items-center justify-center mt-2 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>{stats.totalReports > 0 ? Math.round((stats.verifiedReports / stats.totalReports) * 100) : 0}% verified</span>
            </div>
          </div>
        </div>
        {/* Tabs Section */}
        <div className="mt-10">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                Report Management
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
            {/* Example Bar Chart for Analytics */}
            <div className="mb-8">
              <AdminBarChart
                title="Reports by Month"
                data={[
                  { x: 'Jan', y: 12 },
                  { x: 'Feb', y: 19 },
                  { x: 'Mar', y: 7 },
                  { x: 'Apr', y: 15 },
                  { x: 'May', y: 22 },
                  { x: 'Jun', y: 9 },
                ]}
                color="#22d3ee"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <AdminLineChart
                title="User Growth"
                data={[
                  { x: 'Jan', y: 100 },
                  { x: 'Feb', y: 150 },
                  { x: 'Mar', y: 200 },
                  { x: 'Apr', y: 300 },
                  { x: 'May', y: 400 },
                  { x: 'Jun', y: 650 },
                ]}
                color="#6366f1"
              />
              <AdminPieChart
                title="Report Status"
                labels={["Pending", "Verified", "Critical"]}
                data={[12, 28, 8]}
                colors={["#fbbf24", "#22c55e", "#ef4444"]}
              />
            </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        stats.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4 mb-4 pb-4 border-b last:border-0">
                            <Avatar className="h-10 w-10 border">
                              <AvatarImage src={activity.avatar} />
                              <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={activity.severity === 'critical' ? 'destructive' : activity.severity === 'high' ? 'destructive' : activity.severity === 'medium' ? 'warning' : 'secondary'}>
                                  {activity.severity}
                                </Badge>
                                <Badge variant={activity.status === 'verified' ? 'success' : activity.status === 'pending' ? 'outline' : 'secondary'}>
                                  {activity.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-2">
                                {activity.user} • {activity.time}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Hotspot Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[350px]">
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-4 w-[100px]" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        stats.recentLocations.map((location, index) => (
                          <div key={index} className="flex items-start gap-4 mb-4 pb-4 border-b last:border-0">
                            <div className="bg-muted rounded-full p-2 mt-1">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium">{location.location?.address || 'Unknown Location'}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={location.severity === 'critical' ? 'destructive' : location.severity === 'high' ? 'destructive' : 'warning'}>
                                  {location.severity}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">{location.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <UserManagement />
            </TabsContent>
            <TabsContent value="reports" className="mt-6">
              <ReportManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;