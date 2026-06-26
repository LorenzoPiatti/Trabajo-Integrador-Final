import { Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/Login";
import RegisterPage from "./modules/auth/pages/Register";
import VerifyEmail from "./modules/auth/pages/VerifyEmail";
import ForgotPassword from "./modules/auth/pages/ForgotPassword";
import ResetPassword from "./modules/auth/pages/ResetPassword";

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
    </Routes>
  );
}

export default App;