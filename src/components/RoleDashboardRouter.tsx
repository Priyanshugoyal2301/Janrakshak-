import React from "react";
import { Navigate } from "react-router-dom";
import { useRoleAwareAuth } from "@/contexts/RoleAwareAuthContext";
import { UserRole, RoleBasedAuthService } from "@/lib/roleBasedAuth";

const RoleDashboardRouter: React.FC = () => {
  const { userProfile, loading } = useRoleAwareAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return <Navigate to="/auth" replace />;
  }

  // Route to appropriate dashboard based on role
  switch (userProfile.role) {
    case UserRole.ADMIN:
      return <Navigate to="/admin" replace />;

    case UserRole.DMA:
      return <Navigate to="/dma-dashboard" replace />;

    case UserRole.NGO:
      return <Navigate to="/ngo-dashboard" replace />;

    case UserRole.VOLUNTEER:
      return <Navigate to="/volunteer-dashboard" replace />;

    case UserRole.CITIZEN:
      return <Navigate to="/citizen-dashboard" replace />;

    default:
      // Fallback to admin dashboard for unknown roles
      return <Navigate to="/admin" replace />;
  }
};

export default RoleDashboardRouter;
