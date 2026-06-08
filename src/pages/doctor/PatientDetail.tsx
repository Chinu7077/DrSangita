import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Printer, MessageCircle, Loader2, Calendar, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { signPhotoUrl } from "@/lib/patient-api";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const { data: patient } = useQuery({
    queryKey: ["patient", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("patients").select("*").eq("id", id!).single();
      if (error) throw error;
      if (data.photo_url && !data.photo_url.startsWith("http")) {
        const url = await signPhotoUrl(data.photo_url);
        if (url) data.photo_url = url;
      }
      return data;
    },
    enabled: !!id,
  });

  const { data: visits } = useQuery({
    queryKey: ["visits", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visits")
        .select("*")
        .eq("patient_id", id!)
        .order("visit_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!id,
  });

  if (!patient) return <div className="text-muted-foreground">Loading…</div>;

  const latest = visits?.[0];

  const sendWhatsApp = () => {
    if (!latest?.next_visit_date) return toast.error("No next visit date set");
    const date = format(parseISO(latest.next_visit_date), "dd MMMM yyyy");
    const text = `Dear ${patient.name},\n\nYour follow-up visit is scheduled for ${date}.\n\nPlease visit the clinic as advised.\n\nRegards,\nDr. Sangita Kumari Nayak`;
    const url = `https://wa.me/${patient.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link to="/doctor/patients" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="size-4" /> Back to patients
        </Link>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={sendWhatsApp}><MessageCircle className="size-4 mr-2" /> WhatsApp reminder</Button>
          <Link to={`/doctor/patients/${id}/print`} target="_blank">
            <Button variant="outline" size="sm"><Printer className="size-4 mr-2" /> Print prescription</Button>
          </Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 flex flex-wrap gap-6">
        <img
          src={patient.photo_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(patient.name)}`}
          alt={patient.name}
          className="size-28 rounded-2xl object-cover bg-muted"
        />
        <div className="flex-1 min-w-[240px]">
          <div className="text-xs text-muted-foreground">{patient.patient_id}</div>
          <h1 className="text-2xl font-bold">{patient.name}</h1>
          <div className="text-sm text-muted-foreground mt-1">
            {patient.gender ?? "—"} · {patient.age ?? "—"} yrs · {patient.blood_group ?? "—"}
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3 text-sm">
            <Info label="Mobile" value={patient.mobile} />
            <Info label="Alternate" value={patient.alternate_mobile} />
            <Info label="Occupation" value={patient.occupation} />
            <Info label="First visit" value={patient.first_visit_date} />
            <Info label="Address" value={patient.address} />
            <Info label="Allergies" value={patient.allergies} />
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Visit history</h2>
        <AddVisitDialog patientId={id!} onAdded={() => qc.invalidateQueries({ queryKey: ["visits", id] })} />
      </div>

      <div className="space-y-4">
        {visits?.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No visits yet. Add the first one.</div>
        )}
        {visits?.map((v, i) => (
          <motion.div
            key={v.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 relative pl-8"
          >
            <div className="absolute left-3 top-6 size-3 rounded-full bg-gradient-primary shadow-elegant" />
            <div className="absolute left-4 top-9 bottom-0 w-px bg-border" />
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Visit #{(visits.length - i)}</div>
                <div className="font-semibold flex items-center gap-2"><Calendar className="size-4" /> {format(parseISO(v.visit_date), "dd MMM yyyy")}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Next: {v.next_visit_date ? format(parseISO(v.next_visit_date), "dd MMM yyyy") : "—"}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-3 text-sm">
              <Info label="Diagnosis" value={v.diagnosis} />
              <Info label="Symptoms" value={v.symptoms} />
              <Info label="Medicines" value={v.medicines} icon={Pill} />
              <Info label="Dosage" value={v.dosage} />
              <Info label="Duration" value={v.duration_days ? `${v.duration_days} days` : null} />
            </div>
            {v.doctor_notes && (
              <div className="mt-3 text-sm bg-accent/40 rounded-lg p-3">
                <div className="text-xs uppercase text-muted-foreground mb-1">Notes</div>
                {v.doctor_notes}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        {Icon ? <Icon className="size-3" /> : null}
        {label}
      </div>
      <div className="font-medium">{value || "—"}</div>
    </div>
  );
}

function AddVisitDialog({ patientId, onAdded }: { patientId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);

  const add = useMutation({
    mutationFn: async (form: FormData) => {
      const { data: user } = await supabase.auth.getUser();
      const payload = {
        patient_id: patientId,
        visit_date: (form.get("visit_date") as string) || new Date().toISOString().slice(0, 10),
        diagnosis: form.get("diagnosis") as string,
        symptoms: form.get("symptoms") as string,
        medicines: form.get("medicines") as string,
        dosage: form.get("dosage") as string,
        duration_days: form.get("duration_days") ? Number(form.get("duration_days")) : null,
        doctor_notes: form.get("doctor_notes") as string,
        next_visit_date: (form.get("next_visit_date") as string) || null,
        created_by: user.user?.id ?? null,
      };
      const { error } = await supabase.from("visits").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Visit added");
      setOpen(false);
      onAdded();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary text-primary-foreground shadow-elegant"><Plus className="size-4 mr-2" /> Add visit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New visit</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate(new FormData(e.currentTarget));
          }}
          className="space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field name="visit_date" label="Visit date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <Field name="next_visit_date" label="Next visit" type="date" />
            <Field name="diagnosis" label="Diagnosis" />
            <Field name="duration_days" label="Duration (days)" type="number" />
          </div>
          <FieldArea name="symptoms" label="Symptoms" />
          <FieldArea name="medicines" label="Medicines" />
          <FieldArea name="dosage" label="Dosage" />
          <FieldArea name="doctor_notes" label="Doctor notes" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={add.isPending} className="bg-gradient-primary text-primary-foreground">
              {add.isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              Save visit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ name, label, type = "text", defaultValue }: { name: string; label: string; type?: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}

function FieldArea({ name, label }: { name: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} rows={2} />
    </div>
  );
}
