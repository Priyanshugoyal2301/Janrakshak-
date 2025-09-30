import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Users, AlertTriangle, Crown, Sparkles, Waves, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats] = useState({
    protectedAreas: 1247,
    activeUsers: 89456,
    alertsSent: 23456,
    accuracyRate: 94.7,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: AlertTriangle,
      title: 'Early Warning System',
      description: 'Get alerts up to 47 minutes before flooding occurs',
      color: 'text-red-600 bg-red-100',
    },
    {
      icon: Shield,
      title: 'AI-Powered Predictions',
      description: '94.7% accuracy in flood risk assessment',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Real-time reports from local communities',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Waves,
      title: 'Live Monitoring',
      description: '24/7 monitoring across Punjab and India',
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-teal-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-3000"></div>
      </div>

      {/* Navigation */}
      <nav className={`bg-white/80 backdrop-blur-xl border-b border-blue-100 sticky top-0 z-50 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center animate-pulse">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                JanRakshak
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth?mode=login')}
                className="text-slate-600 hover:text-blue-600 transition-colors duration-300"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 animate-bounce">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Flood Early Warning System
              </Badge>
            </div>
            
            <div className={`transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                Protecting Communities with
                <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent animate-pulse">
                  Smart Flood Alerts
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Advanced AI technology monitors water levels, weather patterns, and flood risks 
                across India, providing life-saving early warnings to communities and emergency responders.
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className={`flex flex-col sm:flex-row justify-center gap-6 pt-8 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=register')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Users className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Sign In as User
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/admin/signin')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Crown className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Sign In as Admin
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="text-center group">
                <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform duration-300">{stats.protectedAreas.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Protected Areas</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform duration-300">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Active Users</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-purple-600 group-hover:scale-110 transition-transform duration-300">{stats.alertsSent.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Alerts Sent</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-orange-600 group-hover:scale-110 transition-transform duration-300">{stats.accuracyRate}%</div>
                <div className="text-sm text-slate-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center space-y-4 mb-16 transition-all duration-1000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-slate-900">
              Why Choose JanRakshak?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced technology meets community-driven solutions for comprehensive flood protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:scale-105 group ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                  style={{ transitionDelay: `${1300 + index * 200}ms` }}
                >
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-1000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Protect Your Community?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of communities already using JanRakshak for early flood warnings
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=register')}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Users className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                Sign In as User
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/admin/signin')}
                className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <Crown className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Sign In as Admin
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-2000"></div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JanRakshak</span>
              </div>
              <p className="text-slate-400 text-sm">
                AI-powered flood early warning system protecting communities across India.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Early Warning Alerts</li>
                <li>Real-time Monitoring</li>
                <li>Community Reports</li>
                <li>Emergency Planning</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Help Center</li>
                <li>Emergency Contacts</li>
                <li>Training Resources</li>
                <li>API Documentation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Emergency</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📞 National: 108</li>
                <li>🚨 Punjab: 112</li>
                <li>📧 alerts@janrakshak.in</li>
                <li>🌐 Status: All Systems Up</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 JanRakshak. Built for disaster resilience and community safety.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;