import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseAuthProviderMinimal } from "@/contexts/SupabaseAuthContextMinimal";
import { AlertProvider } from "@/contexts/AlertContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import SupabaseAuth from "./pages/SupabaseAuth";
import Admin from "./pages/Admin";
import AdminAlerts from "./pages/AdminAlerts";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AdminShelters from "./pages/AdminShelters";
import AdminRoutes from "./pages/AdminRoutes";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSystem from "./pages/AdminSystem";
import AdminFloodPrediction from "./pages/AdminFloodPrediction";
import AdminRiskAssessment from "./pages/AdminRiskAssessment";
import AdminTraining from "./pages/AdminTraining";
import AdminResilienceIndex from "./pages/AdminResilienceIndex";
import AdminGISMapping from "./pages/AdminGISMapping";
import AdminReportSystem from "./pages/AdminReportSystem";
import AdminTest from "./pages/AdminTest";
import AdminDebug from "./pages/AdminDebug";
import AdminSimple from "./pages/AdminSimple";
import AdminBasic from "./pages/AdminBasic";
import AdminMinimalTest from "./pages/AdminMinimalTest";
import NDMADashboard from "./pages/NDMADashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import DMADashboard from "./pages/DMADashboard";
import DMAAnalytics from "./pages/DMAAnalytics";
import DMAAlerts from "./pages/DMAAlerts";
import DMAReports from "./pages/DMAReports";
import DMAShelters from "./pages/DMAShelters";
import DMATraining from "./pages/DMATraining";
import DMAGISMapping from "./pages/DMAGISMapping";
import DMAFloodPrediction from "./pages/DMAFloodPrediction";
import DMARiskAssessment from "./pages/DMARiskAssessment";
import DMASystem from "./pages/DMASystem";
import NGOAlerts from "./pages/NGOAlerts";
import NGOUsers from "./pages/NGOUsers";
import NGOTraining from "./pages/NGOTraining";
import NGOShelters from "./pages/NGOShelters";
import NGOReports from "./pages/NGOReports";
import NGOAnalytics from "./pages/NGOAnalytics";
import NGOGISMapping from "./pages/NGOGISMapping";
import VolunteerActivities from "./pages/VolunteerActivities";
import VolunteerTraining from "./pages/VolunteerTraining";
import VolunteerReports from "./pages/VolunteerReports";
import RoleDashboardRouter from "./components/RoleDashboardRouter";
import RoleAwareProtectedRoute from "./components/RoleAwareProtectedRoute";
import RoleBasedLogin from "./pages/RoleBasedLogin";
import { RoleAwareAuthProvider } from "./contexts/RoleAwareAuthContext";
import { UserRole } from "./lib/roleBasedAuth";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import Community from "./pages/Community";
import FloodPredictionPage from "./pages/FloodPredictionPage";
import ShelterFinder from "./pages/ShelterFinder";
import EmergencyContacts from "./pages/EmergencyContacts";
import Predictions from "./pages/Predictions";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import JanRakshakChatbot from "./components/JanRakshakChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RoleAwareAuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/admin/signup"
                element={
                  <SupabaseAuthProvider>
                    <SupabaseAuth />
                  </SupabaseAuthProvider>
                }
              />
              <Route
                path="/admin/signin"
                element={
                  <SupabaseAuthProvider>
                    <SupabaseAuth />
                  </SupabaseAuthProvider>
                }
              />

              {/* Redirect old admin URLs */}
              <Route
                path="/supabase-auth"
                element={<Navigate to="/admin/signin" replace />}
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <Admin />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/alerts"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AlertProvider isAdminContext={true}>
                        <AdminAlerts />
                      </AlertProvider>
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminReports />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/shelters"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminShelters />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/routes"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminRoutes />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/risk-assessment"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminRiskAssessment />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/flood-prediction"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminFloodPrediction />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/training"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminTraining />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/resilience"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminResilienceIndex />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/gis-mapping"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminGISMapping />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/report-system"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminReportSystem />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminAnalytics />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminProtectedRoute>
                      <AdminSystem />
                    </AdminProtectedRoute>
                  </SupabaseAuthProviderMinimal>
                }
              />
              <Route path="/admin-test" element={<AdminTest />} />
              <Route path="/admin-debug" element={<AdminDebug />} />
              <Route path="/admin-simple" element={<AdminSimple />} />
              <Route path="/admin-basic" element={<AdminBasic />} />
              <Route
                path="/admin-minimal-test"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminMinimalTest />
                  </SupabaseAuthProviderMinimal>
                }
              />

              {/* Role-Based Authentication & Dashboard Routes */}
              <Route path="/role-login" element={<RoleBasedLogin />} />
              <Route
                path="/dashboard-router"
                element={<RoleDashboardRouter />}
              />

              {/* DMA Routes */}
              <Route
                path="/dma/alerts"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <AlertProvider isAdminContext={true}>
                      <DMAAlerts />
                    </AlertProvider>
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/reports"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMAReports />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/training"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMATraining />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/gis-mapping"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMAGISMapping />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/flood-prediction"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMAFloodPrediction />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/risk-assessment"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMARiskAssessment />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/shelters"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMAShelters />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/analytics"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMAAnalytics />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/dma/system"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.ADMIN, UserRole.DMA]}
                  >
                    <DMASystem />
                  </RoleAwareProtectedRoute>
                }
              />

              {/* NGO Routes */}
              <Route
                path="/ngo/alerts"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <AlertProvider isAdminContext={true}>
                      <NGOAlerts />
                    </AlertProvider>
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/users"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOUsers />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/training"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOTraining />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/shelters"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOShelters />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/reports"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOReports />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/analytics"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOAnalytics />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo/gis-mapping"
                element={
                  <RoleAwareProtectedRoute
                    requiredRoles={[UserRole.NGO, UserRole.VOLUNTEER]}
                  >
                    <NGOGISMapping />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ndma-dashboard"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.ADMIN}>
                    <NDMADashboard />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/ngo-dashboard"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.NGO}>
                    <NGODashboard />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/volunteer-dashboard"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.VOLUNTEER}>
                    <VolunteerDashboard />
                  </RoleAwareProtectedRoute>
                }
              />

              {/* Volunteer Routes */}
              <Route
                path="/volunteer/activities"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.VOLUNTEER}>
                    <VolunteerActivities />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/volunteer/training"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.VOLUNTEER}>
                    <VolunteerTraining />
                  </RoleAwareProtectedRoute>
                }
              />
              <Route
                path="/volunteer/reports"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.VOLUNTEER}>
                    <VolunteerReports />
                  </RoleAwareProtectedRoute>
                }
              />

              <Route
                path="/dma-dashboard"
                element={
                  <RoleAwareProtectedRoute requiredRoles={UserRole.DMA}>
                    <DMADashboard />
                  </RoleAwareProtectedRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <UserDashboard />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Community />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flood-prediction"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <FloodPredictionPage />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/old-dashboard"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Layout>
                        <Index />
                      </Layout>
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelters"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <ShelterFinder />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emergency-contacts"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <EmergencyContacts />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/predictions"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Layout>
                        <Predictions />
                      </Layout>
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Alerts />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Reports />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Profile />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AlertProvider>
                      <Analytics />
                    </AlertProvider>
                  </ProtectedRoute>
                }
              />

              {/* Redirect old routes */}
              <Route
                path="/index"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <JanRakshakChatbot />
        </TooltipProvider>
      </RoleAwareAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
