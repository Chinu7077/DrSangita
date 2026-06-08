import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Patient = Tables<"patients">;
export type Visit = Tables<"visits">;

export async function patientPortalLookup(
  patient_id: string,
  mobile: string
) {
  const { data: result, error } = await supabase.rpc(
    "patient_portal_lookup",
    {
      _patient_id: patient_id.trim(),
      _mobile: mobile.trim(),
    }
  );

  console.log("RPC RESULT:", result);
  console.log("RPC ERROR:", error);

  if (error) {
    throw new Error(error.message);
  }

  if (!result || !Array.isArray(result) || result.length === 0) {
    return {
      found: false as const,
    };
  }

  const patient = result[0] as Patient;

  // Fetch all visits for this patient
  const { data: visitsData, error: visitsError } = await supabase
    .from("visits")
    .select("*")
    .eq("patient_id", patient.id)
    .order("visit_date", { ascending: false });

  if (visitsError) {
    console.error("VISITS ERROR:", visitsError);
  }

  // Patient photo URL
  if (
    patient.photo_url &&
    !patient.photo_url.startsWith("http")
  ) {
    const { data } = supabase.storage
      .from("patient-photos")
      .getPublicUrl(patient.photo_url);

    patient.photo_url = data.publicUrl;
  }

  return {
    found: true as const,
    patient,
    visits: visitsData ?? [],
  };
}

export async function signPhotoUrl(
  path: string
): Promise<string | null> {
  if (!path) return null;

  if (path.startsWith("http")) {
    return path;
  }

  const { data } = await supabase.storage
    .from("patient-photos")
    .createSignedUrl(path, 60 * 60 * 24);

  return data?.signedUrl ?? null;
}

export async function verifyDoctorAccess() {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}