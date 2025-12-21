// components/layout/admin.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../shared/sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-bold text-lg">Dashboard CRM</h1>
        </div>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
