import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<MoliyaviyDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
