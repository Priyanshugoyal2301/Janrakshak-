import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import UserLayout from '@/components/UserLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  MapPin,
  Phone,
  Users,
  Shield,
  Navigation,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  Home,
  Heart,
  Star,
  ArrowLeft,
  RefreshCw,
  Wifi,
  Car,
  Droplets,
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getLocationWithDetails, type LocationInfo } from '@/lib/locationService';

interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  capacity: number;
  current_occupancy: number;
  status: 'available' | 'busy' | 'full';
  facilities: string[];
  contact_number: string;
  coordinates: [number, number];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const ShelterFinder = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [filteredShelters, setFilteredShelters] = useState<Shelter[]>([]);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load shelters data
  useEffect(() => {
    loadShelters();
    loadUserLocation();
  }, []);

  // Filter shelters when search or filters change
  useEffect(() => {
    filterShelters();
  }, [shelters, searchTerm, statusFilter, capacityFilter]);

  const loadShelters = async () => {
    setLoading(true);
    try {
      console.log('Loading shelters from Supabase...');
      
      const { data, error } = await supabase
        .from('admin_shelters')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error loading shelters:', error);
        toast.error('Failed to load shelters');
        return;
      }

      console.log('Shelters loaded:', data);
      setShelters(data || []);
    } catch (error) {
      console.error('Error loading shelters:', error);
      toast.error('Failed to load shelters');
    } finally {
      setLoading(false);
    }
  };

  const loadUserLocation = async () => {
    try {
      const location = await getLocationWithDetails();
      setUserLocation(location);
    } catch (error) {
      console.error('Error loading user location:', error);
    }
  };

  const filterShelters = () => {
    let filtered = shelters;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(shelter =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(shelter => shelter.status === statusFilter);
    }

    // Capacity filter
    if (capacityFilter !== 'all') {
      const availableCapacity = filtered.map(s => s.capacity - s.current_occupancy);
      const maxAvailable = Math.max(...availableCapacity);
      
      if (capacityFilter === 'high') {
        filtered = filtered.filter(s => (s.capacity - s.current_occupancy) > maxAvailable * 0.7);
      } else if (capacityFilter === 'medium') {
        filtered = filtered.filter(s => {
          const available = s.capacity - s.current_occupancy;
          return available > maxAvailable * 0.3 && available <= maxAvailable * 0.7;
        });
      } else if (capacityFilter === 'low') {
        filtered = filtered.filter(s => (s.capacity - s.current_occupancy) <= maxAvailable * 0.3);
      }
    }

    setFilteredShelters(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'full': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'busy': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'full': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getDistanceFromUser = (shelter: Shelter) => {
    if (!userLocation?.coords) return null;
    return calculateDistance(
      userLocation.coords.lat,
      userLocation.coords.lng,
      shelter.coordinates[0],
      shelter.coordinates[1]
    );
  };

  const sortSheltersByDistance = () => {
    const sorted = [...filteredShelters].sort((a, b) => {
      const distanceA = getDistanceFromUser(a);
      const distanceB = getDistanceFromUser(b);
      
      if (distanceA === null && distanceB === null) return 0;
      if (distanceA === null) return 1;
      if (distanceB === null) return -1;
      
      return distanceA - distanceB;
    });
    
    setFilteredShelters(sorted);
  };

  const handleCallShelter = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleGetDirections = (shelter: Shelter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates[0]},${shelter.coordinates[1]}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading shelters...</p>
        </div>
      </div>
    );
  }

  return (
    <UserLayout title="Shelter Finder" description="Find nearby flood shelters">
      <div className="space-y-6">
        {/* Search and Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Search & Filter Shelters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, location, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
              <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Capacity</SelectItem>
                  <SelectItem value="high">High Availability</SelectItem>
                  <SelectItem value="medium">Medium Availability</SelectItem>
                  <SelectItem value="low">Low Availability</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={sortSheltersByDistance}
                disabled={!userLocation?.coords}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Sort by Distance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredShelters.length} of {shelters.length} shelters
          </p>
          {userLocation && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {userLocation.district || userLocation.state}
            </Badge>
          )}
        </div>

        {/* Shelters List */}
        <div className="space-y-4">
          {filteredShelters.length > 0 ? (
            filteredShelters.map((shelter) => {
              const distance = getDistanceFromUser(shelter);
              const availableCapacity = shelter.capacity - shelter.current_occupancy;
              const occupancyPercentage = (shelter.current_occupancy / shelter.capacity) * 100;

              return (
                <Card key={shelter.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{shelter.name}</h3>
                          <Badge className={getStatusColor(shelter.status)}>
                            {getStatusIcon(shelter.status)}
                            <span className="ml-1 capitalize">{shelter.status}</span>
                          </Badge>
                          {distance && (
                            <Badge variant="outline" className="text-xs">
                              <Navigation className="w-3 h-3 mr-1" />
                              {distance.toFixed(1)} km
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {shelter.location}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Home className="w-4 h-4 mr-2" />
                            {shelter.address}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2" />
                            {shelter.contact_number}
                          </div>
                        </div>

                        {/* Capacity Info */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">Capacity</span>
                            <span>{shelter.current_occupancy} / {shelter.capacity} people</span>
                          </div>
                          <Progress 
                            value={occupancyPercentage} 
                            className="h-2"
                            style={{
                              backgroundColor: occupancyPercentage > 80 ? '#ef4444' : 
                                             occupancyPercentage > 60 ? '#f59e0b' : '#10b981'
                            }}
                          />
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                            <span>{availableCapacity} spots available</span>
                            <span>{occupancyPercentage.toFixed(0)}% occupied</span>
                          </div>
                        </div>

                        {/* Facilities */}
                        {shelter.facilities && shelter.facilities.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Facilities:</p>
                            <div className="flex flex-wrap gap-2">
                              {shelter.facilities.map((facility, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleCallShelter(shelter.contact_number)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGetDirections(shelter)}
                        >
                          <Navigation className="w-4 h-4 mr-1" />
                          Directions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShelter(shelter);
                            setShowDetails(true);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No shelters found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || capacityFilter !== 'all'
                    ? 'Try adjusting your search criteria'
                    : 'No active shelters available in the system'
                  }
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCapacityFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Shelter Details Modal */}
      {showDetails && selectedShelter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  {selectedShelter.name}
                </CardTitle>
                <CardDescription>{selectedShelter.location}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Alert */}
              <Alert className={selectedShelter.status === 'available' ? 'border-green-200 bg-green-50' : 
                               selectedShelter.status === 'busy' ? 'border-yellow-200 bg-yellow-50' : 
                               'border-red-200 bg-red-50'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Status:</strong> {selectedShelter.status.charAt(0).toUpperCase() + selectedShelter.status.slice(1)}
                  {selectedShelter.status === 'available' && ' - Ready to accept evacuees'}
                  {selectedShelter.status === 'busy' && ' - Limited capacity remaining'}
                  {selectedShelter.status === 'full' && ' - At maximum capacity'}
                </AlertDescription>
              </Alert>

              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{selectedShelter.contact_number}</span>
                    <Button
                      size="sm"
                      className="ml-2 bg-green-600 hover:bg-green-700"
                      onClick={() => handleCallShelter(selectedShelter.contact_number)}
                    >
                      Call Now
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">{selectedShelter.address}</span>
                  </div>
                </div>
              </div>

              {/* Capacity Details */}
              <div>
                <h4 className="font-medium mb-3">Capacity Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Capacity:</span>
                    <span className="font-medium">{selectedShelter.capacity} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Current Occupancy:</span>
                    <span className="font-medium">{selectedShelter.current_occupancy} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Available Spots:</span>
                    <span className="font-medium text-green-600">
                      {selectedShelter.capacity - selectedShelter.current_occupancy} people
                    </span>
                  </div>
                  <Progress 
                    value={(selectedShelter.current_occupancy / selectedShelter.capacity) * 100} 
                    className="h-2 mt-2"
                  />
                </div>
              </div>

              {/* Facilities */}
              {selectedShelter.facilities && selectedShelter.facilities.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Available Facilities</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedShelter.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleCallShelter(selectedShelter.contact_number)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Shelter
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleGetDirections(selectedShelter)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </UserLayout>
  );
};

export default ShelterFinder;