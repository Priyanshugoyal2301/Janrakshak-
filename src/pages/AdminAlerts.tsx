import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  AlertTriangle,
  Bell,
  Send,
  Clock,
  MapPin,
  Users,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Download,
  Calendar,
  Globe,
  Target,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Mock data for development
const mockData = {
  activeAlerts: [
    {
      id: 1,
      type: "Flood Warning",
      severity: "critical",
      message: "Heavy rainfall expected in next 2 hours. River levels rising rapidly.",
      timestamp: "2024-01-15T11:00:00Z",
      status: "active",
      sentTo: "All Users",
      region: "Chandigarh",
      expiresAt: "2024-01-15T13:00:00Z",
      createdBy: "Admin User"
    },
    {
      id: 2,
      type: "River Level Alert",
      severity: "high",
      message: "Sukhna Lake water level rising above normal. Evacuation recommended for low-lying areas.",
      timestamp: "2024-01-15T10:30:00Z",
      status: "active",
      sentTo: "Sector 17, 22, 35",
      region: "Chandigarh",
      expiresAt: "2024-01-15T12:30:00Z",
      createdBy: "Weather System"
    },
    {
      id: 3,
      type: "Weather Update",
      severity: "medium",
      message: "Rainfall intensity decreasing. Conditions improving gradually.",
      timestamp: "2024-01-15T09:45:00Z",
      status: "active",
      sentTo: "All Users",
      region: "Chandigarh",
      expiresAt: "2024-01-15T11:45:00Z",
      createdBy: "Weather System"
    },
    {
      id: 4,
      type: "Shelter Availability",
      severity: "low",
      message: "New shelter opened at Sector 8 Community Center. Capacity: 100 people.",
      timestamp: "2024-01-15T08:20:00Z",
      status: "active",
      sentTo: "Emergency Responders",
      region: "Chandigarh",
      expiresAt: "2024-01-15T20:20:00Z",
      createdBy: "Admin User"
    }
  ],
  alertHistory: [
    {
      id: 5,
      type: "Flood Warning",
      severity: "critical",
      message: "Heavy rainfall expected in next 2 hours",
      timestamp: "2024-01-14T15:30:00Z",
      status: "delivered",
      sentTo: "All Users",
      region: "Chandigarh",
      expiresAt: "2024-01-14T17:30:00Z",
      createdBy: "Admin User",
      deliveryCount: 1247,
      readCount: 892
    },
    {
      id: 6,
      type: "Evacuation Notice",
      severity: "high",
      message: "Immediate evacuation required for Sector 17 residents",
      timestamp: "2024-01-14T12:15:00Z",
      status: "delivered",
      sentTo: "Sector 17 Residents",
      region: "Chandigarh",
      expiresAt: "2024-01-14T18:15:00Z",
      createdBy: "Emergency Coordinator",
      deliveryCount: 156,
      readCount: 134
    },
    {
      id: 7,
      type: "Weather Update",
      severity: "medium",
      message: "Rainfall expected to continue for next 4 hours",
      timestamp: "2024-01-14T10:00:00Z",
      status: "delivered",
      sentTo: "All Users",
      region: "Chandigarh",
      expiresAt: "2024-01-14T14:00:00Z",
      createdBy: "Weather System",
      deliveryCount: 1247,
      readCount: 567
    }
  ],
  regions: [
    "All Users",
    "Sector 17",
    "Sector 22", 
    "Sector 35",
    "Sector 8",
    "Sector 11",
    "Emergency Responders",
    "Volunteers",
    "Rescue Teams"
  ]
};

const AdminAlerts = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  
  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState({
    type: 'Flood Warning',
    severity: 'medium',
    message: '',
    sentTo: [],
    region: 'Chandigarh',
    expiresIn: '2'
  });

  // Mock data state
  const [data, setData] = useState(mockData);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Alerts refreshed successfully');
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBroadcastSubmit = async () => {
    if (!broadcastForm.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (broadcastForm.sentTo.length === 0) {
      toast.error('Please select at least one recipient group');
      return;
    }

    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      const newAlert = {
        id: Date.now(),
        type: broadcastForm.type,
        severity: broadcastForm.severity,
        message: broadcastForm.message,
        region: broadcastForm.region,
        timestamp: new Date().toISOString(),
        status: 'active',
        sentTo: broadcastForm.sentTo,
        expiresIn: broadcastForm.expiresIn
      };

      setData(prev => ({
        ...prev,
        activeAlerts: [newAlert, ...prev.activeAlerts],
        alertHistory: [newAlert, ...prev.alertHistory]
      }));

      setLoading(false);
      setShowBroadcastDialog(false);
      setBroadcastForm({
        type: 'Flood Warning',
        severity: 'medium',
        message: '',
        sentTo: [],
        region: 'Chandigarh',
        expiresIn: '2'
      });
      toast.success('Alert broadcasted successfully');
    }, 1000);
  };

  const handleRecipientToggle = (recipient: string) => {
    setBroadcastForm(prev => ({
      ...prev,
      sentTo: prev.sentTo.includes(recipient)
        ? prev.sentTo.filter(r => r !== recipient)
        : [...prev.sentTo, recipient]
    }));
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        activeAlerts: prev.activeAlerts.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'acknowledged' }
            : alert
        ),
        alertHistory: prev.alertHistory.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'acknowledged' }
            : alert
        )
      }));
      setLoading(false);
      toast.success('Alert acknowledged successfully');
    }, 1000);
  };

  const handleDismissAlert = async (alertId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        activeAlerts: prev.activeAlerts.filter(alert => alert.id !== alertId),
        alertHistory: prev.alertHistory.map(alert => 
          alert.id === alertId 
            ? { ...alert, status: 'dismissed' }
            : alert
        )
      }));
      setLoading(false);
      toast.success('Alert dismissed');
    }, 1000);
  };

  const handleDeleteAlert = async (alertId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        alertHistory: prev.alertHistory.filter(alert => alert.id !== alertId)
      }));
      setLoading(false);
      toast.success('Alert deleted');
    }, 1000);
  };

  const filteredAlerts = (activeTab === 'active' ? data.activeAlerts : data.alertHistory).filter(alert => {
    const matchesSearch = searchTerm === '' || 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesRegion = filterRegion === 'all' || alert.region === filterRegion;
    
    return matchesSearch && matchesSeverity && matchesRegion;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {data.activeAlerts.filter(alert => alert.severity === 'critical').length > 0 && (
        <div className="bg-red-500 text-white p-4 rounded-lg flex items-center space-x-3">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <p className="font-semibold">Critical Alerts Active</p>
            <p className="text-sm opacity-90">
              {data.activeAlerts.filter(alert => alert.severity === 'critical').length} critical alerts require immediate attention
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto bg-white/20 border-white/30 text-white hover:bg-white/30">
            View Details
          </Button>
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
          <p className="text-gray-600">Manage flood warnings and system alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Send className="h-4 w-4 mr-2" />
                Broadcast Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Broadcast New Alert</DialogTitle>
                <DialogDescription>
                  Send an alert to selected user groups or regions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Alert Type</Label>
                    <Select value={broadcastForm.type} onValueChange={(value) => setBroadcastForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flood Warning">Flood Warning</SelectItem>
                        <SelectItem value="Evacuation Notice">Evacuation Notice</SelectItem>
                        <SelectItem value="Weather Update">Weather Update</SelectItem>
                        <SelectItem value="Shelter Availability">Shelter Availability</SelectItem>
                        <SelectItem value="Road Closure">Road Closure</SelectItem>
                        <SelectItem value="Rescue Request">Rescue Request</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={broadcastForm.severity} onValueChange={(value) => setBroadcastForm(prev => ({ ...prev, severity: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter alert message..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm(prev => ({ ...prev, message: e.target.value }))}
                    className="min-h-24"
                  />
                </div>
                
                <div>
                  <Label>Send To</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {data.regions.map((region) => (
                      <div key={region} className="flex items-center space-x-2">
                        <Checkbox
                          id={region}
                          checked={broadcastForm.sentTo.includes(region)}
                          onCheckedChange={() => handleRecipientToggle(region)}
                        />
                        <Label htmlFor={region} className="text-sm">{region}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={broadcastForm.region} onValueChange={(value) => setBroadcastForm(prev => ({ ...prev, region: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                        <SelectItem value="All Regions">All Regions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="expires">Expires In (hours)</Label>
                    <Select value={broadcastForm.expiresIn} onValueChange={(value) => setBroadcastForm(prev => ({ ...prev, expiresIn: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBroadcastSubmit} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Broadcast Alert
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="active" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Bell className="h-4 w-4 mr-2" />
            Active Alerts ({data.activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Clock className="h-4 w-4 mr-2" />
            Alert History ({data.alertHistory.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="active" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                    Active Alerts
                  </CardTitle>
                  <CardDescription>Currently active flood warnings and system alerts</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast.success('Exporting alerts data...');
                      // Simulate export functionality
                      setTimeout(() => {
                        toast.success('Alerts exported successfully');
                      }, 2000);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{alert.type}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{alert.region}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{alert.sentTo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Expires: {formatDate(alert.expiresAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>By: {alert.createdBy}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Show alert details in a modal or navigate to details page
                          toast.info(`Viewing details for alert: ${alert.type}`);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => {
                            // Edit alert functionality
                            toast.info('Edit alert functionality coming soon');
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Alert
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            // Resend alert
                            toast.success('Alert resent successfully');
                          }}>
                            <Send className="h-4 w-4 mr-2" />
                            Resend
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDismissAlert(alert.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alert History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Alert History
                  </CardTitle>
                  <CardDescription>Historical record of all sent alerts</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast.success('Exporting alerts data...');
                      // Simulate export functionality
                      setTimeout(() => {
                        toast.success('Alerts exported successfully');
                      }, 2000);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search alert history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/50 border-gray-200"
                  />
                </div>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead>Alert</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Sent To</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.map((alert) => (
                      <TableRow key={alert.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{alert.type}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">{alert.message}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{alert.sentTo}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{alert.region}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Delivered: {alert.deliveryCount || 0}</div>
                            <div>Read: {alert.readCount || 0}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(alert.timestamp)}
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
                              <DropdownMenuItem onClick={() => {
                                toast.info(`Viewing details for alert: ${alert.type}`);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                toast.success('Alert resent successfully');
                              }}>
                                <Send className="h-4 w-4 mr-2" />
                                Resend
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAlerts;
