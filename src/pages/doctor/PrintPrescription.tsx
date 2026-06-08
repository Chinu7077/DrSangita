import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signPhotoUrl } from "@/lib/patient-api";
import { format, parseISO } from "date-fns";

export default function PrintPrescription() {
  const { id } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["print", id],
    queryFn: async () => {
      const { data: p } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id!)
        .single();

      if (p?.photo_url && !p.photo_url.startsWith("http")) {
        const url = await signPhotoUrl(p.photo_url);
        if (url) p.photo_url = url;
      }

      const { data: v } = await supabase
        .from("visits")
        .select("*")
        .eq("patient_id", id!)
        .order("visit_date", { ascending: false })
        .limit(1);

      return {
        patient: p,
        visit: v?.[0],
      };
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 300);
    }
  }, [data]);

  if (!data?.patient) {
    return <div className="p-8">Loading...</div>;
  }

  const { patient, visit } = data;

  return (
    <div className="bg-white text-black w-full max-w-[190mm] min-h-[277mm] mx-auto p-4">
      <style>{`
  @page {
    size: A4;
    margin: 10mm;
  }

  @media print {
    html,
body {
  margin: 0;
  padding: 0;
  background: white;
}

    .no-print {
      display: none !important;
    }
  }
`}</style>

      {/* Header */}
      <div className="border-b-2 border-emerald-700 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/HLOGO.png"
              alt="Clinic Logo"
              className="w-20 h-20 object-contain"
            />

            <div>
              <h1 className="text-2xl font-bold text-emerald-800 leading-tight">
                Dr. Sangita Kumari Nayak
              </h1>

              <p className="mt-2 text-gray-600 text-sm">
                Healing takes time. Trust the process and stay positive.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="font-semibold text-lg">BHMS</div>

            <div className="text-sm text-gray-700">Homeopathy Specialist</div>

            <div className="text-sm font-medium text-emerald-700">
              BHMS • Lic. # C/5048
            </div>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="grid grid-cols-2 gap-4 mt-8 text-sm">
        <div>
          <span className="font-semibold">Patient:</span> {patient.name}
        </div>

        <div>
          <span className="font-semibold">ID:</span> {patient.patient_id}
        </div>

        <div>
          <span className="font-semibold">Age/Sex:</span> {patient.age ?? "—"} /{" "}
          {patient.gender ?? "—"}
        </div>

        <div>
          <span className="font-semibold">Mobile:</span> {patient.mobile || "—"}
        </div>

        <div className="col-span-2">
          <span className="font-semibold">Date:</span>{" "}
          {visit?.visit_date
            ? format(parseISO(visit.visit_date), "dd MMM yyyy")
            : format(new Date(), "dd MMM yyyy")}
        </div>
      </div>

      {/* Diagnosis */}
      {visit?.diagnosis && (
        <Section label="Diagnosis" value={visit.diagnosis} />
      )}

      {/* Symptoms */}
      {visit?.symptoms && <Section label="Symptoms" value={visit.symptoms} />}

      {/* Prescription */}
      <div className="mt-8">
        <div className="text-5xl font-serif text-emerald-700 mb-4">℞</div>

        <div className="border-l-4 border-emerald-700 pl-5 space-y-3 text-sm">
          <div>
            <span className="font-semibold">Medicines:</span>{" "}
            {visit?.medicines || "—"}
          </div>

          <div>
            <span className="font-semibold">Dosage:</span>{" "}
            {visit?.dosage || "—"}
          </div>

          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {visit?.duration_days ? `${visit.duration_days} days` : "—"}
          </div>
        </div>
      </div>

      {/* Advice */}
      {visit?.doctor_notes && (
        <Section label="Advice" value={visit.doctor_notes} />
      )}

      {/* Next Visit */}
      {visit?.next_visit_date && (
        <div className="mt-6 text-sm">
          <span className="font-semibold">Next Visit:</span>{" "}
          {format(parseISO(visit.next_visit_date), "dd MMM yyyy")}
        </div>
      )}

      {/* Signature */}
      <div className="mt-24 flex justify-end">
        <div className="text-center">
          <img
            src="/signature.png"
            alt="Doctor Signature"
            className="h-12 mx-auto object-contain mb-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />

          <div className="border-t border-black w-60 pt-2">
            <div className="font-semibold">Dr. Sangita Kumari Nayak, BHMS</div>

            <div className="text-xs">Homeopathy Specialist</div>

            <div className="text-xs">Lic. # C/5048</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-3 text-center text-[11px] text-gray-500">
        <div>Dr. Sangita Kumari Nayak, BHMS • Lic. # C/5048</div>

        <div className="mt-1">
          This is a homeopathic prescription. Consult your doctor before
          discontinuing any treatment.
        </div>
      </div>

      {/* Print Button */}
      <div className="no-print mt-8 text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          Print Again
        </button>
      </div>
    </div>
  );
}

function Section({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="mt-5 text-sm">
      <div className="font-semibold mb-1">{label}:</div>

      <div className="whitespace-pre-wrap">{value}</div>
    </div>
  );
}
