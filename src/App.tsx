import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { routes } from "./routes";
import Login from "./pages/Login/Login";
import Vehicle from "./pages/Vehicle/vehicle";
import Chauffuer from "./pages/Chauffuer/chauffuer";
import Company from "./pages/Company/company";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" index element={<Login />} />  
      <Route path="/v" element={<Vehicle/>} /> 
      <Route path="/c" element={<Company/>} />    
      <Route path="/" element={<MainLayout />}>
          {routes}
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
