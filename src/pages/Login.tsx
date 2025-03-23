
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const { login, currentUser, isLoading } = useAuth();
  const [loginLoading, setLoginLoading] = useState(false);
  const [testUsers, setTestUsers] = useState<{email: string}[]>([]);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoginLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (!success) {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setLoginLoading(false);
    }
  };
  
  // Fetch available test users for development
  useState(() => {
    const fetchTestUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .limit(5);
        
        if (error) throw error;
        setTestUsers(data);
      } catch (err) {
        console.error("Error fetching test users:", err);
      }
    };
    
    fetchTestUsers();
  });
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Kanban Board</h1>
          <p className="text-muted-foreground">Log in to manage your tasks</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={loginLoading}>
              {loginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </Form>
        
        {testUsers.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-center text-muted-foreground mb-3">
              Test users (use any password)
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {testUsers.map((user, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue("email", user.email);
                    form.setValue("password", "password123");
                  }}
                >
                  {user.email}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
