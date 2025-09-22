import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  TrendingUp,
  AlertTriangle,
  Users,
  Camera,
  MapPin,
  Menu,
  X,
  Droplets,
  Shield,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Predictions", href: "/predictions", icon: TrendingUp },
    { name: "Alerts", href: "/alerts", icon: AlertTriangle },
    { name: "Reports", href: "/reports", icon: Users },
    { name: "Assessment", href: "/assessment", icon: Camera },
    { name: "Planning", href: "/planning", icon: MapPin },
  ];

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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-100 to-teal-200 text-gray-100 backdrop-blur-xl shadow-lg border-r border-blue-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-100 bg-gradient-to-r from-green-100 to-teal-200">
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="JalRakshak Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                JalRakshak
              </h1>
              <p className="text-xs text-slate-500">Flood Warning System</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-3 mb-2 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-400 to-teal-400 text-gray-800 shadow-md shadow-blue-400/30"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-teal-100 hover:text-gray-800"
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">
                System Status
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 hover:bg-green-100"
            >
              All Systems Operational
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-xl border-b border-blue-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Droplets className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-blue-600">JalRakshak</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
