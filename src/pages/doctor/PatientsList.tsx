import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, UserPlus, Phone, IdCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export default function PatientsList() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["patients", q],
    queryFn: async () => {
      let query = supabase.from("patients").select("id, patient_id, name, mobile, gender, age, photo_url").order("created_at", { ascending: false }).limit(100);
      if (q.trim()) {
        const term = q.trim();
        query = supabase
          .from("patients")
          .select("id, patient_id, name, mobile, gender, age, photo_url")
          .or(`patient_id.ilike.%${term}%,name.ilike.%${term}%,mobile.ilike.%${term}%`)
          .limit(50);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">Search by ID, name or mobile.</p>
        </div>
        <Link to="/doctor/patients/new">
          <Button className="bg-gradient-primary text-primary-foreground shadow-elegant">
            <UserPlus className="size-4 mr-2" /> New patient
          </Button>
        </Link>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="relative">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="PT0010 · Ramesh · 98765..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <div className="text-muted-foreground">Loading…</div>}
        {data?.length === 0 && !isLoading && (
          <div className="text-muted-foreground col-span-full text-center py-10">No patients found.</div>
        )}
        {data?.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Link to={`/doctor/patients/${p.id}`}>
              <div className="glass rounded-2xl p-4 flex items-center gap-3 hover:shadow-elegant transition-shadow cursor-pointer">
                <img
                  src={p.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.name)}`}
                  alt={p.name}
                  className="size-14 rounded-xl object-cover bg-muted"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <IdCard className="size-3" /> {p.patient_id}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <Phone className="size-3" /> {p.mobile} · {p.gender ?? "—"} · {p.age ?? "—"}y
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
