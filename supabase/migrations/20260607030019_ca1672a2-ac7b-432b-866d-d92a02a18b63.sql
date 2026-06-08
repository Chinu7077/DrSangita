
-- Roles
CREATE TYPE public.app_role AS ENUM ('doctor', 'patient');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Patient ID sequence
CREATE SEQUENCE public.patient_id_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_patient_id()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  next_val INT;
BEGIN
  next_val := nextval('public.patient_id_seq');
  RETURN 'HOM-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(next_val::TEXT, 4, '0');
END;
$$;

-- Patients
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id TEXT NOT NULL UNIQUE DEFAULT public.generate_patient_id(),
  photo_url TEXT,
  name TEXT NOT NULL,
  father_husband_name TEXT,
  gender TEXT,
  dob DATE,
  age INT,
  mobile TEXT NOT NULL,
  alternate_mobile TEXT,
  address TEXT,
  occupation TEXT,
  blood_group TEXT,
  weight NUMERIC,
  height NUMERIC,
  allergies TEXT,
  first_visit_date DATE DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patients TO authenticated;
GRANT ALL ON public.patients TO service_role;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage patients" ON public.patients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'))
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE INDEX patients_name_idx ON public.patients (lower(name));
CREATE INDEX patients_mobile_idx ON public.patients (mobile);

-- Visits
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnosis TEXT,
  symptoms TEXT,
  medicines TEXT,
  dosage TEXT,
  duration_days INT,
  doctor_notes TEXT,
  next_visit_date DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visits TO authenticated;
GRANT ALL ON public.visits TO service_role;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage visits" ON public.visits FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'doctor'))
  WITH CHECK (public.has_role(auth.uid(), 'doctor'));

CREATE INDEX visits_patient_idx ON public.visits (patient_id, visit_date DESC);
CREATE INDEX visits_next_visit_idx ON public.visits (next_visit_date);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER patients_touch BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Storage policies for patient-photos bucket (public read, doctor write)
CREATE POLICY "Public read patient photos" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'patient-photos');
CREATE POLICY "Doctors upload patient photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'patient-photos' AND public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Doctors update patient photos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'patient-photos' AND public.has_role(auth.uid(), 'doctor'));
CREATE POLICY "Doctors delete patient photos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'patient-photos' AND public.has_role(auth.uid(), 'doctor'));

-- Public patient lookup function (Patient Portal): returns patient + visits
-- Security definer so it bypasses RLS; explicit mobile match acts as the auth.
CREATE OR REPLACE FUNCTION public.patient_portal_lookup(_patient_id TEXT, _mobile TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  p RECORD;
  vs JSONB;
BEGIN
  SELECT * INTO p FROM public.patients WHERE patient_id = _patient_id AND mobile = _mobile;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT COALESCE(jsonb_agg(v ORDER BY v.visit_date DESC), '[]'::jsonb) INTO vs
    FROM (SELECT * FROM public.visits WHERE patient_id = p.id ORDER BY visit_date DESC) v;
  RETURN jsonb_build_object('patient', to_jsonb(p), 'visits', vs);
END;
$$;

GRANT EXECUTE ON FUNCTION public.patient_portal_lookup(TEXT, TEXT) TO anon, authenticated;
