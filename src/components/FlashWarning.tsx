import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FlashWarningProps {
  alert: {
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    region: string;
    created_at: string;
  };
  onDismiss: () => void;
  onAcknowledge: () => void;
}

const FlashWarning: React.FC<FlashWarningProps> = ({ 
  alert, 
  onDismiss, 
  onAcknowledge 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pulse, setPulse] = useState(true);

  // Auto-pulse effect for critical alerts
  useEffect(() => {
    if (alert.severity === 'critical') {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [alert.severity]);

  // Play warning sound
  useEffect(() => {
    if (soundEnabled && alert.severity === 'critical') {
      const playWarningSound = () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          // Create a more urgent warning sound
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
          
          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
          console.log('Warning sound failed:', e);
        }
      };

      // Play sound immediately and then every 3 seconds for critical alerts
      playWarningSound();
      const soundInterval = setInterval(playWarningSound, 3000);
      
      return () => clearInterval(soundInterval);
    }
  }, [soundEnabled, alert.severity]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Allow animation to complete
  };

  const handleAcknowledge = () => {
    setIsVisible(false);
    setTimeout(onAcknowledge, 300);
  };

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'critical': return 'bg-red-500 border-red-600';
      case 'high': return 'bg-orange-500 border-orange-600';
      case 'medium': return 'bg-yellow-500 border-yellow-600';
      case 'low': return 'bg-blue-500 border-blue-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getSeverityTextColor = () => {
    switch (alert.severity) {
      case 'critical': return 'text-red-100';
      case 'high': return 'text-orange-100';
      case 'medium': return 'text-yellow-100';
      case 'low': return 'text-blue-100';
      default: return 'text-gray-100';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card 
        className={`w-full max-w-2xl ${getSeverityColor()} ${pulse && alert.severity === 'critical' ? 'animate-pulse' : ''} transform transition-all duration-300`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className={`w-8 h-8 ${getSeverityTextColor()}`} />
              <div>
                <h2 className={`text-2xl font-bold ${getSeverityTextColor()}`}>
                  {alert.severity === 'critical' ? '🚨 CRITICAL FLOOD ALERT' : '⚠️ FLOOD WARNING'}
                </h2>
                <p className={`text-sm ${getSeverityTextColor()} opacity-90`}>
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`${getSeverityTextColor()} hover:bg-white hover:bg-opacity-20`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className={`${getSeverityTextColor()} hover:bg-white hover:bg-opacity-20`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Alert Content */}
          <div className={`mb-6 ${getSeverityTextColor()}`}>
            <p className="text-lg mb-2 font-medium">
              {alert.message}
            </p>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span>📍 {alert.region}</span>
              <span>🕐 {new Date(alert.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-75">
              {alert.severity === 'critical' && (
                <p className={`${getSeverityTextColor()}`}>
                  ⚠️ This is a critical alert requiring immediate attention
                </p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleDismiss}
                className={`${getSeverityTextColor()} border-white border-opacity-30 hover:bg-white hover:bg-opacity-20`}
              >
                Dismiss
              </Button>
              <Button
                onClick={handleAcknowledge}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                I Understand
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FlashWarning;