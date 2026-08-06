import { Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/Login";
import RegisterPage from "./modules/auth/pages/Register";
import VerifyEmail from "./modules/auth/pages/VerifyEmail";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import ResetPassword from "./modules/auth/pages/ResetPassword";
import Dashboard from "./modules/dashboard/pages/Dashboard";
import PetsPage from "./modules/pets/pages/Pets";
import AppointmentsPage from "./modules/appointments/pages/Appointments";
import MedicalRecords from "./modules/medical-records/pages/MedicalRecords";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/register"
        element={<RegisterPage />}
      />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pets" element={<PetsPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/medical-records" element={<MedicalRecords />} />
    </Routes>
  );
}

export default App;
