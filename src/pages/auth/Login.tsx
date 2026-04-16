import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogIn, ArrowRight, KeyRound } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome Back",
      description: "Signed in successfully.",
    });
    
    // AuthContext handles the redirection logic based on role when protected routes mount
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <Card className="max-w-md w-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10 rounded-[32px]">
        <CardHeader className="space-y-4 text-center pb-8 border-b border-white/5">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-white tracking-tight">Portal Sign In</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Access your clinical records and bookings.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-bold text-xs uppercase tracking-widest px-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="text-slate-300 font-bold text-xs uppercase tracking-widest">Password</Label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <KeyRound className="h-5 w-5 text-slate-400 shrink-0" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Your data is protected by industry-standard encryption and secure clinical protocols.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Secure Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-8 pt-0 flex flex-col items-center">
          <div className="h-px w-full bg-white/5 mb-6" />
          <p className="text-slate-500 text-sm font-medium">
            New patient?{" "}
            <Link to="/signup" className="text-primary font-black hover:text-primary/80 transition-colors">
              Create Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

