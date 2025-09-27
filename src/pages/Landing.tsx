import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Zap, Users, Globe, TrendingUp, AlertTriangle, Phone, Eye, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats] = useState({
    protectedAreas: 1247,
    activeUsers: 89456,
    alertsSent: 23456,
    accuracyRate: 94.7,
  });

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
      icon: Globe,
      title: 'Live Monitoring',
      description: '24/7 monitoring across Punjab and India',
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Rajesh Kumar',
      role: 'Disaster Management Officer',
      location: 'Punjab State',
      text: 'JalRakshak has revolutionized our flood response. The early warnings have saved countless lives.',
      avatar: '👨‍💼',
    },
    {
      name: 'Priya Sharma',
      role: 'Community Leader',
      location: 'Amritsar',
      text: 'The mobile alerts reached us 30 minutes before flooding. We evacuated safely thanks to JalRakshak.',
      avatar: '👩‍🏫',
    },
    {
      name: 'Captain Vikram Singh',
      role: 'Emergency Response Team',
      location: 'Ludhiana',
      text: 'Real-time data and evacuation routes help us respond faster and more effectively.',
      avatar: '👨‍🚒',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                JalRakshak
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth?mode=login')}
                className="text-slate-600 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth?mode=register')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
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
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2">
              🚀 AI-Powered Flood Early Warning System
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Protecting Communities with
              <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 bg-clip-text text-transparent">
                Smart Flood Alerts
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Advanced AI technology monitors water levels, weather patterns, and flood risks 
              across India, providing life-saving early warnings to communities and emergency responders.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=register')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 text-lg"
              >
                Start Protecting Your Community
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth?mode=demo')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.protectedAreas.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Protected Areas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.alertsSent.toLocaleString()}</div>
                <div className="text-sm text-slate-600">Alerts Sent</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{stats.accuracyRate}%</div>
                <div className="text-sm text-slate-600">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">
              Why Choose JalRakshak?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Advanced technology meets community-driven solutions for comprehensive flood protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-slate-900">
              Trusted by Communities
            </h2>
            <p className="text-xl text-slate-600">
              Real stories from people who rely on JalRakshak
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                    <div className="text-xs text-blue-600">{testimonial.location}</div>
                  </div>
                </div>
                <p className="text-slate-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Protect Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of communities already using JalRakshak for early flood warnings
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/auth?mode=register')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              <Shield className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth?mode=contact')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Emergency Team
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">JalRakshak</span>
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
                <li>📧 alerts@jalrakshak.in</li>
                <li>🌐 Status: All Systems Up</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 JalRakshak. Built for disaster resilience and community safety.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;