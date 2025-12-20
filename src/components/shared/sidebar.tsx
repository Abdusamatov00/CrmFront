import { AdminNavLinks } from "@/constants";
import { Link } from "react-router-dom";
import pnj from "../../assets/logo.png";
import { User } from "lucide-react";

const Sidebar = () => {
  const user = {
    name: "Dilshod Abdusamatov",
    role: "Admin",
  };

  return (
    <div className="bg-blue-600 max-w-[320px] min-h-screen md:relative fixed w-full">
      <header className="p-3 text-white space-y-6">
        <div className="flex hover:bg-black/10 rounded-md p-2 cursor-pointer items-center gap-2">
          <img className="w-14 " src={pnj} alt="Crm logo" />
          <span className="font-semibold ml-[-14px]">Dilshod Crm</span>
        </div>

        <nav className="flex flex-col gap-1">
          {AdminNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}  
                to={item.route}
                className="flex items-center h-12 gap-2 m-[10px] px-3 py-2 rounded-md
                           hover:bg-black/15 transition"
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="w-full border-t absolute bottom-0 h-20 ml-[-10px] border-white/20 flex items-center px-3 gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div className="flex flex-col text-white text-sm">
            <span className="font-semibold">{user.name}</span>
            <span className="text-white/70">{user.role}</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Sidebar;
