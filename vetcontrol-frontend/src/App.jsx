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
import Reminders from "./modules/reminder/pages/Reminders";
import Vaccines from "./modules/vaccines/pages/Vaccines";
import Profile from "./modules/profile/pages/Profile";
import UsersPage from "./modules/users/pages/Users";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  const protect = (element, roles) => (
    <ProtectedRoute roles={roles}>
      {element}
    </ProtectedRoute>
  );

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
      <Route
        path="/dashboard"
        element={
          protect(
            <Dashboard />,
            ["Owner", "Veterinarian", "Reception", "Admin"]
          )
        }
      />
      <Route
        path="/pets"
        element={protect(<PetsPage />, ["Owner"])}
      />
      <Route
        path="/appointments"
        element={
          protect(
            <AppointmentsPage />,
            ["Owner", "Veterinarian", "Reception"]
          )
        }
      />
      <Route
        path="/vaccines"
        element={protect(<Vaccines />, ["Owner", "Admin"])}
      />
      <Route
        path="/medical-records"
        element={
          protect(
            <MedicalRecords />,
            ["Owner", "Veterinarian"]
          )
        }
      />
      <Route
        path="/reminders"
        element={protect(<Reminders />, ["Owner"])}
      />
      <Route
        path="/profile"
        element={
          protect(
            <Profile />,
            ["Owner", "Veterinarian", "Reception", "Admin"]
          )
        }
      />
      <Route
        path="/users"
        element={protect(<UsersPage />, ["Admin"])}
      />
    </Routes>
  );
}

export default App;
