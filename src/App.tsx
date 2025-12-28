// src/App.tsx
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";
import { Toaster } from "./components/ui/sonner";

// Manager
import CreateManager from "./feature/manager/create-manegars";

// Students
import StudentsList from "./feature/students/studentsList";
import EditStudent from "./feature/students/editStudents";

// Groups
import GroupList from "./feature/group/group-list";
import GroupHistory from "./feature/group/group-history";

// Teachers
import TeacherList from "./feature/teachers/teacher-list";

// Enrollments (YANGI)
import EnrollmentsPage from "./feature/enrollments/EnrollmentsPage";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN LAYOUT */}
        <Route path="/admin" element={<Admin />}>
          {/* Dashboard */}
          <Route index element={<MoliyaviyDashboard />} />
          <Route path="home" element={<MoliyaviyDashboard />} />

          {/* Managers */}
          <Route path="managers">
            <Route index element={<CreateManager />} />
          </Route>

          {/* Groups */}
          <Route>
            <Route path="groups" element={<GroupList />} />
            <Route path="arxiv" element={<GroupHistory />} />
          </Route>

          {/* Students */}
          <Route path="students">
            <Route index element={<StudentsList />} />
            <Route path="edit/:studentId" element={<EditStudent />} />
          </Route>

          {/* Teachers */}
          <Route path="teachers">
            <Route index element={<Navigate to="/admin/teachers/list" replace />} />
            <Route path="list" element={<TeacherList />} />
          </Route>

          {/* 🔥 YANGI: ENROLLMENTS */}
          <Route path="enrollments">
            <Route index element={<EnrollmentsPage to="/admin/enrollments" />} />
            <Route path="list" element={<EnrollmentsPage />} />
          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};

export default App;
