import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import MoliyaviyDashboard from "./components/finance/finances";
import Admin from "./components/layout/admin";
import { Toaster } from "./components/ui/sonner";

import CreateManager from "./feature/manager/create-manegars";
import ManagersList from "./feature/manager/managerList";

// Students
import StudentsList from "./feature/students/studentsList";
import EditStudent from "./feature/students/editStudents";
import GroupList from "./feature/group/group-list";
import GroupHistory from "./feature/group/group-history";
import RoomsList from "./feature/rooms/Rooms-list";
import TeacherList from "./feature/teachers/teacher-list";
import EditManager from "./feature/manager/editManager";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN */}
        <Route path="/admin" element={<Admin />}>
          {/* DASHBOARD */}
          <Route index element={<MoliyaviyDashboard />} />
          <Route path="home" element={<MoliyaviyDashboard />} />

          {/* MANAGERS */}
          <Route path="managers">
            <Route index element={<ManagersList />} />

            {/* CREATE */}
            <Route path="create" element={<CreateManager />} />

            {/* EDIT */}
            <Route path="edit/:id" element={<EditManager />} />
          </Route>

          {/* GROUPS */}
          <Route path="groups" element={<GroupList />} />
          <Route path="arxiv" element={<GroupHistory />} />

          {/* ROOMS */}
          <Route path="rooms" element={<RoomsList />} />

          {/* STUDENTS */}
          <Route path="students">
            <Route index element={<StudentsList />} />
            <Route path="edit/:studentId" element={<EditStudent />} />
          </Route>

          {/* TEACHERS */}
          <Route path="teachers">
            <Route
              index
              element={<Navigate to="/admin/teachers/list" replace />}
            />
            <Route path="list" element={<TeacherList />} />
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
