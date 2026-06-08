import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  delay = 0,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delay?: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={`glass rounded-2xl p-5 flex items-center gap-4 ${accent ? "shadow-elegant" : ""}`}
    >
      <div className={`size-12 rounded-xl grid place-items-center ${accent ? "bg-gradient-primary" : "bg-accent"}`}>
        <Icon className={`size-6 ${accent ? "text-primary-foreground" : "text-accent-foreground"}`} />
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
      </div>
    </motion.div>
  );
}
