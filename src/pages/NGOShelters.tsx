import React, { useState, useEffect } from "react";
import NGOLayout from "@/components/NGOLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Building, Users, MapPin, Heart, RefreshCw, Activity, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { 
  getAdminShelters, 
  subscribeToShelters,
  AdminShelter 
} from '@/lib/adminSupabase';

const NGOShelters = () => {
  const [shelters, setShelters] = useState<AdminShelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load initial data
  useEffect(() => {
    loadShelters();
  }, []);

  // Real-time shelter updates
  useEffect(() => {
    if (!isLive) return;

    const subscription = subscribeToShelters((payload) => {
      console.log('Shelter update received:', payload);
      
      if (payload.eventType === 'UPDATE' && payload.new) {
        setShelters(prevShelters => 
          prevShelters.map(shelter => 
            shelter.id === payload.new.id ? { ...shelter, ...payload.new } : shelter
          )
        );
      } else if (payload.eventType === 'INSERT' && payload.new) {
        setShelters(prevShelters => [payload.new, ...prevShelters]);
      } else if (payload.eventType === 'DELETE' && payload.old) {
        setShelters(prevShelters => prevShelters.filter(shelter => shelter.id !== payload.old.id));
      }
      
      setLastUpdate(new Date());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLive]);

  const loadShelters = async () => {
    setLoading(true);
    try {
      console.log('Loading shelters from Supabase...');
      const shelterData = await getAdminShelters();
      console.log('Loaded shelters:', shelterData);
      setShelters(shelterData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading shelters:", error);
      toast.error("Failed to load shelters");
    } finally {
      setLoading(false);
    }
  };

  const filteredShelters = shelters.filter(shelter => {
    const matchesSearch = shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shelter.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || shelter.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: shelters.length,
    active: shelters.filter(s => s.is_active).length,
    available: shelters.filter(s => s.status === "available").length,
    totalCapacity: shelters.reduce((sum, s) => sum + s.capacity, 0),
    totalOccupancy: shelters.reduce((sum, s) => sum + s.current_occupancy, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "near_full": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "full": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <NGOLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">NGO Shelter Coordination</h1>
            <p className="text-gray-600 mt-1">Coordinate shelter operations and relief distribution</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadShelters} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant={isLive ? "default" : "outline"} 
              onClick={() => setIsLive(!isLive)}
            >
              <Activity className="w-4 h-4 mr-2" />
              Live Updates {isLive ? 'ON' : 'OFF'}
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Building className="w-4 h-4 mr-2" />
              Add Shelter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Shelters</p>
                  <p className="text-3xl font-bold text-purple-800">{stats.total}</p>
                </div>
                <Building className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Shelters</p>
                  <p className="text-3xl font-bold text-green-800">{stats.active}</p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">People Sheltered</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.totalOccupancy}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-pink-600">Relief Points</p>
                  <p className="text-3xl font-bold text-pink-800">16</p>
                </div>
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search shelters by name, address, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="near_full">Near Full</option>
            <option value="full">Full</option>
          </select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shelter Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading shelters...</p>
              </div>
            ) : filteredShelters.length === 0 ? (
              <div className="text-center py-8">
                <Building className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No shelters found matching your filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShelters.map((shelter) => (
                    <TableRow key={shelter.id}>
                      <TableCell className="font-medium">{shelter.name}</TableCell>
                      <TableCell>{shelter.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(shelter.status)}>
                          {shelter.status.charAt(0).toUpperCase() + shelter.status.slice(1).replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{shelter.capacity}</TableCell>
                      <TableCell>
                        {shelter.current_occupancy} / {shelter.capacity}
                        <div className="text-xs text-gray-500">
                          {Math.round((shelter.current_occupancy / shelter.capacity) * 100)}% full
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{shelter.contact_person}</div>
                          <div className="text-gray-500">{shelter.contact_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </NGOLayout>
  );
};

export default NGOShelters;