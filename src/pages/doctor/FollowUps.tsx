import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, parseISO } from "date-fns";
import { CalendarClock, MessageCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type FollowUpVisit = {
  id: string;
  visit_date: string;
  next_visit_date: string | null;
  diagnosis: string | null;
  patients: {
    id: string;
    patient_id: string;
    name: string;
    mobile: string;
    photo_url: string | null;
  } | null;
};

export default function FollowUps() {
  const today = format(new Date(), "yyyy-MM-dd");
  const weekEnd = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const { data } = useQuery({
    queryKey: ["follow-ups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visits")
        .select("id, visit_date, next_visit_date, diagnosis, patients(id, patient_id, name, mobile, photo_url)")
        .not("next_visit_date", "is", null)
        .lte("next_visit_date", weekEnd)
        .order("next_visit_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as FollowUpVisit[];
    },
  });

  const overdue = data?.filter((v) => v.next_visit_date! < today) ?? [];
  const dueToday = data?.filter((v) => v.next_visit_date === today) ?? [];
  const upcoming = data?.filter((v) => v.next_visit_date! > today) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground">Next visits scheduled within the next 7 days.</p>
      </div>

      <Section title="Overdue" items={overdue} variant="destructive" />
      <Section title="Due today" items={dueToday} variant="primary" />
      <Section title="Upcoming this week" items={upcoming} />
    </div>
  );
}

function Section({
  title,
  items,
  variant,
}: {
  title: string;
  items: FollowUpVisit[];
  variant?: "destructive" | "primary";
}) {
  if (items.length === 0) return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <div className="glass rounded-2xl p-6 text-sm text-muted-foreground">None</div>
    </div>
  );

  return (
    <div>
      <h2 className="font-semibold mb-2 flex items-center gap-2">
        {variant === "destructive" && <AlertCircle className="size-4 text-destructive" />}
        {variant === "primary" && <CalendarClock className="size-4 text-primary" />}
        {title} <span className="text-muted-foreground text-sm">({items.length})</span>
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`glass rounded-2xl p-4 flex items-center gap-3 ${variant === "destructive" ? "border-destructive/30" : ""}`}
          >
            <img
              src={v.patients?.photo_url?.startsWith("http") ? v.patients.photo_url : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(v.patients?.name ?? "P")}`}
              alt=""
              className="size-12 rounded-xl object-cover bg-muted"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{v.patients?.name}</div>
              <div className="text-xs text-muted-foreground">
                {v.patients?.patient_id} · Next: {format(parseISO(v.next_visit_date!), "dd MMM yyyy")}
              </div>
              <div className="text-xs text-muted-foreground truncate">{v.diagnosis}</div>
            </div>
            <div className="flex flex-col gap-1">
              <Link to={`/doctor/patients/${v.patients?.id}`}>
                <Button variant="ghost" size="sm">Open</Button>
              </Link>
              <a
                href={`https://wa.me/${(v.patients?.mobile ?? "").replace(/\D/g, "")}?text=${encodeURIComponent(`Dear ${v.patients?.name}, your follow-up is on ${format(parseISO(v.next_visit_date!), "dd MMM yyyy")}.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" size="sm"><MessageCircle className="size-4" /></Button>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
