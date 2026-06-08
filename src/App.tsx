import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { DoctorRoute } from "@/components/DoctorRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorLogin from "./pages/DoctorLogin";
import PatientPortal from "./pages/PatientPortal";
import DoctorLayout from "./pages/doctor/DoctorLayout";
import Dashboard from "./pages/doctor/Dashboard";
import PatientsList from "./pages/doctor/PatientsList";
import NewPatient from "./pages/doctor/NewPatient";
import PatientDetail from "./pages/doctor/PatientDetail";
import PrintPrescription from "./pages/doctor/PrintPrescription";
import FollowUps from "./pages/doctor/FollowUps";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/doctor/login" element={<DoctorLogin />} />
            <Route path="/patient-portal" element={<PatientPortal />} />
            <Route path="/doctor" element={<DoctorRoute />}>
              <Route path="patients/:id/print" element={<PrintPrescription />} />
              <Route element={<DoctorLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="patients" element={<PatientsList />} />
                <Route path="patients/new" element={<NewPatient />} />
                <Route path="patients/:id" element={<PatientDetail />} />
                <Route path="follow-ups" element={<FollowUps />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
