import React from "react";
import NDMALayout from "@/components/NDMALayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Layers, Satellite, Navigation } from "lucide-react";

const DMAGISMapping = () => {
  return (
    <NDMALayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DMA GIS Intelligence</h1>
            <p className="text-gray-600 mt-1">Geographical intelligence and mapping for district management</p>
          </div>
          <Button>
            <MapPin className="w-4 h-4 mr-2" />
            Open Map Tool
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  District Risk Map
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full flex items-center justify-center bg-gray-50">
                <p className="text-gray-500">Interactive map will be loaded here</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Risk Zones", "Flood Areas", "Shelters", "Hospitals", "Roads"].map((layer) => (
                  <div key={layer} className="flex items-center justify-between">
                    <span className="text-sm">{layer}</span>
                    <input type="checkbox" className="rounded" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Mark Risk Area
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Satellite className="w-4 h-4 mr-2" />
                  Satellite View
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </NDMALayout>
  );
};

export default DMAGISMapping;