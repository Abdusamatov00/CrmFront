import { AdminNavLinks } from "@/constants";
import { Link } from "react-router-dom";
import pnj from "../../assets/logo.png";
import { User, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const Sidebar = ({ open, onClose }: Props) => {
  const user = {
    name: "Dilshod Abdusamatov",
    role: "Admin",
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40
          transition-opacity
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
          lg:hidden
        `}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-full w-64 bg-blue-600
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        <div className="p-4 text-white flex flex-col h-full w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img className="w-10" src={pnj} alt="CRM" />
              <span className="font-semibold">Dilshod CRM</span>
            </div>

            <button onClick={onClose} className="lg:hidden">
              <X size={22} />
            </button>
          </div>

          <nav className="flex flex-col gap-1 flex-1">
            {AdminNavLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.route}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-black/15"
                >
                  <Icon size={20} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/20 pt-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-white/70">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
