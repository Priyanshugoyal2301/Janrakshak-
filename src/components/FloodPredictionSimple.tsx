import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  CloudRain, 
  AlertTriangle,
  Search,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { floodPredictionService } from '@/lib/floodPredictionService';
import { testFloodAPI, testWindyAPI } from '@/lib/testFloodAPI';

const FloodPredictionSimple: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  const states = floodPredictionService.getStates();
  const locations = selectedState ? floodPredictionService.getLocationsByState(selectedState) : [];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedLocation('');
    setResult(null);
    setError('');
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setResult(null);
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
      const predictionResult = await floodPredictionService.predictRegionalRisk(selectedLocation);
      setResult(predictionResult);
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

  const handleTestAPI = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing APIs...');
      const floodTest = await testFloodAPI();
      const windyTest = await testWindyAPI();
      
      console.log('Flood API Test:', floodTest);
      console.log('Windy API Test:', windyTest);
      
      toast.success('API tests completed. Check console for details.');
    } catch (error) {
      console.error('API test error:', error);
      toast.error('API test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Flood Prediction</h1>
        <p className="text-gray-600 mt-2">AI-powered flood risk assessment using JanRakshak Pre-Alert Model</p>
      </div>

      {/* Location Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Location Selection</span>
          </CardTitle>
          <CardDescription>
            Select a location to get flood predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="space-y-2">
            <Button 
              onClick={handleGeneratePrediction}
              disabled={!selectedLocation || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <CloudRain className="w-4 h-4 mr-2" />
                  Generate Flood Prediction
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleTestAPI}
              disabled={loading}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Test API Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Prediction Results - {selectedLocation}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.main_prediction && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-sm text-gray-600 mb-2">Risk Level</h3>
                    <p className="text-lg font-bold text-blue-600">
                      {result.main_prediction['Risk Level'] || 'N/A'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-sm text-gray-600 mb-2">Confidence</h3>
                    <p className="text-lg font-bold text-green-600">
                      {result.main_prediction['Confidence'] || 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Raw API Response:</h3>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FloodPredictionSimple;