import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { supabase } from "@/lib/supabase";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Chrome,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

const SupabaseAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn, resetPassword, user, loading, isAdmin } =
    useSupabaseAuth();

  // Determine active tab based on URL path
  const isSignupPage = location.pathname === "/admin/signup";
  const [activeTab, setActiveTab] = useState(
    isSignupPage ? "signup" : "signin"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    secretKey: "",
  });

  // Redirect if already authenticated with Supabase
  useEffect(() => {
    console.log('SupabaseAuth useEffect - user:', user?.email, 'loading:', loading, 'pathname:', location.pathname);
    if (user && !loading) {
      // Since Supabase is used specifically for admin authentication,
      // all Supabase users are considered admins
      console.log('User already authenticated, redirecting to admin dashboard');
      // Add a small delay to prevent race conditions
      setTimeout(() => {
        navigate("/admin");
      }, 100);
    }
  }, [user, loading, navigate, location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting admin sign-in for:', formData.email);
      const { user, error } = await signIn(formData.email, formData.password);
      console.log('Sign-in result - user:', user?.email, 'error:', error);
      if (!error && user) {
        // Since Supabase is used specifically for admin authentication,
        // all Supabase users are considered admins
        console.log('Admin sign-in successful, redirecting to admin dashboard');
        // Add a small delay to prevent race conditions
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      !formData.fullName ||
      !formData.secretKey
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate secret key
    const validSecretKeys = [
      "janrakshak25",
      "admin2025",
      "EMERGENCY_RESPONSE_KEuY",
      "JANRAKSHAK_ADMIN_2025",
    ];

    if (!validSecretKeys.includes(formData.secretKey)) {
      toast.error(
        "Invalid admin secret key. Please contact system administrator."
      );
      return;
    }

    setIsLoading(true);
    try {
      const { user, error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        secret_key: formData.secretKey,
      });
      if (!error && user) {
        toast.success(
          "Admin account created! Please check your email to verify your account before signing in."
        );
        // Redirect to signin page after successful signup
        navigate("/admin/signin");
      }
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(formData.email);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Enterprise-grade security with Supabase Auth",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: CheckCircle,
      title: "Email Verification",
      description: "Secure account verification via email",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: AlertTriangle,
      title: "Password Recovery",
      description: "Easy password reset functionality",
      color: "text-orange-600 bg-orange-100",
    },
  ];

  // Show loading screen during authentication
  if (loading || isLoading) {
    return <LoadingScreen message="Signing you in..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Features */}
        <div className="space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">JanRakshak</h1>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Secure Access to Your Account
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Sign in to access your personalized flood monitoring dashboard,
              emergency alerts, and community features.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center lg:text-left">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Crown className="w-6 h-6 text-purple-600 animate-pulse" />
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Access
                </CardTitle>
              </div>
              <CardDescription>
                Sign in to your admin account or create a new admin account with
                secret key
              </CardDescription>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-purple-700">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Admin accounts require a secret key for registration
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("reset")}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secretKey">Admin Secret Key</Label>
                      <div className="relative">
                        <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="secretKey"
                          name="secretKey"
                          type="password"
                          placeholder="Enter admin secret key"
                          value={formData.secretKey}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Contact system administrator for the secret key
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Reset Password Tab */}
                <TabsContent value="reset" className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Reset Password
                    </h3>
                    <p className="text-slate-600">
                      Enter your email address and we'll send you a link to
                      reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                          id="reset-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => setActiveTab("signin")}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupabaseAuthPage;
