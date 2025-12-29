import {
  DollarSign,
  GroupIcon,
  HomeIcon,
  Landmark,
  Settings,
  User,
} from "lucide-react";

export const AdminNavLinks = [
  { title: "Home", route: "/admin/home", icon: HomeIcon },
  { title: "Groups", route: "/admin/groups", icon: GroupIcon },

  { title: "TeachersList", route: "/admin/teachers", icon: User },
  { title: "StudentsList", route: "/admin/students", icon: User },
  { title: "DebtorsList", route: "/admin/debtors", icon: DollarSign },
  { title: "Finance", route: "/admin/finance", icon: Landmark },
  { title: "Settings", route: "/admin/managers", icon: Settings },
  { title: "Settings", route: "/admin/rooms", icon: Settings },
];
