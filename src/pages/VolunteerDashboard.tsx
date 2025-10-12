import React, { useState, useEffect } from "react";
import UserLayout from "@/components/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  Users,
  MapPin,
  AlertTriangle,
  Activity,
  Building2,
  GraduationCap,
  BarChart3,
  Calendar,
  FileText,
  Target,
  TrendingUp,
  Shield,
  HandHeart,
  Clock,
  Award,
  Heart,
  Zap,
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

interface VolunteerMetrics {
  totalActivities: number;
  hoursContributed: number;
  peopleHelped: number;
  trainingCompleted: number;
  recentActivities: Array<{
    id: string;
    title: string;
    location: string;
    date: string;
    status: string;
    participants: number;
  }>;
  skillAreas: Array<{
    area: string;
    level: string;
  }>;
}

const VolunteerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [metrics, setMetrics] = useState<VolunteerMetrics>({
    totalActivities: 0,
    hoursContributed: 0,
    peopleHelped: 0,
    trainingCompleted: 0,
    recentActivities: [],
    skillAreas: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user && userProfile) {
      fetchVolunteerMetrics();
    }
  }, [user, userProfile]);

  const fetchVolunteerMetrics = async () => {
    setIsLoading(true);
    try {
      // Mock data for volunteer metrics
      const mockMetrics: VolunteerMetrics = {
        totalActivities: 25,
        hoursContributed: 120,
        peopleHelped: 85,
        trainingCompleted: 12,
        recentActivities: [
          {
            id: "1",
            title: "Community Safety Training",
            location: "Central District",
            date: "2024-01-15",
            status: "Completed",
            participants: 15,
          },
          {
            id: "2",
            title: "Emergency Response Drill",
            location: "North Zone",
            date: "2024-01-12",
            status: "Completed",
            participants: 22,
          },
          {
            id: "3",
            title: "First Aid Workshop",
            location: "South District",
            date: "2024-01-18",
            status: "Scheduled",
            participants: 0,
          },
        ],
        skillAreas: [
          { area: "Emergency Response", level: "Advanced" },
          { area: "First Aid", level: "Certified" },
          { area: "Community Outreach", level: "Intermediate" },
          { area: "Disaster Preparedness", level: "Advanced" },
        ],
      };

      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Error fetching volunteer metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <NGOLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading volunteer dashboard...</div>
        </div>
      </NGOLayout>
    );
  }

  if (!user || !userProfile) {
    return (
      <NGOLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-red-600">
            Access denied. Volunteer credentials required.
          </div>
        </div>
      </NGOLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      Completed: "bg-green-100 text-green-800",
      Scheduled: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      statusMap[status as keyof typeof statusMap] || "bg-gray-100 text-gray-800"
    );
  };

  const getLevelBadge = (level: string) => {
    const levelMap = {
      Certified: "bg-emerald-100 text-emerald-800",
      Advanced: "bg-blue-100 text-blue-800",
      Intermediate: "bg-yellow-100 text-yellow-800",
      Beginner: "bg-gray-100 text-gray-800",
    };
    return (
      levelMap[level as keyof typeof levelMap] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <UserLayout 
      title="Volunteer Dashboard"
      description="Track your volunteer activities and community impact"
    >
      <div className="space-y-6">
        {/* Volunteer-specific Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
              <HandHeart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.totalActivities}</div>
              <p className="text-xs text-muted-foreground">Community service events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Contributed</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{metrics.hoursContributed}</div>
              <p className="text-xs text-muted-foreground">Volunteer service hours</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">People Helped</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.peopleHelped}</div>
              <p className="text-xs text-muted-foreground">Community members assisted</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Training Completed</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.trainingCompleted}</div>
              <p className="text-xs text-muted-foreground">Certification programs</p>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer-Specific Content */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Your Volunteer Impact
            </h2>
            <p className="text-gray-600 mt-1">
              Track your community service and skill development
              and impact.
            </p>
          </div>
          <Badge variant="outline" className="text-teal-600 border-teal-200">
            <HandHeart className="w-4 h-4 mr-1" />
            Volunteer
          </Badge>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-teal-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Activities
              </CardTitle>
              <Activity className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">
                {metrics.totalActivities}
              </div>
              <p className="text-xs text-gray-600">
                Community engagement events
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Hours Contributed
              </CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.hoursContributed}
              </div>
              <p className="text-xs text-gray-600">Volunteer service hours</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                People Helped
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics.peopleHelped}
              </div>
              <p className="text-xs text-gray-600">
                Community members assisted
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Training Completed
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.trainingCompleted}
              </div>
              <p className="text-xs text-gray-600">Certification courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for detailed information */}
        <Tabs defaultValue="activities" className="space-y-4">
          <TabsList>
            <TabsTrigger value="activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="skills">Skills & Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-teal-600" />
                  Recent Volunteer Activities
                </CardTitle>
                <CardDescription>
                  Your recent community engagement and volunteer work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{activity.title}</h3>
                          <Badge className={getStatusBadge(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {activity.location} •{" "}
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                        {activity.participants > 0 && (
                          <div className="text-sm text-gray-600">
                            <Users className="w-3 h-3 inline mr-1" />
                            {activity.participants} participants
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-teal-600" />
                  Skills & Certifications
                </CardTitle>
                <CardDescription>
                  Your verified skills and certification levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.skillAreas.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{skill.area}</h3>
                        <p className="text-sm text-gray-600">
                          Professional certification area
                        </p>
                      </div>
                      <Badge className={getLevelBadge(skill.level)}>
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserLayout>
  );
};

export default VolunteerDashboard;
