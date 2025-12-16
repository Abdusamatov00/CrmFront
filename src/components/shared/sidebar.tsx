import { AdminNavLinks } from "@/constants";
import { Link } from "react-router-dom";
import pnj from "../../assets/logo.png";
const Sidebar = () => {
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

        <div className="w-full border-t absolute bottom-0 h-14 ml-[-10px] border-white/20 pt-3 text-sm">
          user details
        </div>
      </header>
    </div>
  );
};

export default Sidebar;
