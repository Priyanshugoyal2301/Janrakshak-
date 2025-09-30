import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  MapPin, 
  Droplets, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Eye, 
  Sun, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  TrendingUp,
  Activity,
  Calendar,
  BarChart3,
  Download,
  Upload,
  Settings,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  floodPredictionService, 
  PredictionResponse, 
  ForecastDetail,
  LOCATION_COORDS 
} from '@/lib/floodPredictionService';

const AdminFloodPrediction: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<{ healthy: boolean; url: string; lastChecked: string } | null>(null);
  const [allPredictions, setAllPredictions] = useState<Array<{location: string, data: PredictionResponse, timestamp: string}>>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const states = floodPredictionService.getStates();
  const locations = selectedState ? floodPredictionService.getLocationsByState(selectedState) : [];

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const status = await floodPredictionService.getApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Error checking API status:', error);
    }
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedLocation('');
    setPredictionData(null);
    setError('');
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setPredictionData(null);
    setError('');
  };

  const handleGeneratePrediction = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log(`🌤️ Generating prediction for ${selectedLocation}`);
      const result = await floodPredictionService.predictRegionalRisk(selectedLocation);
      setPredictionData(result);
      toast.success(`Flood prediction generated for ${selectedLocation}`);
    } catch (err) {
      console.error('❌ Error generating prediction:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate flood prediction';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error('Please enter a location to search');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const coords = floodPredictionService.getLocationCoords(searchQuery);
      if (coords) {
        setSelectedState(coords.state);
        setSelectedLocation(searchQuery);
        const result = await floodPredictionService.predictRegionalRisk(searchQuery);
        setPredictionData(result);
        toast.success(`Flood prediction generated for ${searchQuery}`);
      } else {
        toast.error(`Location "${searchQuery}" not found in our database`);
      }
    } catch (err) {
      console.error('❌ Error searching location:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to search location';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAllPredictions = async () => {
    setBulkLoading(true);
    const predictions: Array<{location: string, data: PredictionResponse, timestamp: string}> = [];
    
    try {
      const allLocations = floodPredictionService.getSupportedLocations();
      toast.info(`Generating predictions for ${allLocations.length} locations...`);
      
      for (let i = 0; i < allLocations.length; i++) {
        const location = allLocations[i];
        try {
          console.log(`Generating prediction ${i + 1}/${allLocations.length} for ${location}`);
          const result = await floodPredictionService.predictRegionalRisk(location);
          predictions.push({
            location,
            data: result,
            timestamp: new Date().toISOString()
          });
          
          // Update progress
          const progress = Math.round(((i + 1) / allLocations.length) * 100);
          toast.info(`Progress: ${progress}% - ${location} completed`);
          
          // Small delay to prevent overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error generating prediction for ${location}:`, error);
          toast.error(`Failed to generate prediction for ${location}`);
        }
      }
      
      setAllPredictions(predictions);
      toast.success(`Successfully generated ${predictions.length} predictions`);
    } catch (error) {
      console.error('Error generating bulk predictions:', error);
      toast.error('Failed to generate bulk predictions');
    } finally {
      setBulkLoading(false);
    }
  };

  const refreshData = async () => {
    floodPredictionService.clearCache();
    await checkApiStatus();
    toast.success('Cache cleared. Fresh data will be fetched on next request.');
  };

  const exportPredictions = () => {
    if (allPredictions.length === 0) {
      toast.error('No predictions to export');
      return;
    }

    const csvData = allPredictions.map(pred => ({
      Location: pred.location,
      RiskLevel: pred.data.main_prediction?.['Risk Level'] || 'N/A',
      Confidence: pred.data.main_prediction?.['Confidence'] || 'N/A',
      RiskDate: pred.data.main_prediction?.['Risk Date'] || 'N/A',
      WaterLevel: pred.data.main_prediction?.['Water Level'] || 'N/A',
      Timestamp: pred.timestamp
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood-predictions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Predictions exported successfully');
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'high risk':
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium risk':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'low risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'no significant risk':
      case 'safe':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskStats = () => {
    const stats = {
      total: allPredictions.length,
      high: 0,
      medium: 0,
      low: 0,
      safe: 0
    };

    allPredictions.forEach(pred => {
      const riskLevel = pred.data.main_prediction?.['Risk Level']?.toLowerCase() || '';
      if (riskLevel.includes('high') || riskLevel.includes('critical')) stats.high++;
      else if (riskLevel.includes('medium') || riskLevel.includes('warning')) stats.medium++;
      else if (riskLevel.includes('low')) stats.low++;
      else if (riskLevel.includes('safe') || riskLevel.includes('no significant')) stats.safe++;
    });

    return stats;
  };

  const riskStats = getRiskStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span>Admin Flood Prediction Dashboard</span>
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive flood risk assessment and management using JanRakshak Pre-Alert Model</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* API Status */}
      {apiStatus && (
        <Alert className={apiStatus.healthy ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            <strong>API Status:</strong> {apiStatus.healthy ? 'Healthy' : 'Unhealthy'} 
            <span className="text-gray-500 ml-2">({apiStatus.url})</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Admin Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Admin Controls</span>
          </CardTitle>
          <CardDescription>
            Generate predictions for individual locations or bulk operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Selection */}
          <form onSubmit={handleSearchSubmit} className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Search for a city (e.g., Chandigarh, Ludhiana, Amritsar)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Select State</Label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Select Location</Label>
              <Select 
                value={selectedLocation} 
                onValueChange={handleLocationChange}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleGeneratePrediction}
              disabled={!selectedLocation || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CloudRain className="w-4 h-4 mr-2" />
                  Generate Single Prediction
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleGenerateAllPredictions}
              disabled={bulkLoading}
              variant="outline"
              className="flex-1"
            >
              {bulkLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Bulk Generating...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate All Predictions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Predictions Results */}
      {allPredictions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Bulk Predictions Results</span>
                </CardTitle>
                <CardDescription>
                  {allPredictions.length} locations analyzed
                </CardDescription>
              </div>
              <Button onClick={exportPredictions} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Risk Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{riskStats.total}</div>
                <div className="text-sm text-gray-600">Total Locations</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{riskStats.high}</div>
                <div className="text-sm text-red-600">High Risk</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{riskStats.medium}</div>
                <div className="text-sm text-orange-600">Medium Risk</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{riskStats.low}</div>
                <div className="text-sm text-yellow-600">Low Risk</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{riskStats.safe}</div>
                <div className="text-sm text-green-600">Safe</div>
              </div>
            </div>

            {/* Predictions Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Risk Date</TableHead>
                    <TableHead>Water Level</TableHead>
                    <TableHead>Generated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allPredictions.slice(0, 20).map((pred, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{pred.location}</TableCell>
                      <TableCell>
                        <Badge 
                          style={{ 
                            backgroundColor: floodPredictionService.getRiskColor(pred.data.main_prediction?.['Risk Level'] || 'Unknown'),
                            color: floodPredictionService.getRiskTextColor(pred.data.main_prediction?.['Risk Level'] || 'Unknown')
                          }}
                        >
                          {pred.data.main_prediction?.['Risk Level'] || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>{pred.data.main_prediction?.['Confidence'] || 'N/A'}</TableCell>
                      <TableCell>{pred.data.main_prediction?.['Risk Date'] || 'N/A'}</TableCell>
                      <TableCell>{pred.data.main_prediction?.['Water Level'] || 'N/A'}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatTime(pred.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {allPredictions.length > 20 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Showing first 20 results. Export CSV to see all {allPredictions.length} predictions.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Single Prediction Results */}
      {predictionData && (
        <div className="space-y-6">
          {/* Main Prediction */}
          {predictionData.main_prediction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Main Prediction - {selectedLocation}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      {getRiskIcon(predictionData.main_prediction['Risk Level'])}
                    </div>
                    <h3 className="font-semibold text-sm text-gray-600">Risk Level</h3>
                    <Badge 
                      className="mt-2"
                      style={{ 
                        backgroundColor: floodPredictionService.getRiskColor(predictionData.main_prediction['Risk Level']),
                        color: floodPredictionService.getRiskTextColor(predictionData.main_prediction['Risk Level'])
                      }}
                    >
                      {predictionData.main_prediction['Risk Level']}
                    </Badge>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold text-sm text-gray-600">Confidence</h3>
                    <p className="text-lg font-bold text-blue-600">
                      {predictionData.main_prediction['Confidence'] || 'N/A'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold text-sm text-gray-600">Risk Date</h3>
                    <p className="text-sm font-medium text-purple-600">
                      {predictionData.main_prediction['Risk Date'] || 'N/A'}
                    </p>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Droplets className="w-5 h-5 mx-auto mb-2 text-cyan-500" />
                    <h3 className="font-semibold text-sm text-gray-600">Water Level</h3>
                    <p className="text-sm font-medium text-cyan-600">
                      {predictionData.main_prediction['Water Level'] || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Forecast */}
          {predictionData.detailed_forecast && predictionData.detailed_forecast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CloudRain className="w-5 h-5" />
                  <span>7-Day Detailed Forecast</span>
                </CardTitle>
                <CardDescription>
                  Hourly weather and flood risk predictions for the next 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="forecast" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="forecast">Forecast</TabsTrigger>
                    <TabsTrigger value="weather">Weather Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="forecast" className="space-y-4">
                    <div className="grid gap-4">
                      {predictionData.detailed_forecast.slice(0, 7).map((forecast, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{formatDate(forecast.date)}</span>
                              <span className="text-sm text-gray-500">{formatTime(forecast.date)}</span>
                            </div>
                            <Badge 
                              style={{ 
                                backgroundColor: floodPredictionService.getRiskColor(forecast.risk_level),
                                color: floodPredictionService.getRiskTextColor(forecast.risk_level)
                              }}
                            >
                              {forecast.risk_level}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <CloudRain className="w-4 h-4 text-blue-500" />
                              <span>{forecast.rainfall_mm}mm</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Thermometer className="w-4 h-4 text-red-500" />
                              <span>{forecast.temperature}°C</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Wind className="w-4 h-4 text-gray-500" />
                              <span>{forecast.wind_speed} km/h</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4 text-purple-500" />
                              <span>{forecast.visibility} km</span>
                            </div>
                          </div>
                          
                          {forecast.flood_probability && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Flood Probability</span>
                                <span>{forecast.flood_probability}%</span>
                              </div>
                              <Progress value={forecast.flood_probability} className="h-2" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="weather" className="space-y-4">
                    <div className="grid gap-4">
                      {predictionData.detailed_forecast.slice(0, 7).map((forecast, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <h4 className="font-medium mb-3">{formatDate(forecast.date)}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Thermometer className="w-4 h-4 text-red-500" />
                                <span>Temperature: {forecast.temperature}°C</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Droplets className="w-4 h-4 text-blue-500" />
                                <span>Humidity: {forecast.humidity}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Wind className="w-4 h-4 text-gray-500" />
                                <span>Wind: {forecast.wind_speed} km/h</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4 text-purple-500" />
                                <span>Pressure: {forecast.pressure} hPa</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Eye className="w-4 h-4 text-indigo-500" />
                                <span>Visibility: {forecast.visibility} km</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Sun className="w-4 h-4 text-yellow-500" />
                                <span>UV Index: {forecast.uv_index}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Model Information */}
          {predictionData.model_info && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Model Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Version:</span> {predictionData.model_info.version}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span> {formatDate(predictionData.model_info.last_updated)}
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span> {predictionData.model_info.accuracy}%
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminFloodPrediction;