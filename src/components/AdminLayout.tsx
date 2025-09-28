import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSupabaseAuthMinimal } from '@/contexts/SupabaseAuthContextMinimal';
import {
  Menu,
  X,
  Shield,
  LogOut,
  Settings,
  User,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  AlertTriangle,
  FileText,
  Users,
  MapPin,
  Route,
  BarChart3,
  Activity,
  Search,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useSupabaseAuthMinimal();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home, badge: null },
    { name: "Alerts", href: "/admin/alerts", icon: AlertTriangle, badge: "3" },
    { name: "Reports", href: "/admin/reports", icon: FileText, badge: "12" },
    { name: "Users", href: "/admin/users", icon: Users, badge: null },
    { name: "Shelters", href: "/admin/shelters", icon: MapPin, badge: "5" },
    { name: "Route Planning", href: "/admin/routes", icon: Route, badge: null },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, badge: null },
    { name: "System Health", href: "/admin/system", icon: Activity, badge: null },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-teal-100 to-blue-200 text-gray-100 backdrop-blur-xl shadow-lg border-r border-teal-200 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${sidebarCollapsed ? "w-16" : "w-64"}`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-teal-200 bg-gradient-to-r from-teal-100 to-blue-200">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-teal-600">JalRakshak</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex p-1"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-3 mb-2 rounded-xl transition-all duration-200 group relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-teal-400 to-blue-400 text-white shadow-md shadow-teal-400/30"
                      : "text-teal-700 hover:bg-gradient-to-r hover:from-teal-100 hover:to-blue-100 hover:text-teal-800"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <item.icon className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                {!sidebarCollapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-red-500 text-white text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {sidebarCollapsed && item.badge && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>


      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        {/* Top bar */}
        <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-teal-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Welcome back, Admin</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center p-0">
                3
              </Badge>
            </Button>
            
            {/* Refresh */}
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            {/* Admin Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 bg-teal-50 border-2 border-teal-200 rounded-full p-1 cursor-pointer hover:bg-teal-100 transition-colors">
                  <Avatar className="w-8 h-8 ring-2 ring-teal-300">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-blue-500 text-white text-sm font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3 text-teal-600 mr-1" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-teal-900 font-semibold">
                  <div className="flex items-center space-x-2">
                    <span>Admin Panel</span>
                  </div>
                  <div className="text-xs text-teal-600 font-normal truncate">
                    {user?.user_metadata?.full_name || 'Admin User'}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-teal-50">
                  <User className="w-4 h-4 mr-2 text-teal-600" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-teal-50">
                  <Bell className="w-4 h-4 mr-2 text-teal-600" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-teal-50">
                  <Settings className="w-4 h-4 mr-2 text-teal-600" />
                  System Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
