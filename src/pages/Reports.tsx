import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GradientCard from "@/components/GradientCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, submitFloodReport, uploadImage, getNearbyReports, type FloodReport } from "@/lib/supabase";
import { getCurrentLocation, getLocationWithDetails, searchLocation, type LocationInfo } from "@/lib/locationService";
import {
  Camera,
  Upload,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Users,
  TrendingUp,
  Plus,
  Loader2,
  X,
  ImageIcon,
  Send,
  Navigation,
  MessageSquare,
  Heart,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

const Reports = () => {
  const { currentUser, userProfile } = useAuth();
  const [reports, setReports] = useState<FloodReport[]>([]);
  const [userLocation, setUserLocation] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FloodReport | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium" as "low" | "medium" | "high" | "critical",
    locationSearch: "",
    selectedLocation: null as LocationInfo | null,
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  // Load user location and nearby reports
  useEffect(() => {
    loadUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyReports();
    }
  }, [userLocation]);

  const loadUserLocation = async () => {
    try {
      const location = await getLocationWithDetails();
      setUserLocation(location);
      setFormData(prev => ({ ...prev, selectedLocation: location }));
      toast.success(`Location detected: ${location.district}, ${location.state}`);
    } catch (error) {
      console.error('Error getting location:', error);
      // Set default to Punjab if location fails
      const defaultLocation: LocationInfo = {
        coords: { lat: 30.9010, lng: 75.8573 }, // Punjab center
        address: "Punjab, India",
        state: "Punjab",
        district: "",
        country: "India"
      };
      setUserLocation(defaultLocation);
      setFormData(prev => ({ ...prev, selectedLocation: defaultLocation }));
    }
  };

  const loadNearbyReports = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    try {
      const nearbyReports = await getNearbyReports(
        userLocation.coords.lat,
        userLocation.coords.lng,
        100 // 100km radius
      );
      setReports(nearbyReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load nearby reports');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setImagePreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => {
      const url = prev[index];
      URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleLocationSearch = async (query: string) => {
    if (query.length < 3) return;
    
    try {
      const locations = await searchLocation(query);
      if (locations.length > 0) {
        setFormData(prev => ({ ...prev, selectedLocation: locations[0] }));
      }
    } catch (error) {
      console.error('Location search error:', error);
    }
  };

  const useCurrentLocation = async () => {
    try {
      const location = await getLocationWithDetails();
      setFormData(prev => ({ ...prev, selectedLocation: location, locationSearch: location.address }));
      toast.success('Current location selected');
    } catch (error) {
      toast.error('Failed to get current location');
    }
  };

  const handleSubmitReport = async () => {
    if (!currentUser || !userProfile) {
      toast.error('Please sign in to submit reports');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.selectedLocation) {
      toast.error('Please select a location');
      return;
    }

    setSubmitting(true);
    try {
      // Upload images
      const imageUrls: string[] = [];
      for (const image of selectedImages) {
        const url = await uploadImage(image, 'images');
        if (url) {
          imageUrls.push(url);
        }
      }

      // Submit report
      const report: Omit<FloodReport, 'id' | 'created_at' | 'updated_at'> = {
        user_id: currentUser.uid,
        user_name: userProfile.displayName,
        user_email: userProfile.email,
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        location: {
          lat: formData.selectedLocation.coords.lat,
          lng: formData.selectedLocation.coords.lng,
          address: formData.selectedLocation.address,
          state: formData.selectedLocation.state,
          district: formData.selectedLocation.district,
        },
        images: imageUrls,
        status: 'pending',
      };

      const submittedReport = await submitFloodReport(report);
      
      if (submittedReport) {
        toast.success('Report submitted successfully!');
        setReports(prev => [submittedReport, ...prev]);
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          severity: "medium",
          locationSearch: "",
          selectedLocation: userLocation,
        });
        setSelectedImages([]);
        setImagePreviewUrls([]);
        setShowSubmitDialog(false);
      } else {
        toast.error('Failed to submit report');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'resolved':
        return 'text-blue-600 bg-blue-100';
      case 'false_alarm':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const handleViewDetails = (report: FloodReport) => {
    setSelectedReport(report);
    setShowDetailDialog(true);
  };

  const openLocationInMaps = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-blue-800 bg-clip-text text-transparent">
          Community Flood Reports
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Real-time flood monitoring powered by community reports and location-based intelligence
        </p>
        
        {userLocation && (
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <MapPin className="w-4 h-4" />
            <span>Your location: {userLocation.district}, {userLocation.state}</span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GradientCard className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Total Reports</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            {reports.length}
          </p>
        </GradientCard>

        <GradientCard className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Critical</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            {reports.filter(r => r.severity === 'critical').length}
          </p>
        </GradientCard>

        <GradientCard className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Verified</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {reports.filter(r => r.status === 'verified').length}
          </p>
        </GradientCard>

        <GradientCard className="p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Contributors</h3>
          <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {new Set(reports.map(r => r.user_id)).size}
          </p>
        </GradientCard>
      </div>

      {/* Submit Report Button */}
      <div className="text-center">
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Flood Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Flood Report</DialogTitle>
              <DialogDescription>
                Help your community by reporting flood conditions in your area
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the situation"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the flood situation, water levels, affected areas, etc."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label>Severity Level</Label>
                <Select value={formData.severity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor water accumulation</SelectItem>
                    <SelectItem value="medium">Medium - Noticeable flooding</SelectItem>
                    <SelectItem value="high">High - Significant flooding</SelectItem>
                    <SelectItem value="critical">Critical - Dangerous conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search for location or use current location"
                    value={formData.locationSearch}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, locationSearch: e.target.value }));
                      handleLocationSearch(e.target.value);
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={useCurrentLocation}
                    className="flex items-center space-x-1"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Use Current</span>
                  </Button>
                </div>
                {formData.selectedLocation && (
                  <div className="text-sm text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{formData.selectedLocation.address}</span>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Images (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelection}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload images or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB each (max 5 images)</p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmitDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  disabled={submitting}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{selectedReport.title}</span>
                  <Badge className={getSeverityColor(selectedReport.severity)}>
                    {selectedReport.severity.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Report submitted by {selectedReport.user_name} • {formatTimeAgo(selectedReport.created_at || new Date().toISOString())}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Location Information */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 font-medium">Address:</p>
                      <p className="text-blue-800">{selectedReport.location.address}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">District, State:</p>
                      <p className="text-blue-800">{selectedReport.location.district}, {selectedReport.location.state}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">Coordinates:</p>
                      <p className="text-blue-800">{selectedReport.location.lat.toFixed(6)}, {selectedReport.location.lng.toFixed(6)}</p>
                    </div>
                    <div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openLocationInMaps(selectedReport.location.lat, selectedReport.location.lng)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                      >
                        <Navigation className="w-4 h-4 mr-1" />
                        Open in Maps
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Report Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-slate-700 leading-relaxed">{selectedReport.description}</p>
                  </div>
                </div>

                {/* Images Gallery */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Images ({selectedReport.images.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedReport.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Report image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Report Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Severity Level</h4>
                    <Badge className={getSeverityColor(selectedReport.severity)}>
                      {selectedReport.severity.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedReport.severity === 'critical' ? 'Immediate action required' :
                       selectedReport.severity === 'high' ? 'High priority response needed' :
                       selectedReport.severity === 'medium' ? 'Moderate attention required' :
                       'Low priority monitoring'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Report Status</h4>
                    <Badge className={getStatusColor(selectedReport.status)}>
                      {selectedReport.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedReport.status === 'verified' ? 'Verified by authorities' :
                       selectedReport.status === 'resolved' ? 'Situation resolved' :
                       selectedReport.status === 'false_alarm' ? 'Marked as false alarm' :
                       'Awaiting verification'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Reporter</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {selectedReport.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{selectedReport.user_name}</p>
                        <p className="text-xs text-slate-600">{selectedReport.user_email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigator.share && navigator.share({
                        title: selectedReport.title,
                        text: selectedReport.description,
                        url: window.location.href
                      }).catch(() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard');
                      })}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share Report
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => openLocationInMaps(selectedReport.location.lat, selectedReport.location.lng)}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View Location
                    </Button>
                  </div>
                  <Button 
                    onClick={() => setShowDetailDialog(false)}
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reports List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Recent Reports</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-slate-600 mt-2">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-slate-600">No reports in your area yet. Be the first to report!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-slate-900 mb-2">{report.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{report.user_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{report.location.district}, {report.location.state}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(report.created_at || new Date().toISOString())}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{report.description}</p>
                  
                  {/* Images */}
                  {report.images && report.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                      {report.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Report image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                        <Heart className="w-4 h-4 mr-1" />
                        Helpful
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(report)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;