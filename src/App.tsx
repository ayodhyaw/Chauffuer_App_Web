import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import Login from "./pages/Login/Login";
import Vehicle from "./pages/Vehicle/vehicle";
import AutoHeightOverlayNoSnap from "./pages/Vehicle/v";
import Chauffuer from "./pages/Chauffuer/chauffuer";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />  
      <Route path="/v" element={<Vehicle/>} /> 
      <Route path="/c" element={<Chauffuer/>} /> 
      <Route path="/vj" element={<AutoHeightOverlayNoSnap/>} /> 
        <Route path="/" element={<MainLayout />}>
          {routes}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
