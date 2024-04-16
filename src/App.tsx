import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import Login from "./pages/Login/Login";
import Company from "./pages/Company/company";
import Amenity from "./pages/Aminity/aminity";
import DocumentType from "./pages/DocumentType/doumentType";
import UpdateProfile from "./pages/Profile/updateProfile";
import C from "./pages/Chauffuer/c";
import ChauffuerImageUpload from "./pages/Chauffuer/chauffuerImageUpload";
import V from "./pages/Vehicle/v";
import Brand from "./pages/Brand/brand";
import Region from "./pages/Region/region";
import VehicleType from "./pages/VehicleType/vehicleType";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" index element={<Login />} />
      <Route path="/b" index element={<V />} /> 
      <Route path="/z" index element={<C />} /> 
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
