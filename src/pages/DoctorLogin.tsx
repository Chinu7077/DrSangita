import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!remember) {
      // Session persists in localStorage; checkbox is UI preference only.
    }
    toast.success("Welcome back, Doctor");
    navigate("/doctor/dashboard");
  };

  const handleForgot = async () => {
    if (!email) return toast.error("Enter your email first");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/doctor/login`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-xl font-semibold">Dr. Sangita's Clinic</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
            Care that feels
            <br /> personal, organized.
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            Manage patients, visits, prescriptions and follow-ups — beautifully.
          </p>
        </motion.div>
        <div className="text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} Dr. Sangita Kumari Nayak
        </div>
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
       <motion.div
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  className="glass w-full max-w-md rounded-3xl p-8 shadow-elegant"
>
  <div className="flex justify-end mb-4">
    <Link to="/">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Home className="size-4" />
        Home
      </Button>
    </Link>
  </div>

  <div className="flex items-center gap-2 lg:hidden mb-6">
    <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
      <img
        src="/HLOGO.png"
        alt="Clinic Logo"
        className="w-full h-full object-contain p-1"
      />
    </div>
    <span className="font-semibold">Dr. Sangita's Clinic</span>
  </div>

  <h2 className="text-2xl font-semibold">Doctor sign in</h2>
  <p className="text-sm text-muted-foreground mt-1">
    Access your clinic dashboard
  </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                />{" "}
                Remember me
              </label>
              <button
                type="button"
                onClick={handleForgot}
                className="text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            Are you a patient?{" "}
            <Link to="/patient-portal" className="text-primary hover:underline">
              Open Patient Portal
            </Link>
          </div>
          <div className="mt-3 text-center text-sm text-muted-foreground">
            <Link to="/" className="text-primary hover:underline">
              Back to clinic website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
