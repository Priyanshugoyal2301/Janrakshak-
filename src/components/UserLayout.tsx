import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
  CloudRain
} from 'lucide-react';

interface UserLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const UserLayout = ({ children, title = "Dashboard", description = "Welcome back" }: UserLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Detect user's location if not set
  useEffect(() => {
    const detectLocation = async () => {
      // Only detect if user doesn't have location set
      if (!userProfile?.location?.state && !userProfile?.location?.district && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            });
          });

          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get location details
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            
            if (data.countryName === 'India') {
              const locationString = data.locality 
                ? `${data.locality}, ${data.principalSubdivision}`
                : data.principalSubdivision || 'India';
              setDetectedLocation(locationString);
              
              // Auto-update user profile with detected location
              if (currentUser && userProfile) {
                await updateUserProfile({
                  location: {
                    state: data.principalSubdivision || '',
                    district: data.locality || '',
                    coordinates: {
                      lat: latitude,
                      lng: longitude
                    }
                  }
                });
              }
            }
          } catch (geocodeError) {
            console.error('Error with reverse geocoding:', geocodeError);
            setDetectedLocation('Location detected');
          }
        } catch (error) {
          console.error('Error detecting location:', error);
          setDetectedLocation('Location unavailable');
        }
      }
    };

    if (currentUser && userProfile) {
      detectLocation();
    }
  }, [currentUser, userProfile, updateUserProfile]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Reports", href: "/reports", icon: FileText },
    { name: "Community & Nearby", href: "/community", icon: Users },
    { name: "Flood Prediction", href: "/flood-prediction", icon: CloudRain },
    { name: "Analytics", href: "/dashboard", icon: BarChart3, tab: "analytics" },
  ];

  const quickActions = [
    { name: "New Report", href: "/reports", icon: Plus },
    { name: "Find Shelters", href: "/shelters", icon: Building },
    { name: "Emergency Contacts", href: "/emergency-contacts", icon: Phone },
    { name: "View Alerts", href: "/alerts", icon: Bell },
  ];

  const profileActions = [
    { name: "Profile Settings", href: "/profile", icon: Settings },
  ];

  const handleNavigation = (item: any) => {
    if (item.tab) {
      // Navigate to dashboard with specific tab
      navigate('/dashboard', { state: { activeTab: item.tab } });
    } else {
      navigate(item.href);
    }
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-teal-100 to-blue-200 text-gray-700 backdrop-blur-xl shadow-lg border-r border-teal-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
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
              const isActive = location.pathname === item.href && (!item.tab || location.hash === `#${item.tab}`);
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? 'bg-teal-600 text-white' : 'hover:bg-teal-200'
                  }`}
                  onClick={() => handleNavigation(item)}
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
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? 'bg-teal-600 text-white' : 'hover:bg-teal-200'
                  }`}
                  onClick={() => handleNavigation(item)}
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
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start text-teal-700 ${
                    isActive ? 'bg-teal-600 text-white' : 'hover:bg-teal-200'
                  }`}
                  onClick={() => handleNavigation(item)}
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
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-sm text-gray-600">
                  {description}, {userProfile?.full_name || currentUser?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {userProfile?.location?.district && userProfile?.location?.state 
                  ? `${userProfile.location.district}, ${userProfile.location.state}`
                  : userProfile?.location?.state 
                    ? userProfile.location.state
                    : detectedLocation || 'Location not set'
                }
              </Badge>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    if (navigator.geolocation && currentUser && userProfile) {
                      try {
                        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                          navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0 // Force fresh location
                          });
                        });

                        const { latitude, longitude } = position.coords;
                        
                        const response = await fetch(
                          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                        );
                        const data = await response.json();
                        
                        if (data.countryName === 'India') {
                          await updateUserProfile({
                            location: {
                              state: data.principalSubdivision || '',
                              district: data.locality || '',
                              coordinates: {
                                lat: latitude,
                                lng: longitude
                              }
                            }
                          });
                          setDetectedLocation('');
                        }
                      } catch (error) {
                        console.error('Error updating location:', error);
                      }
                    }
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Update Location
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;