import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  Bell, 
  Settings,
  Camera,
  Save,
  Plus,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import GradientCard from '@/components/GradientCard';

const ProfilePage = () => {
  const { userProfile, updateUserProfile, currentUser } = useAuth();

  // Debug logging
  console.log('Profile page rendering...');
  console.log('Current user:', currentUser);
  console.log('User profile:', userProfile);

  // Early return with simple content to test if page loads at all
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-gray-400 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-600">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Simple Header for Testing */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-12 h-12 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-lg text-slate-600">Manage your account and preferences</p>
        </div>
      </div>

      {/* Simple Profile Info for Testing */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Basic Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Display Name</Label>
              <p className="text-lg font-medium">{userProfile?.displayName || 'Not set'}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg font-medium">{userProfile?.email || 'Not set'}</p>
            </div>
            <div>
              <Label>Role</Label>
              <Badge variant="secondary">
                {userProfile?.role?.replace('_', ' ').toUpperCase() || 'USER'}
              </Badge>
            </div>
            <div>
              <Label>Member Since</Label>
              <p className="text-sm text-gray-600">
                {userProfile?.joinedAt ? new Date(userProfile.joinedAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;