import {  Outlet, Route, Routes } from "react-router-dom";
import MoliyaviyDashboard from "./components/finance/finances";

const App = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="/login" element="login" />
        <Route path="/*" element={<Navigate to={"/login"} />} /> */}
      
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
      <MoliyaviyDashboard/>
    </div>
  );
};

export default App;
