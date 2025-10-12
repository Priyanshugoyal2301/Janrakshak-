import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Users,
  Crown,
  Sparkles,
  AlertTriangle,
  MapPin,
  Clock,
  TrendingUp,
  Globe,
  Heart,
  Star,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JanRakshakLogo from "@/components/JanRakshakLogo";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute bottom-32 left-40 w-40 h-40 bg-gradient-to-r from-teal-400/20 to-green-400/20 rounded-full blur-xl"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <motion.div
                key={i}
                className="border border-blue-200"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.01,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-4 md:py-8">
        <div className="w-full px-6 lg:px-8">
          {/* Top Navigation */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  duration: 0.6,
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-lg opacity-30"></div>
                <JanRakshakLogo size="xl" variant="gradient" />
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  JanRakshak
                </motion.span>
                <span className="text-sm text-blue-600 font-semibold -mt-1">
                  Flood Protection System
                </span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth?mode=login")}
                  className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 px-6 py-2 rounded-full"
                >
                  Sign In
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/signin")}
                  className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 border-teal-200 hover:border-teal-300 transition-all duration-300 px-6 py-2 rounded-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Role Login
                </Button>
              </motion.div>
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate("/auth?mode=register")}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get Started
                  <ArrowRight className="w-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <div className="text-center space-y-8">
            {/* Animated Badge */}
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                }}
                className="inline-block"
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 text-base font-semibold shadow-xl border border-white/20 rounded-full">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-5 h-5 mr-3" />
                  </motion.div>
                  AI-Powered Flood Early Warning System
                </Badge>
              </motion.div>
            </motion.div>

            {/* Main Heading with 3D Effect */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight"
                style={{
                  textShadow:
                    "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(6, 182, 212, 0.2)",
                }}
              >
                Protecting Communities with
                <motion.span
                  className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent relative mt-2"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  Smart Flood Alerts
                  <motion.div
                    className="absolute -top-4 -right-4 text-6xl"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  ></motion.div>
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Enhanced Subtitle */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                Advanced AI technology monitors water levels, weather patterns,
                and flood risks across India, providing life-saving early
                warnings to communities and emergency responders.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-6 pt-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Button
                  size="lg"
                  onClick={() => navigate("/admin/signin")}
                  className="relative bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-white/20"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotateY: [0, 180, 360],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Shield className="w-6 h-6 mr-3" />
                  </motion.div>
                  Access JalRakshak
                  <motion.div
                    className="ml-3"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  y: -5,
                }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Button
                  size="lg"
                  onClick={() => navigate("/auth?mode=login")}
                  className="relative bg-gradient-to-r from-blue-100 to-cyan-100 backdrop-blur-xl text-blue-800 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-blue-300 hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-200"
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Users className="w-6 h-6 mr-3" />
                  </motion.div>
                  Citizen Dashboard
                  <motion.div
                    className="ml-3"
                    whileHover={{ x: 8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Impressive Facts */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-blue-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-black text-blue-600 mb-2">28</div>
                <div className="text-sm text-gray-600 font-semibold">
                  States Covered
                </div>
                <div className="text-xs text-gray-500 mt-1">Across India</div>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-green-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-black text-green-600 mb-2">
                  92.4%
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Accuracy Rate
                </div>
                <div className="text-xs text-gray-500 mt-1">AI Predictions</div>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-purple-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-black text-purple-600 mb-2">
                  2.3m
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Response Time
                </div>
                <div className="text-xs text-gray-500 mt-1">Average Alert</div>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-orange-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-4xl font-black text-orange-600 mb-2">
                  24/7
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  Monitoring
                </div>
                <div className="text-xs text-gray-500 mt-1">Continuous</div>
              </motion.div>
            </motion.div>

            {/* Key Features */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Real-time Alerts
                </div>
                <div className="text-gray-600 font-medium">
                  Instant flood warnings with precise location data
                </div>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  AI-Powered
                </div>
                <div className="text-gray-600 font-medium">
                  Machine learning models for accurate predictions
                </div>
              </motion.div>

              <motion.div
                className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-100"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  Community
                </div>
                <div className="text-gray-600 font-medium">
                  Crowdsourced reports from citizens nationwide
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4 text-gray-500"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-semibold">Trusted Platform</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-semibold">Community Driven</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold">AI-Powered</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 via-white to-teal-50 relative overflow-hidden">
        <div className="w-full px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-teal-200"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="w-4 h-4 mr-2" />
              Role-Based Access Control
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Secure Access for Every{" "}
              <motion.span
                className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Stakeholder
              </motion.span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Different roles, different dashboards, same mission. Access the
              right tools and data based on your responsibility in disaster
              management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* ADMIN Role */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(239, 68, 68, 0.15)",
              }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">ADMIN</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  National oversight, system configuration, user management, and
                  full analytics access
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    National Dashboard
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    User Management
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                    System Analytics
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NDMA/SDMA Role */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)",
              }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  NDMA/SDMA
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  State and national disaster management with training
                  coordination and resource allocation
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Training Analytics
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    State Operations
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    Partner Management
                  </div>
                </div>
              </div>
            </motion.div>

            {/* NGO Role */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(34, 197, 94, 0.15)",
              }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">NGO</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  District-focused operations, volunteer management, and
                  community program coordination
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Volunteer Management
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Local Programs
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Impact Analytics
                  </div>
                </div>
              </div>
            </motion.div>

            {/* VOLUNTEER Role */}
            <motion.div
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(147, 51, 234, 0.15)",
              }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  VOLUNTEER
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Field operations, training participation, emergency response
                  coordination and reporting
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    Field Operations
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    Training Records
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    Response Reports
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            className="text-center mt-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/role-login")}
                className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl border border-white/20"
              >
                <Shield className="w-6 h-6 mr-3" />
                Access Your Dashboard
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
            <p className="text-gray-500 mt-4 text-sm">
              Secure login with role-based authentication • Real database
              integration
            </p>
          </motion.div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="w-full px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How JanRakshak Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive flood protection system combines cutting-edge
              technology with community engagement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Smart Monitoring
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced sensors and satellite data continuously monitor water
                levels, rainfall patterns, and weather conditions across India's
                flood-prone regions.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(6, 182, 212, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Analysis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Machine learning algorithms analyze historical data, current
                conditions, and predictive models to forecast flood risks with
                96% accuracy.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Instant Alerts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                When flood risks are detected, instant alerts are sent to
                affected communities, emergency services, and government
                agencies within 2.3 minutes.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Community Reports
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Citizens can report flood conditions, upload photos, and share
                real-time information to help authorities respond faster and
                more effectively.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(249, 115, 22, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                National Coverage
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our system covers all 28 states and union territories,
                monitoring over 2,847 locations to ensure comprehensive flood
                protection nationwide.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                y: -5,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.1)",
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                24/7 Operations
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our monitoring systems operate continuously, providing
                round-the-clock flood surveillance and emergency response
                coordination.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="w-full px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Protect Your Community?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Join thousands of users who trust JanRakshak for reliable flood
              protection. Get started today and help build a safer India.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth?mode=register")}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-bold shadow-2xl rounded-2xl"
                >
                  <Users className="w-6 h-6 mr-3" />
                  Join as Citizen
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/admin/signin")}
                  className="bg-white/20 border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg font-bold rounded-2xl backdrop-blur-sm"
                >
                  <Crown className="w-6 h-6 mr-3" />
                  Admin Access
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="w-full px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <JanRakshakLogo size="lg" variant="gradient" />
                <div>
                  <h3 className="text-2xl font-bold">JanRakshak</h3>
                  <p className="text-gray-400">Flood Protection System</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Advanced AI-powered flood monitoring and early warning system
                protecting communities across India with real-time alerts and
                community engagement.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time Monitoring</li>
                <li>AI Predictions</li>
                <li>Community Reports</li>
                <li>Emergency Alerts</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Emergency Hotline</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 JanRakshak. All rights reserved. Protecting
              communities across India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
