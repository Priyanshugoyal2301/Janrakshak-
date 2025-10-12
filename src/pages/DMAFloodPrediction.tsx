import React from "react";
import NDMALayout from "@/components/NDMALayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudRain, Droplets, AlertTriangle, TrendingUp } from "lucide-react";

const DMAFloodPrediction = () => {
  return (
    <NDMALayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">DMA Flood Prediction</h1>
            <p className="text-gray-600 mt-1">Monitor and predict flood risks across districts</p>
          </div>
          <Button>
            <CloudRain className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Risk Level</p>
                  <p className="text-2xl font-bold text-blue-800">Medium</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Rainfall</p>
                  <p className="text-2xl font-bold text-orange-800">45mm</p>
                </div>
                <Droplets className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Water Level</p>
                  <p className="text-2xl font-bold text-green-800">Normal</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Forecast</p>
                  <p className="text-2xl font-bold text-purple-800">72hrs</p>
                </div>
                <CloudRain className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">Weather forecast chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Sector 1", "Sector 2", "Sector 3"].map((sector, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>{sector}</span>
                    <span className="text-sm text-orange-600 font-medium">Medium Risk</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </NDMALayout>
  );
};

export default DMAFloodPrediction;