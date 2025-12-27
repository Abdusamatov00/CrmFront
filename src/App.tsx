// src/App.tsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";
import { Toaster } from "./components/ui/sonner";

// Manager komponentlari (agar kerak bo'lsa)
import CreateManager from "./feature/manager/create-manegars";
import StudentsList from "./feature/students/studentsList";
import CreateStudent from "./feature/students/createStudents";
import EditStudent from "./feature/students/editStudents";
import GroupList from "./feature/group/group-list";
import GroupHistory from "./feature/group/group-history";
import RoomsList from "./feature/rooms/Rooms-list";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<MoliyaviyDashboard />} />

          <Route path="home" element={<MoliyaviyDashboard />} />

          <Route path="managers">
            <Route index element={<CreateManager />} />{" "}
            {/* ro‘yxat yoki yaratish */}
          </Route>
          <Route>
            <Route path="groups" element={<GroupList />} />
            <Route path="arxiv" element={<GroupHistory />} />
          </Route>
          <Route>
            <Route path="rooms" element={<RoomsList />} />
          </Route>
          <Route path="students">
            <Route index element={<StudentsList />} />

            <Route path="create" element={<CreateStudent />} />

            <Route path="edit/:studentId" element={<EditStudent />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default App;
