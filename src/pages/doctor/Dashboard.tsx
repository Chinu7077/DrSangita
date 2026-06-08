import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, CalendarDays, UserPlus, TrendingUp, CalendarClock, Search, Download } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

      const [{ count: total }, { count: todayCount }, { count: monthVisits }, { count: newThisMonth }, { count: followups }] = await Promise.all([
        supabase.from("patients").select("*", { count: "exact", head: true }),
        supabase.from("visits").select("*", { count: "exact", head: true }).eq("visit_date", today),
        supabase.from("visits").select("*", { count: "exact", head: true }).gte("visit_date", monthStart),
        supabase.from("patients").select("*", { count: "exact", head: true }).gte("created_at", monthStart),
        supabase.from("visits").select("*", { count: "exact", head: true }).eq("next_visit_date", today),
      ]);

      return {
        total: total ?? 0,
        today: todayCount ?? 0,
        monthVisits: monthVisits ?? 0,
        newThisMonth: newThisMonth ?? 0,
        followups: followups ?? 0,
      };
    },
  });

  const { data: recentPatients } = useQuery({
    queryKey: ["recent-patients"],
    queryFn: async () => {
      const { data } = await supabase
        .from("patients")
        .select("id, patient_id, name, mobile, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const handleExport = async () => {
    const { data } = await supabase.from("patients").select("*");
    if (!data?.length) return;
    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((r) => Object.values(r).map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `patients-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Patients" value={stats?.total ?? "—"} icon={Users} delay={0} accent />
        <StatCard label="Today's Visits" value={stats?.today ?? "—"} icon={CalendarDays} delay={0.05} />
        <StatCard label="Follow-up Due Today" value={stats?.followups ?? "—"} icon={CalendarClock} delay={0.1} />
        <StatCard label="This Month Visits" value={stats?.monthVisits ?? "—"} icon={TrendingUp} delay={0.15} />
        <StatCard label="New This Month" value={stats?.newThisMonth ?? "—"} icon={UserPlus} delay={0.2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Patients</h2>
            <Link to="/doctor/patients" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentPatients?.length === 0 && <div className="text-sm text-muted-foreground py-4">No patients yet. Add your first patient.</div>}
            {recentPatients?.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.patient_id} · {p.mobile}</div>
                </div>
                <Link to={`/doctor/patients/${p.id}`}>
                  <Button variant="ghost" size="sm">Open</Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Quick Actions</h2>
          <Link to="/doctor/patients/new"><Button className="w-full justify-start bg-gradient-primary text-primary-foreground shadow-elegant"><UserPlus className="size-4 mr-2" /> Add new patient</Button></Link>
          <Link to="/doctor/patients"><Button variant="outline" className="w-full justify-start"><Search className="size-4 mr-2" /> Search patients</Button></Link>
          <Link to="/doctor/follow-ups"><Button variant="outline" className="w-full justify-start"><CalendarClock className="size-4 mr-2" /> View follow-ups</Button></Link>
          <Button variant="outline" onClick={handleExport} className="w-full justify-start"><Download className="size-4 mr-2" /> Export patient data</Button>
        </div>
      </div>
    </div>
  );
}
