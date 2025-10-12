import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRoleAwareAuth } from "@/contexts/RoleAwareAuthContext";
import {
  UserRole,
  RoleBasedAuthService,
  hasRoleAccess,
} from "@/lib/roleBasedAuth";

interface RoleAwareProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole | UserRole[];
  requiredPermissions?: {
    resource: string;
    action: "create" | "read" | "update" | "delete";
    scope?: "own" | "district" | "state" | "national";
  }[];
  fallbackPath?: string;
}

const RoleAwareProtectedRoute: React.FC<RoleAwareProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredPermissions,
  fallbackPath,
}) => {
  const { user, userProfile, loading } = useRoleAwareAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !userProfile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role access if required
  if (requiredRoles && !hasRoleAccess(userProfile, requiredRoles)) {
    const dashboardRoute = RoleBasedAuthService.getDashboardRoute(
      userProfile.role
    );
    return <Navigate to={fallbackPath || dashboardRoute} replace />;
  }

  // Check specific permissions if required
  if (requiredPermissions) {
    const hasAllPermissions = requiredPermissions.every((permission) =>
      RoleBasedAuthService.hasPermission(
        userProfile,
        permission.resource,
        permission.action,
        permission.scope
      )
    );

    if (!hasAllPermissions) {
      const dashboardRoute = RoleBasedAuthService.getDashboardRoute(
        userProfile.role
      );
      return <Navigate to={fallbackPath || dashboardRoute} replace />;
    }
  }

  return <>{children}</>;
};

export default RoleAwareProtectedRoute;
