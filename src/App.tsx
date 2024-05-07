import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import Login from "./pages/Login/Login";
import UpdateProfile from "./pages/Profile/updateProfile";
import ChauffuerImageUpload from "./pages/Chauffuer/chauffuerImageUpload";
import V from "./pages/Vehicle/v";
import VehicleType from "./pages/VehicleType/vehicleType";
import CU from "./pages/companyUser/cu";
import ChauffuerV from "./pages/chauffuerVehicle/chauffuerVehicle";
import SingnUp from "./pages/SignUp/signUp";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" index element={<SingnUp />} />
      <Route path="/login" index element={<Login />} />
      <Route path="/b" index element={<ChauffuerV />} /> 
      <Route path="/z" index element={<CU/>} /> 
      <Route path="/v" element={<ChauffuerImageUpload/>} /> 
      <Route path="/c" element={<UpdateProfile/>} />     
      <Route path="/f" element={<VehicleType/>} />    
      <Route path="/" element={<MainLayout />}>
          {routes}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
