
ALTER FUNCTION public.generate_patient_id() SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.patient_portal_lookup(TEXT, TEXT) FROM authenticated, public;
-- Keep anon execute so the public patient portal works without login.
