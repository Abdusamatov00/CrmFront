import { create } from "zustand";

interface UserState {
  id: number | null;
  ism: string;
  gmail: string;
  role: string;

  setUser: (user: {
    id: number;
    ism: string;
    gmail: string;
    role: string;
  }) => void;

  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  ism: "",
  gmail: "",
  role: "",

  setUser: (user) =>
    set(() => ({
      id: user.id,
      ism: user.ism,
      gmail: user.gmail,
      role: user.role,
    })),

  clearUser: () =>
    set(() => ({
      id: null,
      ism: "",
      gmail: "",
      role: "",
    })),
}));
