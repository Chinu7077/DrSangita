import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { verifyDoctorAccess } from "@/lib/patient-api";

export function DoctorRoute() {
  const [status, setStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");
  const location = useLocation();

  useEffect(() => {
    let active = true;
    verifyDoctorAccess().then((user) => {
      if (!active) return;
      setStatus(user ? "authorized" : "unauthorized");
    });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/doctor/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
