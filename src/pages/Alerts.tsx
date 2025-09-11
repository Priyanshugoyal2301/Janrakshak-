import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import GradientCard from "@/components/GradientCard";
import {
  Bell,
  Phone,
  MapPin,
  Users,
  Volume2,
  MessageSquare,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Megaphone,
  Shield,
} from "lucide-react";

const Alerts = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("en");
  const [autoTranslate, setAutoTranslate] = useState(true);

  const alerts = [
    {
      id: 1,
      type: "critical",
      title: "Flash Flood Warning",
      message:
        "Immediate evacuation required for Riverside District. Water levels rising rapidly.",
      location: "Riverside District",
      time: "2 minutes ago",
      status: "active",
      recipients: 1250,
    },
    {
      id: 2,
      type: "warning",
      title: "Water Level Alert",
      message: "Water levels approaching warning threshold in Industrial Zone.",
      location: "Industrial Zone",
      time: "15 minutes ago",
      status: "active",
      recipients: 890,
    },
    {
      id: 3,
      type: "info",
      title: "Weather Update",
      message: "Heavy rainfall expected in the next 6 hours. Stay alert.",
      location: "City Wide",
      time: "1 hour ago",
      status: "sent",
      recipients: 3200,
    },
    {
      id: 4,
      type: "success",
      title: "All Clear",
      message:
        "Water levels have receded in Downtown Area. Normal activities can resume.",
      location: "Downtown Area",
      time: "3 hours ago",
      status: "resolved",
      recipients: 1800,
    },
  ];

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "emergency" },
    { name: "Flood Control Center", number: "+1-555-FLOOD", type: "flood" },
    { name: "Red Cross Shelter", number: "+1-555-SHELTER", type: "shelter" },
    { name: "Municipal Office", number: "+1-555-CITY", type: "municipal" },
  ];

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "danger";
      case "warning":
        return "warning";
      case "success":
        return "success";
      default:
        return "default";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return Bell;
      case "success":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-blue-800 bg-clip-text text-transparent">
          Early Warning & Communications
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real-time alert system with multi-channel communication and emergency
          response coordination
        </p>
      </div>

      {/* Alert Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GradientCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Alert Settings
            </h3>
            <Volume2 className="w-5 h-5 text-slate-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Sound Alerts</span>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Auto-Translate</span>
              <Switch
                checked={autoTranslate}
                onCheckedChange={setAutoTranslate}
              />
            </div>
          </div>
        </GradientCard>

        <GradientCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Broadcast Alert
            </h3>
            <Megaphone className="w-5 h-5 text-slate-600" />
          </div>
          <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Send Emergency Alert
          </Button>
        </GradientCard>

        <GradientCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              System Status
            </h3>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">SMS Gateway</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Push Notifications</span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                Active
              </Badge>
            </div>
          </div>
        </GradientCard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alert Feed */}
        <div className="lg:col-span-2">
          <GradientCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Active Alerts
              </h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Bell className="w-3 h-3 mr-1" />
                {alerts.filter((a) => a.status === "active").length} Active
              </Badge>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => {
                const AlertIcon = getAlertIcon(alert.type);
                return (
                  <GradientCard
                    key={alert.id}
                    variant={getAlertVariant(alert.type)}
                    className="p-4"
                    hover={false}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          alert.type === "critical"
                            ? "bg-red-100"
                            : alert.type === "warning"
                            ? "bg-yellow-100"
                            : alert.type === "success"
                            ? "bg-green-100"
                            : "bg-blue-100"
                        }`}
                      >
                        <AlertIcon
                          className={`w-5 h-5 ${
                            alert.type === "critical"
                              ? "text-red-600"
                              : alert.type === "warning"
                              ? "text-yellow-600"
                              : alert.type === "success"
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {alert.title}
                          </h3>
                          <Badge
                            variant={
                              alert.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              alert.status === "active"
                                ? "bg-red-100 text-red-700"
                                : ""
                            }
                          >
                            {alert.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-700 mb-3">
                          {alert.message}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {alert.location}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {alert.recipients} recipients
                            </span>
                          </div>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {alert.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GradientCard>
                );
              })}
            </div>
          </GradientCard>
        </div>

        {/* Emergency Actions & Contacts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <MapPin className="w-4 h-4 mr-2" />
                View Evacuation Routes
              </Button>
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Users className="w-4 h-4 mr-2" />
                Find Nearest Shelter
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <MessageSquare className="w-4 h-4 mr-2" />
                Community Chat
              </Button>
            </div>
          </GradientCard>

          {/* Emergency Contacts */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {contact.name}
                    </p>
                    <p className="text-xs text-slate-600">{contact.number}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-green-50 hover:border-green-200"
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </GradientCard>

          {/* Language Settings */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Language & Translation
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-700">
                  Multi-language Support
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant={language === "en" ? "default" : "outline"}
                  className={
                    language === "en"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                      : ""
                  }
                  onClick={() => setLanguage("en")}
                >
                  English
                </Button>
                <Button
                  size="sm"
                  variant={language === "es" ? "default" : "outline"}
                  className={
                    language === "es"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                      : ""
                  }
                  onClick={() => setLanguage("es")}
                >
                  Español
                </Button>
                <Button
                  size="sm"
                  variant={language === "hi" ? "default" : "outline"}
                  className={
                    language === "hi"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                      : ""
                  }
                  onClick={() => setLanguage("hi")}
                >
                  हिंदी
                </Button>
                <Button
                  size="sm"
                  variant={language === "bn" ? "default" : "outline"}
                  className={
                    language === "bn"
                      ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                      : ""
                  }
                  onClick={() => setLanguage("bn")}
                >
                  বাংলা
                </Button>
              </div>
            </div>
          </GradientCard>
        </div>
      </div>

      {/* Alert Preview */}
      <GradientCard className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Alert Preview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SMS Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">
              SMS Alert Preview
            </h3>
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-4 border-2 border-dashed border-slate-300">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-600">
                    FLOOD ALERT
                  </span>
                </div>
                <p className="text-sm text-slate-900 mb-2">
                  🚨 URGENT: Flash flood warning for Riverside District.
                  Evacuate immediately to higher ground.
                </p>
                <p className="text-xs text-slate-600">
                  Shelter: Community Center, 123 Main St. Info: jalrakshak.gov
                </p>
              </div>
            </div>
          </div>

          {/* App Notification Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">
              App Notification Preview
            </h3>
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-4 border-2 border-dashed border-slate-300">
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      JalRakshak Alert
                    </p>
                    <p className="text-xs text-slate-600">
                      Critical Flood Warning
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-700">
                  Immediate evacuation required for your area. Tap for
                  evacuation routes and shelter information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default Alerts;
