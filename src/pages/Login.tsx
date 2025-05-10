import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading, currentUser, refreshAuth } = useAuth();
  const navigate = useNavigate();
  const [sessionCheckAttempted, setSessionCheckAttempted] = useState(false);

  // Check for existing session and redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (sessionCheckAttempted) return;
        
        // If not loading and we have a user, redirect to dashboard
        if (!isLoading && currentUser && !isLoggingIn) {
          console.log("User is logged in, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
          return;
        }
        
        // If not loading and no user, try refreshing auth once
        if (!isLoading && !currentUser && !isLoggingIn && !sessionCheckAttempted) {
          console.log("No user found, checking for valid session...");
          setSessionCheckAttempted(true);
          
          await refreshAuth();
          
          // After refresh, check again for user
          if (currentUser) {
            console.log("Valid session found after refresh, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
          } else {
            console.log("No valid session found, staying on login page");
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
      }
    };
    
    checkAuth();
  }, [currentUser, isLoading, navigate, isLoggingIn, sessionCheckAttempted, refreshAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      setError(null);
      setIsLoggingIn(true);
      
      // Attempt to login
      const authResult = await login(email, password);
      
      // If we have a valid session/token but no profile data, still proceed to dashboard
      // The dashboard will handle displaying appropriate messages about the missing profile
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 500);
      
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || "Failed to login. Please check your credentials and try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading state only during initial auth check, not during login attempt
  if (isLoading && !isLoggingIn && !sessionCheckAttempted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Checking authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Login to access your dashboard
          </CardDescription>
        </CardHeader>
        {error && (
          <div className="px-6">
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoggingIn}
              />
            </div>
            <div className="text-sm text-gray-500">
              <p>Demo credentials (if configured):</p>
              <p>Email: demo@example.com</p>
              <p>Password: password123</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full mb-4" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            
            {sessionCheckAttempted && !isLoggingIn && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => refreshAuth()}
              >
                Refresh Authentication
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
