import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IdCard,
  Phone,
  Loader2,
  Stethoscope,
  LogOut,
  Pill,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  patientPortalLookup,
  type Patient,
  type Visit,
} from "@/lib/patient-api";
import { format, parseISO } from "date-fns";

export default function PatientPortal() {
  const [pid, setPid] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    patient: Patient;
    visits: Visit[];
  } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await patientPortalLookup(pid, mobile);
      if (!res.found) {
        toast.error("No record found. Check Patient ID and mobile.");
        setResult(null);
      } else {
        setResult({ patient: res.patient, visits: res.visits });
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  if (result)
    return (
      <PatientView
        patient={result.patient}
        visits={result.visits}
        onLogout={() => setResult(null)}
      />
    );

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-primary text-primary-foreground relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <div className="text-xl font-semibold">Dr. Sangita's Clinic</div>
        </div>
        <div>
          <h1 className="text-4xl xl:text-5xl font-bold">
            Your health, <br /> at your fingertips.
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-md">
            View your prescriptions, follow-up dates and complete visit history
            securely.
          </p>
        </div>
        <div className="text-sm text-primary-foreground/70">Patient Portal</div>
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass w-full max-w-md rounded-3xl p-8 shadow-elegant"
        >
          <h2 className="text-2xl font-semibold">Patient Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your Patient ID and registered mobile.
          </p>

          <form onSubmit={handleLookup} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Patient ID</Label>
              <div className="relative">
                <IdCard className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={pid}
                  onChange={(e) => setPid(e.target.value)}
                  required
                  placeholder="PT0010"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mobile</Label>
              <div className="relative">
                <Phone className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  placeholder="enter your mobile number "
                  className="pl-9"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-primary text-primary-foreground shadow-elegant"
            >
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              View my records
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground space-y-2">
            
            <div>
              <Link to="/" className="text-primary hover:underline">
                Back to clinic website
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PatientView({
  patient,
  visits,
  onLogout,
}: {
  patient: Patient;
  visits: Visit[];
  onLogout: () => void;
}) {
  const latest = visits[0];
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-xl overflow-hidden shadow-elegant bg-white">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-full h-full object-contain p-1"
            />
          </div>
          <span className="font-semibold">
            Dr. Sangita's Clinic — Patient Portal
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="size-4 mr-2" /> Sign out
        </Button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 flex flex-wrap gap-6"
      >
        <img
          src={
            patient.photo_url ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(patient.name)}`
          }
          alt={patient.name}
          className="size-24 rounded-2xl object-cover bg-muted"
        />
        <div className="flex-1 min-w-[240px]">
          <div className="text-xs text-muted-foreground">
            {patient.patient_id}
          </div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            {patient.gender ?? "—"} · {patient.age ?? "—"} yrs
          </div>
          <div className="text-sm mt-2">
            <Phone className="size-3 inline mr-1" /> {patient.mobile}
          </div>
        </div>
      </motion.div>

      {latest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border-l-4 border-primary"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Latest prescription
          </div>
          <h2 className="font-semibold mt-1">
            {latest.diagnosis || "Consultation"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm">
            <div>
              <Pill className="size-3 inline mr-1" /> <b>Medicines:</b>{" "}
              {latest.medicines || "—"}
            </div>
            <div>
              <b>Dosage:</b> {latest.dosage || "—"}
            </div>
            <div>
              <b>Duration:</b>{" "}
              {latest.duration_days ? `${latest.duration_days} days` : "—"}
            </div>
            <div>
              <Calendar className="size-3 inline mr-1" /> <b>Next visit:</b>{" "}
              {latest.next_visit_date
                ? format(parseISO(latest.next_visit_date), "dd MMM yyyy")
                : "—"}
            </div>
          </div>
          {latest.doctor_notes && (
            <div className="mt-3 bg-accent/40 rounded-lg p-3 text-sm">
              {latest.doctor_notes}
            </div>
          )}
        </motion.div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-3">Visit history</h2>
        <div className="space-y-3">
          {visits.length === 0 && (
            <div className="glass rounded-2xl p-6 text-muted-foreground">
              No visits recorded yet.
            </div>
          )}
          {visits.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5 relative pl-8"
            >
              <div className="absolute left-3 top-6 size-3 rounded-full bg-gradient-primary" />
              <div className="flex items-center justify-between">
                <div className="font-semibold">
                  {format(parseISO(v.visit_date), "dd MMM yyyy")}
                </div>
                <div className="text-xs text-muted-foreground">
                  Visit #{visits.length - i}
                </div>
              </div>
              <div className="text-sm mt-2">
                <b>Diagnosis:</b> {v.diagnosis || "—"}
              </div>
              <div className="text-sm">
                <b>Medicines:</b> {v.medicines || "—"}
              </div>
              {v.next_visit_date && (
                <div className="text-xs text-muted-foreground mt-1">
                  Next: {format(parseISO(v.next_visit_date), "dd MMM yyyy")}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
