import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SupabaseAuthProviderMinimal } from "@/contexts/SupabaseAuthContextMinimal";
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
import AdminTest from "./pages/AdminTest";
import AdminDebug from "./pages/AdminDebug";
import AdminSimple from "./pages/AdminSimple";
import AdminBasic from "./pages/AdminBasic";
import AdminMinimalTest from "./pages/AdminMinimalTest";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/signup" element={
              <SupabaseAuthProvider>
                <SupabaseAuth />
              </SupabaseAuthProvider>
            } />
            <Route path="/admin/signin" element={
              <SupabaseAuthProvider>
                <SupabaseAuth />
              </SupabaseAuthProvider>
            } />
              
              {/* Redirect old admin URLs */}
              <Route path="/supabase-auth" element={<Navigate to="/admin/signin" replace />} />
              
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
                      <AdminAlerts />
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
              <Route
                path="/admin-test"
                element={<AdminTest />}
              />
              <Route
                path="/admin-debug"
                element={<AdminDebug />}
              />
              <Route
                path="/admin-simple"
                element={<AdminSimple />}
              />
              <Route
                path="/admin-basic"
                element={<AdminBasic />}
              />
              <Route
                path="/admin-minimal-test"
                element={
                  <SupabaseAuthProviderMinimal>
                    <AdminMinimalTest />
                  </SupabaseAuthProviderMinimal>
                }
              />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/flood-prediction"
                element={
                  <ProtectedRoute>
                    <FloodPredictionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/old-dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelters"
                element={
                  <ProtectedRoute>
                    <ShelterFinder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/emergency-contacts"
                element={
                  <ProtectedRoute>
                    <EmergencyContacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/predictions"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Predictions />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <Alerts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              
              {/* Redirect old routes */}
              <Route path="/index" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;