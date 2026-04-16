import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, ArrowRight, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site-config";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Account Created",
      description: "Welcome to our clinic! Please check your email to verify your account.",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c14] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <Card className="max-w-md w-full bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl relative z-10 rounded-[32px]">
        <CardHeader className="space-y-4 text-center pb-8 border-b border-white/5">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl font-black text-white tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              Join Moorestown Chiropractic & Wellness today.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-8">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-300 font-bold text-xs uppercase tracking-widest px-1">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-300 font-bold text-xs uppercase tracking-widest px-1">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl h-12 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-bold text-xs uppercase tracking-widest px-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300 font-bold text-xs uppercase tracking-widest px-1">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl h-12"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                By creating an account, you agree to our professional care standards and clinical guidelines.
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
                  Register for Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-8 pt-0 flex flex-col items-center">
          <div className="h-px w-full bg-white/5 mb-6" />
          <p className="text-slate-500 text-sm font-medium">
            Already registered?{" "}
            <Link to="/login" className="text-primary font-black hover:text-primary/80 transition-colors">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;

