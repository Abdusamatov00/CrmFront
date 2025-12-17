import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";
import Sidebar from "./components/shared/sidebar";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Navigate to={"/login"} />} />
        <Route
          path="/admin"
          element={
            <div className="w-full flex">
              <Sidebar />
              <Outlet />
            </div>
          }
        >
          <Route path="home" element="home" />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
