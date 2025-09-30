import React, { useState, useEffect } from 'react';
import { LOCATION_COORDS } from '../lib/floodPredictionService';
import { comprehensiveIndianStatesDistricts, getAllStates, getAllDistricts } from '../lib/comprehensiveRegionData';
import { MapPin, Search, ChevronDown, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface AdminRegionSelectorProps {
  selectedRegions: string[];
  onRegionsChange: (regions: string[]) => void;
  className?: string;
}

interface RegionOption {
  name: string;
  type: 'state' | 'city' | 'district';
  state: string;
  coords?: { lat: number; lon: number };
}

const AdminRegionSelector: React.FC<AdminRegionSelectorProps> = ({ 
  selectedRegions, 
  onRegionsChange,
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredRegions, setFilteredRegions] = useState<RegionOption[]>([]);

  // Get all unique states from comprehensive data
  const allStates = getAllStates();

  // Generate comprehensive region options
  const generateRegionOptions = (): RegionOption[] => {
    const options: RegionOption[] = [
      // Special options
      { name: 'All Users', type: 'state', state: 'India' },
      { name: 'All States', type: 'state', state: 'India' },
      { name: 'Regional Alert', type: 'state', state: 'India' },
      { name: 'City Wide Alert', type: 'state', state: 'India' },
      { name: 'All Areas', type: 'state', state: 'India' },
    ];

    // Add all states
    allStates.forEach(state => {
      options.push({
        name: state,
        type: 'state',
        state: state
      });
    });

    // Add all cities from LOCATION_COORDS
    Object.entries(LOCATION_COORDS).forEach(([city, coords]) => {
      options.push({
        name: city,
        type: 'city',
        state: coords.state,
        coords: { lat: coords.lat, lon: coords.lon }
      });
    });

    // Add districts for each state from comprehensive data
    Object.entries(comprehensiveIndianStatesDistricts).forEach(([state, districts]) => {
      districts.forEach(district => {
        options.push({
          name: district,
          type: 'district',
          state: state
        });
      });
    });

    return options.sort((a, b) => a.name.localeCompare(b.name));
  };

  // Filter regions based on search query and selected state
  useEffect(() => {
    let regions = generateRegionOptions();

    if (selectedState) {
      regions = regions.filter(region => region.state === selectedState);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      regions = regions.filter(region =>
        region.name.toLowerCase().includes(query) ||
        region.state.toLowerCase().includes(query)
      );
    }

    setFilteredRegions(regions);
  }, [searchQuery, selectedState]);

  const handleRegionToggle = (region: string) => {
    if (selectedRegions.includes(region)) {
      onRegionsChange(selectedRegions.filter(r => r !== region));
    } else {
      onRegionsChange([...selectedRegions, region]);
    }
  };

  const handleSelectAll = () => {
    const allRegionNames = filteredRegions.map(r => r.name);
    onRegionsChange(allRegionNames);
  };

  const handleClearAll = () => {
    onRegionsChange([]);
  };

  const handleSelectAllInState = (state: string) => {
    const stateRegions = filteredRegions.filter(region => region.state === state);
    const stateRegionNames = stateRegions.map(region => region.name);
    const newSelections = [...new Set([...selectedRegions, ...stateRegionNames])];
    onRegionsChange(newSelections);
  };

  const handleDeselectAllInState = (state: string) => {
    const stateRegions = filteredRegions.filter(region => region.state === state);
    const stateRegionNames = stateRegions.map(region => region.name);
    const newSelections = selectedRegions.filter(region => !stateRegionNames.includes(region));
    onRegionsChange(newSelections);
  };

  const getRegionTypeColor = (type: string) => {
    switch (type) {
      case 'state': return 'bg-blue-100 text-blue-800';
      case 'city': return 'bg-green-100 text-green-800';
      case 'district': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* State Filter */}
      <div>
        <Label className="text-sm font-medium text-gray-700">Filter by State</Label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All States</option>
          {allStates.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="relative">
        <Label className="text-sm font-medium text-gray-700">Search Regions</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search for states, cities, or districts..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="text-xs"
        >
          Select All Visible
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="text-xs"
        >
          Clear All
        </Button>
      </div>

      {/* Selected Regions Display */}
      {selectedRegions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Selected Regions ({selectedRegions.length})
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedRegions.map(region => (
              <Badge
                key={region}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {region}
                <button
                  onClick={() => handleRegionToggle(region)}
                  className="ml-1 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Region Selection */}
      <div className="relative">
        <Label className="text-sm font-medium text-gray-700">Select Regions</Label>
        <ScrollArea className="h-48 w-full border border-gray-300 rounded-md mt-1">
          <div className="p-2 space-y-3">
            {filteredRegions.length > 0 ? (
              (() => {
                // Group regions by state
                const groupedRegions = filteredRegions.reduce((acc, region) => {
                  const state = region.state;
                  if (!acc[state]) {
                    acc[state] = [];
                  }
                  acc[state].push(region);
                  return acc;
                }, {} as Record<string, RegionOption[]>);

                // Sort states alphabetically
                const sortedStates = Object.keys(groupedRegions).sort();

                return sortedStates.map(state => (
                  <div key={state} className="space-y-2">
                    {/* State Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 pb-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-800">{state}</span>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 px-1 py-0">
                            {groupedRegions[state].length}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectAllInState(state)}
                            className="text-xs h-5 px-1"
                          >
                            All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeselectAllInState(state)}
                            className="text-xs h-5 px-1"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Regions in this state */}
                    <div className="space-y-1 ml-4">
                      {groupedRegions[state]
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(region => (
                        <div
                          key={`${region.name}-${region.state}`}
                          className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleRegionToggle(region.name)}
                        >
                          <Checkbox
                            checked={selectedRegions.includes(region.name)}
                            onChange={() => handleRegionToggle(region.name)}
                            className="h-3 w-3"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <span className="text-xs font-medium">{region.name}</span>
                              <Badge 
                                variant="outline" 
                                className={`text-xs px-1 py-0 ${getRegionTypeColor(region.type)}`}
                              >
                                {region.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No regions found
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Quick Selection Presets */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Quick Selection</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRegionsChange(['All Users'])}
            className="text-xs"
          >
            All Users
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRegionsChange(['Regional Alert'])}
            className="text-xs"
          >
            Regional Alert
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRegionsChange(['City Wide Alert'])}
            className="text-xs"
          >
            City Wide Alert
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onRegionsChange(['All Areas'])}
            className="text-xs"
          >
            All Areas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegionSelector;