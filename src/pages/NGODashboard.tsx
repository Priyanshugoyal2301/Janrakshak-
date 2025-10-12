import React, { useState, useEffect } from "react";
import NGOLayout from "@/components/NGOLayout";
import { useRoleAwareAuth } from "@/contexts/RoleAwareAuthContext";
import { UserRole } from "@/lib/roleBasedAuth";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Heart,
  Target,
  Activity,
  Building2,
  GraduationCap,
  BarChart3,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NGOMetrics {
  totalVolunteers: number;
  activeTraining: number;
  completedPrograms: number;
  districtCoverage: number;
  recentActivities: Array<{
    id: string;
    type: "training" | "rescue" | "awareness";
    title: string;
    location: string;
    date: string;
    participants: number;
    status: string;
  }>;
  volunteerStats: Array<{
    specialization: string;
    count: number;
    active: number;
  }>;
  impactMetrics: {
    peopleHelped: number;
    trainingHours: number;
    resourcesDistributed: number;
  };
}

const NGODashboard: React.FC = () => {
  const { userProfile } = useRoleAwareAuth();
  const [metrics, setMetrics] = useState<NGOMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNGOMetrics();
  }, [userProfile]);

  const fetchNGOMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Apply district filter for NGO access
      const districtFilter = userProfile?.district;

      // Fetch volunteer data
      const { data: volunteers, error: volunteersError } = await supabase
        .from("volunteers")
        .select("*")
        .eq("district", districtFilter)
        .eq("is_active", true);

      if (volunteersError) throw volunteersError;

      // Fetch training sessions specific to NGO's district
      const { data: trainingSessions, error: trainingError } = await supabase
        .from("training_sessions")
        .select("*")
        .eq("district", districtFilter)
        .order("start_date", { ascending: false });

      if (trainingError) throw trainingError;

      // Fetch organization data
      const { data: organizations, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("district", districtFilter)
        .eq("organization_type", "NGO");

      if (orgError) throw orgError;

      // Process metrics
      const totalVolunteers = volunteers?.length || 0;
      const activeTraining =
        trainingSessions?.filter((s) => s.status === "in_progress").length || 0;
      const completedPrograms =
        trainingSessions?.filter((s) => s.status === "completed").length || 0;

      // Mock district coverage based on training sessions
      const uniqueDistricts = new Set(
        trainingSessions?.map((s) => s.district).filter(Boolean)
      );
      const districtCoverage = uniqueDistricts.size;

      // Recent activities (mock data based on training sessions)
      const recentActivities =
        trainingSessions?.slice(0, 8).map((session) => ({
          id: session.id,
          type: "training" as const,
          title: session.title,
          location: `${session.district}, ${session.state}`,
          date: session.start_date,
          participants: session.actual_participants || 0,
          status: session.status,
        })) || [];

      // Volunteer specializations stats
      const specializationCounts =
        volunteers?.reduce((acc, volunteer) => {
          const specializations = volunteer.specializations || [];
          specializations.forEach((spec: string) => {
            if (!acc[spec]) {
              acc[spec] = { count: 0, active: 0 };
            }
            acc[spec].count++;
            if (volunteer.availability_status === "available") {
              acc[spec].active++;
            }
          });
          return acc;
        }, {} as Record<string, { count: number; active: number }>) || {};

      const volunteerStats = Object.entries(specializationCounts).map(
        ([specialization, data]) => ({
          specialization,
          count: (data as { count: number; active: number }).count,
          active: (data as { count: number; active: number }).active,
        })
      );

      // Impact metrics (calculated from available data)
      const impactMetrics = {
        peopleHelped:
          trainingSessions?.reduce(
            (sum, session) => sum + (session.actual_participants || 0),
            0
          ) || 0,
        trainingHours:
          volunteers?.reduce(
            (sum, vol) => sum + (vol.total_training_hours || 0),
            0
          ) || 0,
        resourcesDistributed:
          volunteers?.reduce(
            (sum, vol) => sum + (vol.total_rescue_operations || 0),
            0
          ) || 0,
      };

      setMetrics({
        totalVolunteers,
        activeTraining,
        completedPrograms,
        districtCoverage,
        recentActivities,
        volunteerStats,
        impactMetrics,
      });
    } catch (error) {
      console.error("Error fetching NGO metrics:", error);
      setError(
        "Failed to load dashboard data. Please check database connection."
      );
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "training":
        return "bg-blue-100 text-blue-800";
      case "rescue":
        return "bg-red-100 text-red-800";
      case "awareness":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <NGOLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
        </div>
      </NGOLayout>
    );
  }

  if (error) {
    return (
      <NGOLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Dashboard Error
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchNGOMetrics} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </NGOLayout>
    );
  }

  return (
    <NGOLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              NGO Operations Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {userProfile?.name}</p>
            <p className="text-sm text-gray-500">
              {userProfile?.organization} • {userProfile?.district},{" "}
              {userProfile?.state}
            </p>
          </div>
          <Button
            onClick={fetchNGOMetrics}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Volunteers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.totalVolunteers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered in your district
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Training
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.activeTraining}
              </div>
              <p className="text-xs text-muted-foreground">
                Programs in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Programs
              </CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.completedPrograms}
              </div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                People Helped
              </CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.impactMetrics.peopleHelped.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Through training programs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="impact">Impact Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Volunteer Specializations</CardTitle>
                  <CardDescription>
                    Skills distribution in your team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics?.volunteerStats.map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <span className="text-sm font-medium capitalize">
                            {stat.specialization}
                          </span>
                          <p className="text-xs text-gray-600">
                            {stat.active} available
                          </p>
                        </div>
                        <Badge variant="secondary">{stat.count} total</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                  <CardDescription>
                    Your organization's contribution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">People Trained</span>
                      </div>
                      <span className="font-bold">
                        {metrics?.impactMetrics.peopleHelped.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Training Hours</span>
                      </div>
                      <span className="font-bold">
                        {metrics?.impactMetrics.trainingHours.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Operations Completed</span>
                      </div>
                      <span className="font-bold">
                        {metrics?.impactMetrics.resourcesDistributed}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="volunteers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Management</CardTitle>
                <CardDescription>
                  Your registered volunteers and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics?.totalVolunteers}
                    </div>
                    <div className="text-sm font-medium">Total Volunteers</div>
                  </div>
                  {metrics?.volunteerStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 border rounded-lg"
                    >
                      <div className="text-2xl font-bold text-green-600">
                        {stat.active}
                      </div>
                      <div className="text-sm font-medium capitalize">
                        {stat.specialization}
                      </div>
                      <div className="text-xs text-gray-600">available</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest training sessions and programs in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={getActivityColor(activity.type)}>
                            {activity.type}
                          </Badge>
                          <h4 className="font-medium">{activity.title}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {activity.participants} participants
                          </span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(activity.status)}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    People Reached
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {metrics?.impactMetrics.peopleHelped.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Individuals trained through your programs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Training Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {metrics?.impactMetrics.trainingHours.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Hours of training provided by volunteers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Operations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {metrics?.impactMetrics.resourcesDistributed}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Emergency response operations completed
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </NGOLayout>
  );
};

export default NGODashboard;
