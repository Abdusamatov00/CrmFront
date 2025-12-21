// App.tsx
import {  Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";
import StudentsList from "./components/futured/students/studentsList";
import CreateStudent from "./components/futured/students/createStudents";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<Admin />}>
        <Route index element={<MoliyaviyDashboard />} />
        <Route path="home" element={<MoliyaviyDashboard />} />
        <Route path="students" element={<StudentsList/>}/>
        <Route path="create" element={<CreateStudent />} />
      </Route>
      {/* <Route path="/" element={<Navigate to="/admin/home" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  );
};

export default App;