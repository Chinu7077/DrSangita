import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarClock,
  LogOut,
  Stethoscope,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/doctor/patients", label: "Patients", icon: Users },
  { to: "/doctor/patients/new", label: "New Patient", icon: UserPlus },
  { to: "/doctor/follow-ups", label: "Follow-ups", icon: CalendarClock },
] as const;

export function DoctorShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/doctor/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col glass border-r p-4 gap-2">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div>
            <div className="font-semibold">Dr. Sangita's Clinic</div>
            <div className="text-xs text-muted-foreground">Doctor Portal</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          {nav.map((n) => {
            const active =
              pathname === n.to ||
              (n.to !== "/doctor/dashboard" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                <n.icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="justify-start"
          >
            {theme === "dark" ? (
              <Sun className="size-4 mr-2" />
            ) : (
              <Moon className="size-4 mr-2" />
            )}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="justify-start"
          >
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="md:hidden glass border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
            <span className="font-semibold">Dr. Sangita's Clinic</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 md:p-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>

        <nav className="md:hidden fixed bottom-0 inset-x-0 glass border-t flex justify-around py-2 z-50">
          {nav.map((n) => {
            const active =
              pathname === n.to ||
              (n.to !== "/doctor/dashboard" && pathname.startsWith(n.to));
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                <n.icon className="size-5" />
                <span className="truncate">{n.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
        <div className="md:hidden h-16" />
      </main>
    </div>
  );
}
