import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import UserManagement from '@/components/UserManagement';
import ReportManagement from '@/components/ReportManagement';
import StatCard from '@/components/StatCard';

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
        .select('*, user_profiles(*)')
        .order('created_at', { ascending: false })
        .limit(5);
      if (activityError) throw new Error('Failed to fetch recent activity');

      const { data: recentLocations, error: locationsError } = await supabase
        .from('flood_reports')
        .select('location, severity, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (locationsError) throw new Error('Failed to fetch recent locations');

      const { data: users, error: usersError } = await supabase.from('user_profiles').select('id, is_active');
      if (usersError) throw new Error('Failed to fetch users');

      const { data: reports, error: reportsError } = await supabase.from('flood_reports').select('id, status, severity');
      if (reportsError) throw new Error('Failed to fetch reports');

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter(u => u.is_active).length,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'pending').length,
        criticalReports: reports.filter(r => r.severity === 'critical').length,
        verifiedReports: reports.filter(r => r.status === 'verified').length,
        recentActivity: recentActivity.map(item => ({
          id: item.id,
          title: item.title,
          severity: item.severity,
          status: item.status,
          time: new Date(item.created_at).toLocaleString(),
          user: item.user_profiles?.full_name || 'Unknown User',
          avatar: item.user_profiles?.avatar_url
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2 py-1.5 px-3 rounded-full">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span className="text-sm">Real-time</span>
              </Badge>
              <Button size="icon" variant="outline" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon={<Users className="h-5 w-5 text-muted-foreground" />} 
            detail={`${stats.activeUsers} active`}
            color="blue"
            loading={loading}
          />
          <StatCard 
            title="Total Reports" 
            value={stats.totalReports} 
            icon={<BarChart3 className="h-5 w-5 text-muted-foreground" />} 
            detail={`${stats.pendingReports} pending`}
            color="green"
            loading={loading}
          />
          <StatCard 
            title="Critical Reports" 
            value={stats.criticalReports} 
            icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />} 
            detail={`${Math.round((stats.criticalReports / stats.totalReports) * 100) || 0}% of total`}
            color="red"
            loading={loading}
          />
          <StatCard 
            title="Verified Reports" 
            value={stats.verifiedReports} 
            icon={<CheckCircle className="h-5 w-5 text-muted-foreground" />} 
            detail={`${Math.round((stats.verifiedReports / stats.totalReports) * 100) || 0}% verified`}
            color="purple"
            loading={loading}
          />
        </div>

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
      </main>
    </div>
  );
};

export default AdminDashboard;