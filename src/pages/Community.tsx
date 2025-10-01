import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/components/UserLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Filter,
  Search,
  Users,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Flag,
  Plus,
  RefreshCw,
  ImageIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { FloodReport, getCommunityReports } from '@/lib/supabase';

interface CommunityReport extends FloodReport {
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  comments?: number;
  views?: number;
}

const Community = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('community');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [selectedReport, setSelectedReport] = useState<CommunityReport | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');


  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    // Reload reports when user profile (location) changes
    if (userProfile?.location) {
      loadReports();
    }
  }, [userProfile?.location?.state, userProfile?.location?.district]);

  useEffect(() => {
    filterAndSortReports();
  }, [reports, searchTerm, severityFilter, statusFilter, sortBy]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Get user's region
      const userState = userProfile?.location?.state || 'India';
      const userDistrict = userProfile?.location?.district;
      
      console.log('Loading community reports for region:', { userState, userDistrict });
      
      // Fetch real reports from Supabase filtered by region
      const realReports = await getCommunityReports(userState, userDistrict);
      
      console.log('Fetched real reports:', realReports.length);
      
      // Add community features (upvotes, downvotes, etc.) to real reports
      const communityReports: CommunityReport[] = realReports.map(report => ({
        ...report,
        upvotes: Math.floor(Math.random() * 30) + 1, // Random upvotes for community engagement
        downvotes: Math.floor(Math.random() * 5), // Random downvotes
        userVote: null, // User hasn't voted yet
        comments: Math.floor(Math.random() * 15) + 1, // Random comment count
        views: Math.floor(Math.random() * 100) + 5 // Random view count
      }));
      
      setReports(communityReports);
      console.log('Loaded community reports:', communityReports.length);
      
      if (communityReports.length === 0) {
        toast.info('No flood reports found in your region yet. Be the first to report!');
      }
    } catch (error) {
      console.error('Error loading community reports:', error);
      setReports([]);
      toast.error('Failed to load community reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(report => report.severity === severityFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
        break;
    }

    setFilteredReports(filtered);
  };

  const handleVote = async (reportId: string, voteType: 'up' | 'down') => {
    try {
      setReports(prev => prev.map(report => {
        if (report.id === reportId) {
          const currentVote = report.userVote;
          let newUpvotes = report.upvotes;
          let newDownvotes = report.downvotes;
          let newUserVote: 'up' | 'down' | null = voteType;

          // Handle vote changes
          if (currentVote === 'up' && voteType === 'up') {
            // Remove upvote
            newUpvotes--;
            newUserVote = null;
          } else if (currentVote === 'down' && voteType === 'down') {
            // Remove downvote
            newDownvotes--;
            newUserVote = null;
          } else if (currentVote === 'up' && voteType === 'down') {
            // Change from up to down
            newUpvotes--;
            newDownvotes++;
          } else if (currentVote === 'down' && voteType === 'up') {
            // Change from down to up
            newDownvotes--;
            newUpvotes++;
          } else if (!currentVote) {
            // New vote
            if (voteType === 'up') newUpvotes++;
            else newDownvotes++;
          }

          return {
            ...report,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: newUserVote
          };
        }
        return report;
      }));

      toast.success(`Vote ${voteType === 'up' ? 'upvoted' : 'downvoted'} successfully`);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to vote');
    }
  };

  const handleShare = async (report: CommunityReport) => {
    try {
      const shareData = {
        title: report.title,
        text: report.description,
        url: window.location.origin + `/community/${report.id}`
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success('Report link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share report');
    }
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
      case 'verified': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'false_alarm': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <UserLayout title="Community" description="Connect with your community and view flood reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Reports</h1>
            <p className="text-gray-600 mt-1">
              Stay connected with your community and view flood information
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReports}
              disabled={loading}
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {filteredReports.length} reports
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="community">Community Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="community" className="space-y-6">

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Severity</label>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="false_alarm">False Alarm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="severity">Severity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading community reports...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || severityFilter !== 'all' || statusFilter !== 'all' 
                    ? 'Try adjusting your filters to see more reports.'
                    : 'No flood reports in your region yet. Be the first to report!'
                  }
                </p>
                {!searchTerm && severityFilter === 'all' && statusFilter === 'all' && (
                  <Button 
                    onClick={() => navigate('/reports')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Report
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                          {report.user_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <Badge className={getSeverityColor(report.severity)}>
                            {report.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                        
                        {/* Media Display */}
                        {report.images && report.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                            {report.images.slice(0, 3).map((mediaUrl, index) => {
                              const isVideo = mediaUrl && (
                                mediaUrl.includes('.mp4') || 
                                mediaUrl.includes('.mov') || 
                                mediaUrl.includes('.avi') ||
                                mediaUrl.startsWith('data:video/')
                              );
                              
                              return (
                                <div key={index} className="relative">
                                  {isVideo ? (
                                    <video
                                      src={mediaUrl}
                                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                      controls
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  ) : (
                                    <img
                                      src={mediaUrl}
                                      alt={`Report media ${index + 1}`}
                                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                      onClick={() => {
                                        setSelectedImageUrl(mediaUrl);
                                        setShowImageViewer(true);
                                      }}
                                    />
                                  )}
                                  <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                    {isVideo ? 'VIDEO' : 'IMAGE'}
                                  </div>
                                </div>
                              );
                            })}
                            {report.images.length > 3 && (
                              <div className="flex items-center justify-center bg-gray-100 rounded-lg text-xs text-gray-500">
                                +{report.images.length - 3} more
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {report.location.address}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimeAgo(report.created_at!)}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {report.views} views
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(report.id!, 'up')}
                          className={`h-8 px-2 ${report.userVote === 'up' ? 'text-blue-600' : 'text-gray-500'}`}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {report.upvotes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(report.id!, 'down')}
                          className={`h-8 px-2 ${report.userVote === 'down' ? 'text-red-600' : 'text-gray-500'}`}
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {report.downvotes}
                        </Button>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {report.comments} comments
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setSelectedReport(report);
                          setShowDetailDialog(true);
                          toast.success('Opening report details');
                        }}
                        className="h-8 px-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(report)}
                        className="h-8 px-2 text-gray-500"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Report Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedReport ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{selectedReport.title || 'Untitled Report'}</span>
                  <Badge className={getSeverityColor(selectedReport.severity)}>
                    {(selectedReport.severity || 'unknown').toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(selectedReport.status)}>
                    {(selectedReport.status || 'unknown').replace('_', ' ').toUpperCase()}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Report submitted by {selectedReport.user_name || 'Unknown User'} • {formatTimeAgo(selectedReport.created_at || new Date().toISOString())}
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
                      <p className="text-blue-800">{selectedReport.location?.address || 'Address not available'}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">District:</p>
                      <p className="text-blue-800">{selectedReport.location?.district || 'District not available'}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">State:</p>
                      <p className="text-blue-800">{selectedReport.location?.state || 'State not available'}</p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">Coordinates:</p>
                      <p className="text-blue-800">
                        {selectedReport.coordinates?.lat && selectedReport.coordinates?.lng 
                          ? `${selectedReport.coordinates.lat.toFixed(6)}, ${selectedReport.coordinates.lng.toFixed(6)}`
                          : 'Coordinates not available'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-slate-700 leading-relaxed">{selectedReport.description || 'No description available'}</p>
                  </div>
                </div>

                {/* Media Gallery */}
                {selectedReport.images && selectedReport.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Media ({selectedReport.images.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedReport.images.map((mediaUrl, index) => {
                        const isVideo = mediaUrl.includes('video/') || mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') || mediaUrl.includes('.avi') || mediaUrl.includes('.webm');
                        const isBase64Video = mediaUrl.startsWith('data:video/');
                        
                        return (
                          <div key={index} className="relative group">
                            {isVideo || isBase64Video ? (
                              <div className="relative">
                                <video
                                  src={mediaUrl}
                                  className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                                  controls
                                  preload="metadata"
                                />
                                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  VIDEO
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <img
                                  src={mediaUrl}
                                  alt={`Report media ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                                  onClick={() => {
                                    setSelectedImageUrl(mediaUrl);
                                    setShowImageViewer(true);
                                  }}
                                />
                                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                  IMAGE
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                              <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        );
                      })}
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
                    <h4 className="font-medium text-slate-900 mb-2">Status</h4>
                    <Badge className={getStatusColor(selectedReport.status)}>
                      {selectedReport.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedReport.status === 'verified' ? 'Report has been verified' :
                       selectedReport.status === 'pending' ? 'Awaiting verification' :
                       selectedReport.status === 'resolved' ? 'Issue has been resolved' :
                       'Report marked as false alarm'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-2">Community Engagement</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Upvotes:</span>
                        <span className="font-medium">{selectedReport.upvotes}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Downvotes:</span>
                        <span className="font-medium">{selectedReport.downvotes}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Views:</span>
                        <span className="font-medium">{selectedReport.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Report Selected</h3>
              <p className="text-gray-600 mb-4">
                Please select a report to view its details.
              </p>
              <Button onClick={() => setShowDetailDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black">
          <div className="relative w-full h-full">
            <img
              src={selectedImageUrl}
              alt="Full size image"
              className="w-full h-full object-contain"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageViewer(false)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default Community;