import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import GradientCard from "@/components/GradientCard";
import {
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  BarChart3,
  Brain,
  Droplets,
  CloudRain,
  Wind,
  Thermometer,
} from "lucide-react";

const Predictions = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeSlider, setTimeSlider] = useState([0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  const timeframes = [
    { label: "24h", value: "24h", active: true },
    { label: "48h", value: "48h", active: false },
    { label: "72h", value: "72h", active: false },
  ];

  const predictionMetrics = [
    {
      title: "AI Accuracy",
      value: "94.7%",
      change: "+2.3% from last month",
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Early Warning",
      value: "47 min",
      change: "Within target range",
      icon: AlertCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Data Sources",
      value: "1,247",
      change: "Real-time monitoring",
      icon: Activity,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
  ];

  const weatherData = [
    {
      parameter: "Rainfall",
      value: "45mm",
      status: "Heavy",
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      parameter: "Wind Speed",
      value: "25 km/h",
      status: "Moderate",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      parameter: "Temperature",
      value: "28°C",
      status: "Normal",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      parameter: "Humidity",
      value: "85%",
      status: "High",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-blue-800 bg-clip-text text-transparent">
          AI-Powered Flood Prediction
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Advanced machine learning algorithms analyze weather patterns,
          historical data, and real-time conditions to predict flood events up
          to 72 hours in advance
        </p>
      </div>

      {/* Prediction Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {predictionMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <GradientCard
              key={index}
              className={`p-6 bg-gradient-to-br ${metric.bgColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-white/70 text-slate-700"
                >
                  {metric.title}
                </Badge>
              </div>
              <div className="space-y-2">
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
                >
                  {metric.value}
                </div>
                <p className="text-sm text-slate-600">{metric.change}</p>
              </div>
            </GradientCard>
          );
        })}
      </div>

      {/* Main Prediction Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prediction Timeline & Simulation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline Controls */}
          <GradientCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Prediction Timeline
              </h2>
              <div className="flex space-x-2">
                {timeframes.map((timeframe) => (
                  <Button
                    key={timeframe.value}
                    size="sm"
                    variant={
                      selectedTimeframe === timeframe.value
                        ? "default"
                        : "outline"
                    }
                    className={
                      selectedTimeframe === timeframe.value
                        ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                        : ""
                    }
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                  >
                    {timeframe.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Simulation Area */}
            <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl h-64 p-6 relative overflow-hidden">
              {/* Chart Simulation */}
              <div className="absolute inset-6">
                <div className="w-full h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-0">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="border-r border-b border-slate-300/30"
                      ></div>
                    ))}
                  </div>

                  {/* Prediction curve */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 20 180 Q 100 120 180 100 T 340 80 T 500 90"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      fill="none"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="50%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#EF4444" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Data points */}
                  <div className="absolute top-16 left-16 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 left-32 w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
                  <div className="absolute top-8 left-48 w-3 h-3 bg-red-500 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex justify-between text-xs text-slate-600">
                <span>Now</span>
                <span>12h</span>
                <span>24h</span>
                <span>36h</span>
                <span>48h</span>
              </div>
            </div>
          </GradientCard>

          {/* Flood Spread Simulation */}
          <GradientCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Flood Spread Simulation
              </h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Next 6 hours
              </Badge>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl">
              <Button
                size="sm"
                variant={isPlaying ? "secondary" : "default"}
                className={
                  !isPlaying
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    : ""
                }
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              <Button size="sm" variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <div className="flex-1 px-4">
                <Slider
                  value={timeSlider}
                  onValueChange={setTimeSlider}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <span className="text-sm text-slate-600 min-w-fit">
                T+{timeSlider[0]}%
              </span>
            </div>

            {/* Simulation Map */}
            <div className="relative bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl h-80 overflow-hidden">
              {/* Animated flood simulation */}
              <div className="absolute inset-4 rounded-xl overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-1000 ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                >
                  {/* Base terrain */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-800 via-blue-600 to-teal-500 relative">
                    {/* Flood zones with dynamic scaling */}
                    <div
                      className="absolute top-12 left-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full opacity-80 transition-all duration-2000"
                      style={{
                        width: `${60 + timeSlider[0] * 0.8}px`,
                        height: `${60 + timeSlider[0] * 0.8}px`,
                      }}
                    ></div>
                    <div
                      className="absolute top-20 right-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-70 transition-all duration-2000"
                      style={{
                        width: `${80 + timeSlider[0] * 1.2}px`,
                        height: `${80 + timeSlider[0] * 1.2}px`,
                      }}
                    ></div>
                    <div
                      className="absolute bottom-16 left-20 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-60 transition-all duration-2000"
                      style={{
                        width: `${50 + timeSlider[0] * 0.6}px`,
                        height: `${50 + timeSlider[0] * 0.6}px`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center justify-between text-white text-sm mb-2">
                    <span>Simulation Progress</span>
                    <span>Next 6 hours</span>
                  </div>
                  <Progress value={timeSlider[0]} className="h-2 bg-white/20" />
                </div>
              </div>
            </div>
          </GradientCard>
        </div>

        {/* Weather Data & Risk Analysis */}
        <div className="space-y-6">
          {/* Current Weather Conditions */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Weather Conditions
            </h3>
            <div className="space-y-4">
              {weatherData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {item.parameter === "Rainfall" && (
                      <CloudRain className="w-5 h-5 text-blue-600" />
                    )}
                    {item.parameter === "Wind Speed" && (
                      <Wind className="w-5 h-5 text-slate-600" />
                    )}
                    {item.parameter === "Temperature" && (
                      <Thermometer className="w-5 h-5 text-red-600" />
                    )}
                    {item.parameter === "Humidity" && (
                      <Droplets className="w-5 h-5 text-teal-600" />
                    )}
                    <span className="text-sm font-medium text-slate-700">
                      {item.parameter}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-900">
                      {item.value}
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${item.bgColor} ${item.color}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </GradientCard>

          {/* Risk Levels */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Risk Assessment
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Riverside District
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    Critical
                  </Badge>
                </div>
                <Progress value={95} className="h-2" />
                <p className="text-xs text-slate-600">
                  High probability of severe flooding in 2-4 hours
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Industrial Zone
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 text-xs"
                  >
                    Moderate
                  </Badge>
                </div>
                <Progress value={72} className="h-2" />
                <p className="text-xs text-slate-600">
                  Moderate risk, monitoring continues
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Downtown Area
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 text-xs"
                  >
                    Low
                  </Badge>
                </div>
                <Progress value={28} className="h-2" />
                <p className="text-xs text-slate-600">
                  Low risk, normal conditions expected
                </p>
              </div>
            </div>
          </GradientCard>

          {/* Historical Comparison */}
          <GradientCard className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Historical Analysis
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    Similar Event
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 text-xs"
                  >
                    March 2023
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  87% pattern match with current conditions
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-600">
                    Managed successfully with early intervention
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    Prediction Confidence
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 text-xs"
                  >
                    High
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-yellow-700 mb-1">
                  92%
                </div>
                <p className="text-xs text-slate-600">
                  Based on 15+ data sources and ML models
                </p>
              </div>
            </div>
          </GradientCard>
        </div>
      </div>

      {/* Alert Timeline */}
      <GradientCard className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Predicted Alert Timeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-red-800">
                Critical Alert
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-2">Riverside District</p>
            <p className="text-xs text-slate-600">Expected in 2-3 hours</p>
            <p className="text-xs text-slate-500 mt-1">
              Immediate evacuation may be required
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
              <span className="text-sm font-semibold text-yellow-800">
                Warning Alert
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-2">Industrial Zone</p>
            <p className="text-xs text-slate-600">Expected in 4-6 hours</p>
            <p className="text-xs text-slate-500 mt-1">
              Precautionary measures advised
            </p>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-700"></div>
              <span className="text-sm font-semibold text-blue-800">
                Advisory
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-2">Downtown Area</p>
            <p className="text-xs text-slate-600">Expected in 8-12 hours</p>
            <p className="text-xs text-slate-500 mt-1">
              Monitor conditions closely
            </p>
          </div>
        </div>
      </GradientCard>
    </div>
  );
};

export default Predictions;
