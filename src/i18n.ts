import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    uz: {
      translation: {
        add: "Qo‘shish",
        room_name: "Xona nomi",
        capacity: "Sig‘im",
        no_rooms: "Xonalar yo‘q",
      },
    },
  },
  lng: "uz",
  fallbackLng: "uz",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
