import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Route,
  MapPin,
  Navigation,
  Clock,
  Users,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Target,
  BarChart3,
  Car,
  Ship,
  Plane,
  Phone,
  Mail,
  Calendar,
  Download,
  Settings,
  Map,
  Globe,
  Zap,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Mock data for development
const mockData = {
  missions: [
    {
      id: 1,
      missionId: "RESCUE-001",
      title: "Emergency Evacuation - Sector 17",
      origin: "Rescue Base Alpha",
      destination: "Sector 17 Community Center",
      mode: "Boat",
      assignedTeam: "Team Alpha",
      teamLeader: "Captain Rajesh",
      teamContact: "+91 98765 43210",
      status: "active",
      priority: "critical",
      estimatedTime: "45 minutes",
      distance: "12.5 km",
      startTime: "2024-01-15T10:30:00Z",
      expectedCompletion: "2024-01-15T11:15:00Z",
      actualCompletion: null,
      description: "Evacuate 25 families from flooded residential area",
      coordinates: {
        origin: { lat: 30.7333, lng: 76.7794 },
        destination: { lat: 30.7400, lng: 76.7850 }
      },
      route: [
        { lat: 30.7333, lng: 76.7794 },
        { lat: 30.7350, lng: 76.7800 },
        { lat: 30.7375, lng: 76.7825 },
        { lat: 30.7400, lng: 76.7850 }
      ],
      alternateRoutes: [
        {
          id: 1,
          distance: "15.2 km",
          estimatedTime: "55 minutes",
          reason: "Avoid flooded main road"
        },
        {
          id: 2,
          distance: "18.7 km",
          estimatedTime: "65 minutes",
          reason: "Use highway bypass"
        }
      ]
    },
    {
      id: 2,
      missionId: "RESCUE-002",
      title: "Medical Supply Delivery",
      origin: "Medical Center",
      destination: "Sector 22 School",
      mode: "Road",
      assignedTeam: "Team Beta",
      teamLeader: "Dr. Priya",
      teamContact: "+91 98765 43211",
      status: "planned",
      priority: "high",
      estimatedTime: "30 minutes",
      distance: "8.3 km",
      startTime: "2024-01-15T12:00:00Z",
      expectedCompletion: "2024-01-15T12:30:00Z",
      actualCompletion: null,
      description: "Deliver emergency medical supplies to shelter",
      coordinates: {
        origin: { lat: 30.7200, lng: 76.7700 },
        destination: { lat: 30.7300, lng: 76.7800 }
      },
      route: [
        { lat: 30.7200, lng: 76.7700 },
        { lat: 30.7250, lng: 76.7750 },
        { lat: 30.7300, lng: 76.7800 }
      ],
      alternateRoutes: [
        {
          id: 1,
          distance: "9.1 km",
          estimatedTime: "35 minutes",
          reason: "Avoid traffic congestion"
        }
      ]
    },
    {
      id: 3,
      missionId: "RESCUE-003",
      title: "Food Distribution - Sector 35",
      origin: "Food Distribution Center",
      destination: "Sports Complex Sector 35",
      mode: "Road",
      assignedTeam: "Team Gamma",
      teamLeader: "Amit Singh",
      teamContact: "+91 98765 43212",
      status: "completed",
      priority: "medium",
      estimatedTime: "25 minutes",
      distance: "6.7 km",
      startTime: "2024-01-15T08:00:00Z",
      expectedCompletion: "2024-01-15T08:25:00Z",
      actualCompletion: "2024-01-15T08:22:00Z",
      description: "Distribute food packets to 200 people at shelter",
      coordinates: {
        origin: { lat: 30.7100, lng: 76.7600 },
        destination: { lat: 30.7500, lng: 76.7900 }
      },
      route: [
        { lat: 30.7100, lng: 76.7600 },
        { lat: 30.7300, lng: 76.7750 },
        { lat: 30.7500, lng: 76.7900 }
      ],
      alternateRoutes: []
    }
  ],
  rescueTeams: [
    { id: 1, name: "Team Alpha", leader: "Captain Rajesh", contact: "+91 98765 43210", status: "active", specialization: "Water Rescue" },
    { id: 2, name: "Team Beta", leader: "Dr. Priya", contact: "+91 98765 43211", status: "active", specialization: "Medical" },
    { id: 3, name: "Team Gamma", leader: "Amit Singh", contact: "+91 98765 43212", status: "active", specialization: "Logistics" },
    { id: 4, name: "Team Delta", leader: "Sarah Wilson", contact: "+91 98765 43213", status: "standby", specialization: "Search & Rescue" }
  ],
  locations: [
    "Rescue Base Alpha",
    "Medical Center",
    "Food Distribution Center",
    "Sector 17 Community Center",
    "Sector 22 School",
    "Sports Complex Sector 35",
    "Sector 8 Temple Hall",
    "Sector 11 Community Hall"
  ]
};

const AdminRoutes = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('planning');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  
  // Map layer toggles
  const [showReports, setShowReports] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  
  // Create mission form state
  const [missionForm, setMissionForm] = useState({
    title: '',
    origin: '',
    destination: '',
    mode: 'Road',
    assignedTeam: '',
    priority: 'medium',
    description: '',
    startTime: ''
  });

  // Mock data state
  const [data, setData] = useState(mockData);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        missions: prev.missions.map(mission => ({
          ...mission,
          lastUpdated: new Date().toISOString()
        }))
      }));
      setLoading(false);
      toast.success('Route data refreshed successfully');
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Boat': return <Ship className="h-4 w-4" />;
      case 'Road': return <Car className="h-4 w-4" />;
      case 'Air': return <Plane className="h-4 w-4" />;
      default: return <Navigation className="h-4 w-4" />;
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

  const handleCreateMission = async () => {
    if (!missionForm.title.trim() || !missionForm.origin.trim() || !missionForm.destination.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newMission = {
        id: Date.now(),
        ...missionForm,
        status: 'planned',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        estimatedDuration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        distance: Math.floor(Math.random() * 50) + 5 // 5-55 km
      };

      setData(prev => ({
        ...prev,
        missions: [newMission, ...prev.missions]
      }));

      setMissionForm({
        title: '',
        origin: '',
        destination: '',
        mode: 'Road',
        assignedTeam: '',
        priority: 'medium',
        description: '',
        startTime: ''
      });
      setLoading(false);
      toast.success('Mission created successfully');
    }, 1000);
  };

  const handleUpdateMissionStatus = async (missionId: string, status: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        missions: prev.missions.map(mission => 
          mission.id === missionId 
            ? { ...mission, status, lastUpdated: new Date().toISOString() }
            : mission
        )
      }));
      setLoading(false);
      toast.success(`Mission ${status} successfully`);
    }, 1000);
  };

  const handleDeleteMission = async (missionId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        missions: prev.missions.filter(mission => mission.id !== missionId)
      }));
      setLoading(false);
      toast.success('Mission deleted successfully');
    }, 1000);
  };

  const handlePlanRoute = async () => {
    if (!routeForm.origin.trim() || !routeForm.destination.trim()) {
      toast.error('Please enter origin and destination');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Simulate route planning
      const newRoute = {
        id: Date.now(),
        origin: routeForm.origin,
        destination: routeForm.destination,
        mode: routeForm.mode,
        distance: Math.floor(Math.random() * 50) + 5,
        duration: Math.floor(Math.random() * 120) + 30,
        status: 'planned',
        createdAt: new Date().toISOString()
      };

      setData(prev => ({
        ...prev,
        routes: [newRoute, ...prev.routes]
      }));

      setRouteForm({
        origin: '',
        destination: '',
        mode: 'Road'
      });
      setLoading(false);
      toast.success('Route planned successfully');
    }, 1000);
  };




  const filteredMissions = data.missions.filter(mission => {
    const matchesSearch = searchTerm === '' || 
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.missionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.assignedTeam.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || mission.status === filterStatus;
    const matchesMode = filterMode === 'all' || mission.mode === filterMode;
    const matchesPriority = filterPriority === 'all' || mission.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesMode && matchesPriority;
  });

  const activeMissions = filteredMissions.filter(m => m.status === 'active');
  const plannedMissions = filteredMissions.filter(m => m.status === 'planned');
  const completedMissions = filteredMissions.filter(m => m.status === 'completed');

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route & Rescue Planning</h1>
          <p className="text-gray-600">Plan and manage rescue missions with optimal routing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Rescue Mission</DialogTitle>
                <DialogDescription>
                  Plan a new rescue mission with route optimization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Mission Title *</Label>
                  <Input
                    id="title"
                    value={missionForm.title}
                    onChange={(e) => setMissionForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter mission title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="origin">Origin *</Label>
                    <Select value={missionForm.origin} onValueChange={(value) => setMissionForm(prev => ({ ...prev, origin: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Select value={missionForm.destination} onValueChange={(value) => setMissionForm(prev => ({ ...prev, destination: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.locations.map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mode">Transport Mode</Label>
                    <Select value={missionForm.mode} onValueChange={(value) => setMissionForm(prev => ({ ...prev, mode: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Road">Road</SelectItem>
                        <SelectItem value="Boat">Boat</SelectItem>
                        <SelectItem value="Air">Air</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignedTeam">Assigned Team *</Label>
                    <Select value={missionForm.assignedTeam} onValueChange={(value) => setMissionForm(prev => ({ ...prev, assignedTeam: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.rescueTeams.map((team) => (
                          <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={missionForm.priority} onValueChange={(value) => setMissionForm(prev => ({ ...prev, priority: value }))}>
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
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={missionForm.startTime}
                      onChange={(e) => setMissionForm(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={missionForm.description}
                    onChange={(e) => setMissionForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter mission description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMission} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create Mission
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Missions</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMissions.length}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Planned Missions</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plannedMissions.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled for execution</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedMissions.length}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Teams</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.rescueTeams.filter(t => t.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Ready for deployment</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Widget */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                    Mission Map
                  </CardTitle>
                  <CardDescription>Interactive map with routes and mission locations</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showReports}
                      onCheckedChange={setShowReports}
                      id="reports"
                    />
                    <Label htmlFor="reports" className="text-sm">Reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showShelters}
                      onCheckedChange={setShowShelters}
                      id="shelters"
                    />
                    <Label htmlFor="shelters" className="text-sm">Shelters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showFloodZones}
                      onCheckedChange={setShowFloodZones}
                      id="flood-zones"
                    />
                    <Label htmlFor="flood-zones" className="text-sm">Flood Zones</Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[30.7333, 76.7794] as [number, number]}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Origin Marker */}
                  <Marker position={[30.7333, 76.7794] as [number, number]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-sm">Origin Point</h3>
                        <p className="text-xs">Rescue Base Station</p>
                        <p className="text-xs">Lat: 30.7333, Lng: 76.7794</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Destination Markers */}
                  <Marker position={[30.7400, 76.7850] as [number, number]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-sm">Destination 1</h3>
                        <p className="text-xs">Flood Zone Alpha</p>
                        <p className="text-xs">Distance: 2.3 km</p>
                        <p className="text-xs">ETA: 8 minutes</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  <Marker position={[30.7500, 76.7900] as [number, number]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-sm">Destination 2</h3>
                        <p className="text-xs">Emergency Shelter</p>
                        <p className="text-xs">Distance: 4.1 km</p>
                        <p className="text-xs">ETA: 12 minutes</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Route Line */}
                  <Polyline
                    positions={[
                      [30.7333, 76.7794],
                      [30.7400, 76.7850],
                      [30.7500, 76.7900]
                    ]}
                    color="#0ea5e9"
                    weight={4}
                    opacity={0.8}
                  />
                </MapContainer>
              </div>
              <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Origin</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Destinations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-4 bg-blue-500"></div>
                  <span>Route</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Route Suggestions */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="h-5 w-5 mr-2 text-blue-600" />
                Route Suggestions
              </CardTitle>
              <CardDescription>Optimal routes for selected mission</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {selectedMission ? (
                    <>
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">Primary Route</h4>
                          <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Distance: {selectedMission.distance}</div>
                          <div>Time: {selectedMission.estimatedTime}</div>
                          <div>Mode: {selectedMission.mode}</div>
                        </div>
                      </div>
                      {selectedMission.alternateRoutes.map((route) => (
                        <div key={route.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">Alternate Route {route.id}</h4>
                            <Badge className="bg-yellow-100 text-yellow-800">Alternative</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Distance: {route.distance}</div>
                            <div>Time: {route.estimatedTime}</div>
                            <div>Reason: {route.reason}</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Route className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Select a mission to view routes</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Missions Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-teal-600" />
                Rescue Missions
              </CardTitle>
              <CardDescription>Manage all rescue missions and their status</CardDescription>
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
                  toast.success('Exporting missions data...');
                  setTimeout(() => {
                    toast.success('Missions exported successfully');
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
                placeholder="Search missions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 border-gray-200"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Road">Road</SelectItem>
                <SelectItem value="Boat">Boat</SelectItem>
                <SelectItem value="Air">Air</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>Mission</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMissions.map((mission) => (
                  <TableRow key={mission.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{mission.title}</div>
                        <div className="text-sm text-muted-foreground">{mission.missionId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{mission.origin}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>{mission.destination}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getModeIcon(mission.mode)}
                        <span className="text-sm">{mission.mode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{mission.assignedTeam}</div>
                        <div className="text-muted-foreground">{mission.teamLeader}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(mission.priority)}>
                        {mission.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(mission.status)}>
                        {mission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{mission.estimatedTime}</div>
                        <div className="text-muted-foreground">{mission.distance}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMission(mission)}
                          className="hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {mission.status === 'planned' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateMissionStatus(mission.id, 'active')}
                            className="hover:bg-green-100 text-green-600"
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}
                        {mission.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateMissionStatus(mission.id, 'completed')}
                            className="hover:bg-blue-100 text-blue-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedMission(mission)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedMission(mission);
                              setMissionForm({
                                title: mission.title,
                                origin: mission.origin,
                                destination: mission.destination,
                                mode: mission.mode,
                                assignedTeam: mission.assignedTeam,
                                priority: mission.priority,
                                description: mission.description,
                                startTime: mission.startTime
                              });
                              toast.info('Mission details loaded for editing');
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Mission
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              toast.success(`Contacting team: ${mission.assignedTeam}`);
                            }}>
                              <Phone className="h-4 w-4 mr-2" />
                              Contact Team
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteMission(mission.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRoutes;
