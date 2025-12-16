import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./feature/login/login";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<Navigate to={"/login"} />} />
        <Route
          path="/admin"
          element={
            <div>
              Navbar <Outlet />
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
