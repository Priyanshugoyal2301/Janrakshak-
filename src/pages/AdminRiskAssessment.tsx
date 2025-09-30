import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import FloodDamageAnalysis from '@/components/FloodDamageAnalysis';
import { Shield } from 'lucide-react';

const AdminRiskAssessment = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-teal-600" />
              Image-Based Risk Assessment
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered flood damage analysis using image assessment
            </p>
          </div>
        </div>

        {/* Image-Based Assessment Component */}
        <FloodDamageAnalysis />
      </div>
    </AdminLayout>
  );
};

export default AdminRiskAssessment;