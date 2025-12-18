import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<MoliyaviyDashboard />} />
          <Route path="home" element={<MoliyaviyDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
