import { Outlet } from "react-router-dom";
import { DoctorShell } from "@/components/DoctorShell";

export default function DoctorLayout() {
  return (
    <DoctorShell>
      <Outlet />
    </DoctorShell>
  );
}
