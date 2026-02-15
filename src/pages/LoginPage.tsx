import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Telescope, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast.success("Welcome aboard, astronomer!");
      navigate("/", { replace: true });
    } else {
      toast.error("Please enter email and password");
    }
  };

  const handleDemo = () => {
    demoLogin();
    toast.success("Entering demo mode — explore freely!");
    navigate("/", { replace: true });
  };

  const scaledownKey = import.meta.env.VITE_SCALEDOWN_API_KEY;

  return (
    <div className="min-h-screen bg-background bg-starfield flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-cosmos" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-nebula shadow-2xl shadow-primary/30 animate-float mb-4">
            <Telescope className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-stellar">DeepSpace Analyst</h1>
          <p className="text-muted-foreground mt-1">Astronomy Data Navigator</p>
        </div>

        <Card className="glass-card border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>Access your research workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="astronomer@observatory.edu"
                    className="pl-10 bg-background/50 border-border/50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-border/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full btn-cosmic">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button onClick={handleDemo} variant="outline" className="w-full group">
              <Sparkles className="mr-2 h-4 w-4 text-star group-hover:animate-pulse" />
              Enter Demo Mode
            </Button>

            {!scaledownKey && (
              <div className="mt-4 flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-star/10 px-3 py-1 text-xs font-medium text-star border border-star/20">
                  <Sparkles className="h-3 w-3" />
                  Demo Mode — No API Key
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Astronomy Data Navigator — DeepSpace Analyst
        </p>
      </div>
    </div>
  );
}
