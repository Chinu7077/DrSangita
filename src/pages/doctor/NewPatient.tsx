import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Loader2, UserPlus, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().min(2).max(120),
  father_husband_name: z.string().max(120).optional().or(z.literal("")),
  gender: z.string().optional(),
  dob: z.string().optional(),
  age: z.coerce.number().int().min(0).max(150).optional(),
  mobile: z.string().min(6).max(20),
  alternate_mobile: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(500).optional().or(z.literal("")),
  occupation: z.string().max(120).optional().or(z.literal("")),
  blood_group: z.string().max(8).optional().or(z.literal("")),
  weight: z.coerce.number().min(0).max(500).optional(),
  height: z.coerce.number().min(0).max(300).optional(),
  allergies: z.string().max(500).optional().or(z.literal("")),
  first_visit_date: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export default function NewPatient() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { first_visit_date: new Date().toISOString().slice(0, 10) },
  });

  const onSubmit = async (values: Form) => {
    setSubmitting(true);
    try {
      let photo_path: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("patient-photos").upload(path, photoFile, {
          contentType: photoFile.type,
        });
        if (upErr) throw upErr;
        photo_path = path;
      }

      const { data: user } = await supabase.auth.getUser();
      const insert = {
        ...values,
        father_husband_name: values.father_husband_name || null,
        alternate_mobile: values.alternate_mobile || null,
        address: values.address || null,
        occupation: values.occupation || null,
        blood_group: values.blood_group || null,
        allergies: values.allergies || null,
        dob: values.dob || null,
        first_visit_date: values.first_visit_date || null,
        photo_url: photo_path,
        created_by: user.user?.id ?? null,
      };

      const { data, error } = await supabase.from("patients").insert(insert).select("id, patient_id").single();
      if (error) throw error;
      toast.success(`Patient created: ${data.patient_id}`);
      navigate(`/doctor/patients/${data.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoto = (file: File | null) => {
    setPhotoFile(file);
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Patient</h1>
        <p className="text-muted-foreground">A new Patient ID will be auto-generated.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="glass rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-24 rounded-2xl bg-muted overflow-hidden grid place-items-center border">
            {preview ? <img src={preview} alt="" className="size-full object-cover" /> : <UserPlus className="size-8 text-muted-foreground" />}
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
            />
            <Button type="button" variant="outline" asChild>
              <span><Upload className="size-4 mr-2" /> Upload photo</span>
            </Button>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </Field>
          <Field label="Father / Husband name">
            <Input {...form.register("father_husband_name")} />
          </Field>
          <Field label="Gender">
            <Select onValueChange={(v) => form.setValue("gender", v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Date of birth">
            <Input type="date" {...form.register("dob")} />
          </Field>
          <Field label="Age">
            <Input type="number" {...form.register("age")} />
          </Field>
          <Field label="Mobile" error={form.formState.errors.mobile?.message}>
            <Input {...form.register("mobile")} />
          </Field>
          <Field label="Alternate mobile">
            <Input {...form.register("alternate_mobile")} />
          </Field>
          <Field label="Occupation">
            <Input {...form.register("occupation")} />
          </Field>
          <Field label="Blood group">
            <Input {...form.register("blood_group")} placeholder="A+, B+, O-..." />
          </Field>
          <Field label="First visit date">
            <Input type="date" {...form.register("first_visit_date")} />
          </Field>
          <Field label="Weight (kg)">
            <Input type="number" step="0.1" {...form.register("weight")} />
          </Field>
          <Field label="Height (cm)">
            <Input type="number" step="0.1" {...form.register("height")} />
          </Field>
        </div>

        <Field label="Address">
          <Textarea rows={2} {...form.register("address")} />
        </Field>
        <Field label="Allergies">
          <Textarea rows={2} {...form.register("allergies")} />
        </Field>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate("/doctor/patients")}>Cancel</Button>
          <Button type="submit" disabled={submitting} className="bg-gradient-primary text-primary-foreground shadow-elegant">
            {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
            Create patient
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <div className="text-xs text-destructive">{error}</div>}
    </div>
  );
}
