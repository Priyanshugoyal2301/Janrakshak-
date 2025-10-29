import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoleAwareAuth } from "@/contexts/RoleAwareAuthContext";
import {
  Menu,
  X,
  LogOut,
  Home,
  FileText,
  Map,
  BarChart3,
  Plus,
  Building,
  Phone,
  Bell,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw,
  MapPin,
  Users,
  CloudRain,
  Heart,
  Shield,
  GraduationCap,
  BookOpen,
} from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const UserLayout = ({
  children,
  title = "Dashboard",
  description = "Welcome back",
}: UserLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>("");
  const { user, userProfile, signOut } = useRoleAwareAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get role-based header colors only
  const getRoleHeaderColors = () => {
    const role = userProfile?.role?.toUpperCase();
    switch (role) {
      case "CITIZEN":
      case "USER":
        return {
          headerBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
          headerText: "text-white",
          roleLabel: "CITIZEN",
          roleIcon: "Users",
        };
      case "VOLUNTEER":
        return {
          headerBg: "bg-gradient-to-r from-green-500 to-teal-600",
          headerText: "text-white",
          roleLabel: "VOLUNTEER",
          roleIcon: "Heart",
        };
      case "NGO":
        return {
          headerBg: "bg-gradient-to-r from-purple-500 to-pink-600",
          headerText: "text-white",
          roleLabel: "NGO PARTNER",
          roleIcon: "Heart",
        };
      case "DMA":
        return {
          headerBg: "bg-gradient-to-r from-orange-500 to-red-600",
          headerText: "text-white",
          roleLabel: "DMA OFFICER",
          roleIcon: "Shield",
        };
      case "ADMIN":
        return {
          headerBg: "bg-gradient-to-r from-red-600 to-rose-700",
          headerText: "text-white",
          roleLabel: "ADMIN",
          roleIcon: "Shield",
        };
      default:
        return {
          headerBg: "bg-gradient-to-r from-teal-500 to-blue-600",
          headerText: "text-white",
          roleLabel: "USER",
          roleIcon: "Users",
        };
    }
  };

  const roleColors = getRoleHeaderColors();

  const handleSignOut = async () => {
    try {
      console.log("🚪 UserLayout: Sign out button clicked");
      await signOut();
      console.log("🏠 UserLayout: Navigating to home page");
      navigate("/");
    } catch (error) {
      console.error("❌ UserLayout: Error signing out:", error);
    }
  };

  // Detect user's location if not set
  useEffect(() => {
    const detectLocation = async () => {
      // Only detect if user doesn't have location set
      if (
        !userProfile?.state &&
        !userProfile?.district &&
        navigator.geolocation
      ) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000, // 5 minutes
              });
            }
          );

          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get location details
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();

            if (data.countryName === "India") {
              const locationString = data.locality
                ? `${data.locality}, ${data.principalSubdivision}`
                : data.principalSubdivision || "India";
              setDetectedLocation(locationString);

              // Location detected and stored locally
              // Note: Auto-profile update removed for now
            }
          } catch (geocodeError) {
            console.error("Error with reverse geocoding:", geocodeError);
            setDetectedLocation("Location detected");
          }
        } catch (error) {
          console.error("Error detecting location:", error);
          setDetectedLocation("Location unavailable");
        }
      }
    };

    if (user && userProfile) {
      detectLocation();
    }
  }, [user, userProfile]);

  // Role-aware navigation
  const getNavigationItems = () => {
    const role = userProfile?.role?.toUpperCase();

    if (role === "VOLUNTEER") {
      return [
        { name: "Dashboard", href: "/volunteer-dashboard", icon: Home },
        {
          name: "My Activities",
          href: "/volunteer/activities",
          icon: Activity,
        },
        { name: "Training", href: "/volunteer/training", icon: GraduationCap },
        { name: "Community", href: "/community", icon: Users },
        { name: "Reports", href: "/volunteer/reports", icon: FileText },
      ];
    } else if (role === "NGO") {
      return [
        { name: "Dashboard", href: "/ngo-dashboard", icon: Home },
        { name: "Active Alerts", href: "/ngo/alerts", icon: AlertTriangle },
        { name: "User Management", href: "/ngo/users", icon: Users },
        { name: "Training Programs", href: "/ngo/training", icon: BookOpen },
        { name: "Analytics", href: "/ngo/analytics", icon: BarChart3 },
      ];
    } else {
      // Default for CITIZEN and other roles
      return [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Reports", href: "/reports", icon: FileText },
        { name: "Community", href: "/community", icon: Users },
        {
          name: "Flood Prediction",
          href: "/flood-prediction",
          icon: CloudRain,
        },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
      ];
    }
  };

  const navigation = getNavigationItems();

  const quickActions = [
    { name: "Find Shelters", href: "/shelters", icon: Building },
    { name: "Emergency Contacts", href: "/emergency-contacts", icon: Phone },
    { name: "View Alerts", href: "/alerts", icon: Bell },
  ];

  const profileActions = [
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  const handleNavigation = (item: any) => {
    console.log(
      "Navigation clicked:",
      item.name,
      "from:",
      location.pathname,
      "to:",
      item.href
    );

    // Prevent navigation if already on the same page
    if (location.pathname === item.href) {
      console.log("Already on same page, just closing sidebar");
      setSidebarOpen(false);
      return;
    }

    console.log("Navigating to:", item.href);

    // Close sidebar first for smoother UX
    setSidebarOpen(false);

    // Small delay to allow sidebar animation to complete
    setTimeout(() => {
      navigate(item.href, { replace: false });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-100 to-blue-200 text-gray-700 backdrop-blur-xl shadow-2xl border border-teal-200 rounded-r-2xl transform transition-all duration-300 ease-out lg:translate-x-0 lg:left-4 lg:top-4 lg:bottom-4 lg:rounded-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-teal-200">
          <div className="flex items-center space-x-2">
            <img src="/favicon.svg" alt="JanRakshak Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-teal-700">JanRakshak</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-teal-700 hover:bg-teal-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? "bg-teal-600 text-white" : "hover:bg-teal-200"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </div>

          <div className="border-t border-teal-200 my-4"></div>

          <div className="space-y-1">
            {quickActions.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? "bg-teal-600 text-white" : "hover:bg-teal-200"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </div>

          <div className="border-t border-teal-200 my-4"></div>

          <div className="space-y-1">
            {profileActions.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? "bg-teal-600 text-white" : "hover:bg-teal-200"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Button>
              );
            })}
          </div>

          <div className="border-t border-teal-200 my-4"></div>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-100"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Role-based Header Bar */}
        <div
          className={`${roleColors.headerBg} ${roleColors.headerText} shadow-lg mx-4 mt-4 px-6 py-4 rounded-xl`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  <Badge
                    variant="outline"
                    className="text-xs bg-white/20 border-white/30 text-white flex items-center gap-1"
                  >
                    {roleColors.roleIcon === "User" && (
                      <Users className="w-3 h-3" />
                    )}
                    {roleColors.roleIcon === "Users" && (
                      <Users className="w-3 h-3" />
                    )}
                    {roleColors.roleIcon === "Heart" && (
                      <Heart className="w-3 h-3" />
                    )}
                    {roleColors.roleIcon === "Shield" && (
                      <Shield className="w-3 h-3" />
                    )}
                    {roleColors.roleLabel}
                  </Badge>
                </div>
                <p className="text-sm opacity-90">
                  {userProfile?.role?.toUpperCase() === "CITIZEN" &&
                    "Community Member"}
                  {userProfile?.role?.toUpperCase() === "USER" &&
                    "Community Member"}
                  {userProfile?.role?.toUpperCase() === "VOLUNTEER" &&
                    "Community Volunteer"}
                  {userProfile?.role?.toUpperCase() === "NGO" &&
                    "NGO Partner Organization"}
                  {userProfile?.role?.toUpperCase() === "DMA" &&
                    "District Magistrate Office"}
                  {userProfile?.role?.toUpperCase() === "ADMIN" &&
                    "System Administrator"}
                  {!userProfile?.role && "Welcome to JanRakshak"}
                  {user?.email && ` • ${user.email}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <div className="text-xs text-white/80 hidden md:block">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/50 hover:bg-white/30 bg-white/20 font-medium"
                  onClick={async () => {
                    if (navigator.geolocation && user && userProfile) {
                      try {
                        const position = await new Promise<GeolocationPosition>(
                          (resolve, reject) => {
                            navigator.geolocation.getCurrentPosition(
                              resolve,
                              reject,
                              {
                                enableHighAccuracy: true,
                                timeout: 10000,
                                maximumAge: 0, // Force fresh location
                              }
                            );
                          }
                        );

                        const { latitude, longitude } = position.coords;

                        const response = await fetch(
                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        const data = await response.json();

                        if (data.countryName === "India") {
                          setDetectedLocation(
                            `${data.locality || ""}, ${
                              data.principalSubdivision || ""
                            }`
                          );
                          // Note: Profile update functionality removed for now
                        }
                      } catch (error) {
                        console.error("Error updating location:", error);
                      }
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Update Location</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white/50 hover:bg-white/30 bg-white/20 font-medium"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-white/20 border-white/30 text-white hidden lg:flex"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {userProfile?.district && userProfile?.state
                  ? `${userProfile.district}, ${userProfile.state}`
                  : userProfile?.state
                  ? userProfile.state
                  : detectedLocation || "Location not set"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 pt-4">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
