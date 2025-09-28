import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Home,
  MapPin,
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
  Phone,
  Mail,
  Clock,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Download,
  Settings,
  Shield,
  Heart,
  Utensils,
  Wifi,
  Car,
  Bed,
  Droplets,
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
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock data for development
const mockData = {
  shelters: [
    {
      id: 1,
      name: "Sector 17 Community Center",
      location: "Chandigarh, Sector 17",
      address: "123 Community Center Road, Sector 17, Chandigarh",
      capacity: 100,
      currentOccupancy: 75,
      status: "near_full",
      contactPerson: "Rajesh Kumar",
      contactPhone: "+91 98765 43210",
      contactEmail: "rajesh@communitycenter.com",
      facilities: ["Food", "Water", "Medical", "WiFi", "Parking"],
      coordinates: { lat: 30.7333, lng: 76.7794 },
      isActive: true,
      lastUpdated: "2024-01-15T10:30:00Z",
      notes: "Well-equipped facility with medical staff on standby"
    },
    {
      id: 2,
      name: "Government School Sector 22",
      location: "Chandigarh, Sector 22",
      address: "456 School Street, Sector 22, Chandigarh",
      capacity: 150,
      currentOccupancy: 45,
      status: "available",
      contactPerson: "Priya Sharma",
      contactPhone: "+91 98765 43211",
      contactEmail: "priya@school.edu",
      facilities: ["Food", "Water", "Medical", "WiFi", "Parking", "Beds"],
      coordinates: { lat: 30.7400, lng: 76.7850 },
      isActive: true,
      lastUpdated: "2024-01-15T09:15:00Z",
      notes: "Large capacity with separate areas for families"
    },
    {
      id: 3,
      name: "Sports Complex Sector 35",
      location: "Chandigarh, Sector 35",
      address: "789 Sports Avenue, Sector 35, Chandigarh",
      capacity: 200,
      currentOccupancy: 200,
      status: "full",
      contactPerson: "Amit Singh",
      contactPhone: "+91 98765 43212",
      contactEmail: "amit@sportscomplex.com",
      facilities: ["Food", "Water", "Medical", "WiFi", "Parking", "Beds", "Shower"],
      coordinates: { lat: 30.7500, lng: 76.7900 },
      isActive: true,
      lastUpdated: "2024-01-15T08:45:00Z",
      notes: "At full capacity, no more admissions"
    },
    {
      id: 4,
      name: "Temple Hall Sector 8",
      location: "Chandigarh, Sector 8",
      address: "321 Temple Road, Sector 8, Chandigarh",
      capacity: 80,
      currentOccupancy: 30,
      status: "available",
      contactPerson: "Suresh Patel",
      contactPhone: "+91 98765 43213",
      contactEmail: "suresh@temple.org",
      facilities: ["Food", "Water", "Medical"],
      coordinates: { lat: 30.7333, lng: 76.7794 },
      isActive: true,
      lastUpdated: "2024-01-15T07:20:00Z",
      notes: "Basic facilities, suitable for short-term stay"
    },
    {
      id: 5,
      name: "Community Hall Sector 11",
      location: "Chandigarh, Sector 11",
      address: "654 Community Street, Sector 11, Chandigarh",
      capacity: 120,
      currentOccupancy: 0,
      status: "available",
      contactPerson: "Meera Devi",
      contactPhone: "+91 98765 43214",
      contactEmail: "meera@communityhall.com",
      facilities: ["Food", "Water", "Medical", "WiFi"],
      coordinates: { lat: 30.7333, lng: 76.7794 },
      isActive: false,
      lastUpdated: "2024-01-15T06:30:00Z",
      notes: "Currently closed for maintenance"
    }
  ],
  facilities: [
    "Food",
    "Water", 
    "Medical",
    "WiFi",
    "Parking",
    "Beds",
    "Shower",
    "Toilet",
    "Electricity",
    "Security"
  ]
};

const AdminShelters = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCapacity, setFilterCapacity] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Add/Edit form state
  const [shelterForm, setShelterForm] = useState({
    name: '',
    location: '',
    address: '',
    capacity: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    facilities: [],
    notes: '',
    isActive: true
  });

  // Mock data state
  const [data, setData] = useState(mockData);

  // Real-time shelter occupancy updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.map(shelter => ({
          ...shelter,
          currentOccupancy: Math.max(0, Math.min(
            shelter.capacity,
            shelter.currentOccupancy + Math.floor((Math.random() - 0.5) * 5)
          )),
          lastUpdated: new Date().toISOString(),
          status: shelter.currentOccupancy >= shelter.capacity * 0.9 ? 'full' : 
                 shelter.currentOccupancy >= shelter.capacity * 0.7 ? 'busy' : 'available'
        }))
      }));
      setLastUpdate(new Date());
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Shelter data refreshed successfully');
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'near_full': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'near_full': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'full': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getFacilityIcon = (facility: string) => {
    switch (facility) {
      case 'Food': return <Utensils className="h-4 w-4" />;
      case 'Water': return <Droplets className="h-4 w-4" />;
      case 'Medical': return <Heart className="h-4 w-4" />;
      case 'WiFi': return <Wifi className="h-4 w-4" />;
      case 'Parking': return <Car className="h-4 w-4" />;
      case 'Beds': return <Bed className="h-4 w-4" />;
      case 'Shower': return <Droplets className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
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

  const handleAddShelter = async () => {
    if (!shelterForm.name.trim() || !shelterForm.location.trim() || !shelterForm.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newShelter = {
        id: Date.now(),
        ...shelterForm,
        capacity: parseInt(shelterForm.capacity),
        currentOccupancy: 0,
        status: 'available',
        coordinates: { lat: 30.7333, lng: 76.7794 },
        lastUpdated: new Date().toISOString()
      };
      
      setData(prev => ({
        ...prev,
        shelters: [...prev.shelters, newShelter]
      }));
      
      setShelterForm({
        name: '',
        location: '',
        address: '',
        capacity: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        facilities: [],
        notes: '',
        isActive: true
      });
      
      setShowAddDialog(false);
      setLoading(false);
      toast.success('Shelter added successfully');
    }, 1000);
  };

  const handleEditShelter = async () => {
    if (!shelterForm.name.trim() || !shelterForm.location.trim() || !shelterForm.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // Simulate API call with real data updates
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.map(shelter => 
          shelter.id === selectedShelter.id 
            ? { 
                ...shelter, 
                ...shelterForm, 
                capacity: parseInt(shelterForm.capacity),
                lastUpdated: new Date().toISOString()
              }
            : shelter
        )
      }));
      
      setShowEditDialog(false);
      setSelectedShelter(null);
      setLoading(false);
      toast.success('Shelter updated successfully');
    }, 1000);
  };

  const handleDeleteShelter = async (shelterId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.filter(shelter => shelter.id !== shelterId)
      }));
      setLoading(false);
      toast.success('Shelter deleted successfully');
    }, 1000);
  };

  const handleActivateShelter = async (shelterId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.map(shelter => 
          shelter.id === shelterId 
            ? { ...shelter, isActive: true, lastUpdated: new Date().toISOString() }
            : shelter
        )
      }));
      setLoading(false);
      toast.success('Shelter activated successfully');
    }, 1000);
  };

  const handleDeactivateShelter = async (shelterId: string) => {
    setLoading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.map(shelter => 
          shelter.id === shelterId 
            ? { ...shelter, isActive: false, lastUpdated: new Date().toISOString() }
            : shelter
        )
      }));
      setLoading(false);
      toast.success('Shelter deactivated successfully');
    }, 1000);
  };


  const handleToggleShelter = async (shelterId: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        shelters: prev.shelters.map(shelter => 
          shelter.id === shelterId 
            ? { ...shelter, isActive: !shelter.isActive, lastUpdated: new Date().toISOString() }
            : shelter
        )
      }));
      setLoading(false);
      toast.success('Shelter status updated');
    }, 1000);
  };

  const handleFacilityToggle = (facility: string) => {
    setShelterForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const openEditDialog = (shelter: any) => {
    setSelectedShelter(shelter);
    setShelterForm({
      name: shelter.name,
      location: shelter.location,
      address: shelter.address,
      capacity: shelter.capacity.toString(),
      contactPerson: shelter.contactPerson,
      contactPhone: shelter.contactPhone,
      contactEmail: shelter.contactEmail,
      facilities: shelter.facilities,
      notes: shelter.notes,
      isActive: shelter.isActive
    });
    setShowEditDialog(true);
  };

  const filteredShelters = data.shelters.filter(shelter => {
    const matchesSearch = searchTerm === '' || 
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || shelter.status === filterStatus;
    const matchesCapacity = filterCapacity === 'all' || 
      (filterCapacity === 'low' && shelter.capacity < 100) ||
      (filterCapacity === 'medium' && shelter.capacity >= 100 && shelter.capacity < 200) ||
      (filterCapacity === 'high' && shelter.capacity >= 200);
    
    return matchesSearch && matchesStatus && matchesCapacity;
  });

  const totalCapacity = data.shelters.reduce((sum, shelter) => sum + shelter.capacity, 0);
  const totalOccupancy = data.shelters.reduce((sum, shelter) => sum + shelter.currentOccupancy, 0);
  const activeShelters = data.shelters.filter(shelter => shelter.isActive).length;
  const fullShelters = data.shelters.filter(shelter => shelter.status === 'full').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Real-time Status Bar */}
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm border border-teal-200 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLive ? 'Live Occupancy Updates' : 'Paused'}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <div className="text-xs text-orange-600">
            Full: {data.shelters.filter(s => s.status === 'full').length}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={isLive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}
          >
            <Activity className="h-4 w-4 mr-2" />
            {isLive ? 'Live' : 'Paused'}
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shelter Management</h1>
          <p className="text-gray-600">Manage flood shelters and their capacity</p>
        </div>
        <div className="flex items-center space-x-3">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Shelter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Shelter</DialogTitle>
                <DialogDescription>
                  Register a new flood shelter with its details and facilities
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Shelter Name *</Label>
                    <Input
                      id="name"
                      value={shelterForm.name}
                      onChange={(e) => setShelterForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter shelter name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={shelterForm.capacity}
                      onChange={(e) => setShelterForm(prev => ({ ...prev, capacity: e.target.value }))}
                      placeholder="Enter capacity"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={shelterForm.location}
                    onChange={(e) => setShelterForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={shelterForm.address}
                    onChange={(e) => setShelterForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={shelterForm.contactPerson}
                      onChange={(e) => setShelterForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input
                      id="contactPhone"
                      value={shelterForm.contactPhone}
                      onChange={(e) => setShelterForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={shelterForm.contactEmail}
                      onChange={(e) => setShelterForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Email address"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Facilities</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {data.facilities.map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility}
                          checked={shelterForm.facilities.includes(facility)}
                          onCheckedChange={() => handleFacilityToggle(facility)}
                        />
                        <Label htmlFor={facility} className="text-sm">{facility}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={shelterForm.notes}
                    onChange={(e) => setShelterForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes about the shelter"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddShelter} disabled={loading}>
                  {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Add Shelter
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Shelters</CardTitle>
            <Home className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.shelters.length}</div>
            <p className="text-xs text-muted-foreground">Registered shelters</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Shelters</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShelters}</div>
            <p className="text-xs text-muted-foreground">Currently operational</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity}</div>
            <p className="text-xs text-muted-foreground">People can be accommodated</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Occupancy</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOccupancy}</div>
            <p className="text-xs text-muted-foreground">{Math.round((totalOccupancy / totalCapacity) * 100)}% utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Home className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="list" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <Users className="h-4 w-4 mr-2" />
            Shelter List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Map Widget */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-teal-600" />
                  Shelter Locations
                </CardTitle>
                <CardDescription>Geographic distribution of shelters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[30.9010, 75.8573]}
                    zoom={8}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Shelters */}
                    {data.shelters.map((shelter) => {
                      const getShelterIcon = (status: string) => {
                        switch (status) {
                          case 'available': return '🟢';
                          case 'near_full': return '🟡';
                          case 'full': return '🔴';
                          default: return '🏠';
                        }
                      };
                      
                      const customIcon = L.divIcon({
                        className: 'custom-marker',
                        html: `<div style="background-color: white; border: 2px solid #0ea5e9; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${getShelterIcon(shelter.status)}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                      });
                      
                      const openGoogleMaps = () => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates.lat},${shelter.coordinates.lng}`;
                        window.open(url, '_blank');
                      };
                      
                      return (
                        <Marker
                          key={shelter.id}
                          position={[shelter.coordinates.lat, shelter.coordinates.lng]}
                          icon={customIcon}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-sm">{shelter.name}</h3>
                              <p className="text-xs text-gray-600">{shelter.location}</p>
                              <p className="text-xs">Capacity: {shelter.capacity}</p>
                              <p className="text-xs">Occupancy: {shelter.currentOccupancy}</p>
                              <p className="text-xs">Status: <span className={`font-medium ${shelter.status === 'available' ? 'text-green-600' : shelter.status === 'near_full' ? 'text-yellow-600' : 'text-red-600'}`}>{shelter.status.replace('_', ' ')}</span></p>
                              <p className="text-xs">Contact: {shelter.contactPhone}</p>
                              <p className="text-xs">Facilities: {shelter.facilities.join(', ')}</p>
                              <div className="mt-2 space-y-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    toast.success(`Opening shelter management for ${shelter.name}`);
                                  }}
                                  className="w-full text-xs"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Manage
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={openGoogleMaps}
                                  className="w-full text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                >
                                  <MapPin className="h-3 w-3 mr-1" />
                                  Get Directions
                                </Button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Available ({data.shelters.filter(s => s.status === 'available').length})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Near Full ({data.shelters.filter(s => s.status === 'near_full').length})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Full ({data.shelters.filter(s => s.status === 'full').length})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Occupancy Graph */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Occupancy Overview
                </CardTitle>
                <CardDescription>Current shelter capacity utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.shelters.slice(0, 5).map((shelter) => (
                    <div key={shelter.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{shelter.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {shelter.currentOccupancy}/{shelter.capacity}
                        </span>
                      </div>
                      <Progress 
                        value={(shelter.currentOccupancy / shelter.capacity) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{shelter.location}</span>
                        <Badge className={getStatusColor(shelter.status)}>
                          {shelter.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Shelter List Tab */}
        <TabsContent value="list" className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2 text-teal-600" />
                    Shelter List
                  </CardTitle>
                  <CardDescription>Manage all registered shelters</CardDescription>
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
                      toast.success('Exporting shelters data...');
                      setTimeout(() => {
                        toast.success('Shelters exported successfully');
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
                    placeholder="Search shelters..."
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
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="near_full">Near Full</SelectItem>
                    <SelectItem value="full">Full</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCapacity} onValueChange={setFilterCapacity}>
                  <SelectTrigger className="w-32 bg-white/50 border-gray-200">
                    <SelectValue placeholder="Capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Capacity</SelectItem>
                    <SelectItem value="low">Low (&lt;100)</SelectItem>
                    <SelectItem value="medium">Medium (100-200)</SelectItem>
                    <SelectItem value="high">High (&gt;200)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead>Shelter</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupancy</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShelters.map((shelter) => (
                      <TableRow key={shelter.id} className="hover:bg-gray-50/50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{shelter.name}</div>
                            <div className="text-sm text-muted-foreground">{shelter.contactPerson}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{shelter.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{shelter.capacity}</span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{shelter.currentOccupancy}</div>
                            <Progress 
                              value={(shelter.currentOccupancy / shelter.capacity) * 100} 
                              className="h-1 w-16"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(shelter.status)}
                            <Badge className={getStatusColor(shelter.status)}>
                              {shelter.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{shelter.contactPhone}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{shelter.contactEmail}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(shelter.lastUpdated)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(shelter)}
                              className="hover:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleShelter(shelter.id)}
                              className={`hover:bg-gray-100 ${shelter.isActive ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {shelter.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
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
                                  toast.info(`Viewing details for shelter: ${shelter.name}`);
                                }}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEditDialog(shelter)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Shelter
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  toast.info('Occupancy management coming soon');
                                }}>
                                  <Users className="h-4 w-4 mr-2" />
                                  Manage Occupancy
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteShelter(shelter.id)}
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Shelter Status Distribution
                </CardTitle>
                <CardDescription>Current status of all shelters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{data.shelters.filter(s => s.status === 'available').length}</div>
                        <div className="text-sm text-gray-600">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{data.shelters.filter(s => s.status === 'busy').length}</div>
                        <div className="text-sm text-gray-600">Busy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{data.shelters.filter(s => s.status === 'full').length}</div>
                        <div className="text-sm text-gray-600">Full</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      Total Capacity: {data.shelters.reduce((sum, s) => sum + s.capacity, 0)} people
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Available Shelters</span>
                        <span className="font-medium">{Math.round((data.shelters.filter(s => s.status === 'available').length / data.shelters.length) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(data.shelters.filter(s => s.status === 'available').length / data.shelters.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-green-600" />
                  Occupancy Trends
                </CardTitle>
                <CardDescription>Historical occupancy patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {Math.round(data.shelters.reduce((sum, s) => sum + s.currentOccupancy, 0) / data.shelters.reduce((sum, s) => sum + s.capacity, 0) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Overall Occupancy Rate</div>
                    <div className="space-y-3">
                      {data.shelters.slice(0, 3).map((shelter) => (
                        <div key={shelter.id} className="text-left">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{shelter.name}</span>
                            <span>{Math.round((shelter.currentOccupancy / shelter.capacity) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (shelter.currentOccupancy / shelter.capacity) > 0.8 ? 'bg-red-500' : 
                                (shelter.currentOccupancy / shelter.capacity) > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${(shelter.currentOccupancy / shelter.capacity) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Shelter Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Shelter</DialogTitle>
            <DialogDescription>
              Update shelter information and facilities
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Shelter Name *</Label>
                <Input
                  id="edit-name"
                  value={shelterForm.name}
                  onChange={(e) => setShelterForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter shelter name"
                />
              </div>
              <div>
                <Label htmlFor="edit-capacity">Capacity *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={shelterForm.capacity}
                  onChange={(e) => setShelterForm(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Enter capacity"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={shelterForm.location}
                onChange={(e) => setShelterForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address">Full Address</Label>
              <Textarea
                id="edit-address"
                value={shelterForm.address}
                onChange={(e) => setShelterForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Enter full address"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-contactPerson">Contact Person</Label>
                <Input
                  id="edit-contactPerson"
                  value={shelterForm.contactPerson}
                  onChange={(e) => setShelterForm(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Contact person name"
                />
              </div>
              <div>
                <Label htmlFor="edit-contactPhone">Phone</Label>
                <Input
                  id="edit-contactPhone"
                  value={shelterForm.contactPhone}
                  onChange={(e) => setShelterForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label htmlFor="edit-contactEmail">Email</Label>
                <Input
                  id="edit-contactEmail"
                  type="email"
                  value={shelterForm.contactEmail}
                  onChange={(e) => setShelterForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
            </div>
            
            <div>
              <Label>Facilities</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {data.facilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${facility}`}
                      checked={shelterForm.facilities.includes(facility)}
                      onCheckedChange={() => handleFacilityToggle(facility)}
                    />
                    <Label htmlFor={`edit-${facility}`} className="text-sm">{facility}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={shelterForm.notes}
                onChange={(e) => setShelterForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the shelter"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditShelter} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Edit className="h-4 w-4 mr-2" />}
              Update Shelter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminShelters;
