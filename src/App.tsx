import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"
import Settings from "./pages/Settings";
import ConveyorInfo from "./pages/ConveyorInfo";
import Conveyor2Info from "./pages/Conveyor2Info";
import Conveyor3Info from "./pages/Conveyor3Info";
import Conveyor4Info from "./pages/Conveyor4Info";
import BagOpenerInfo from "./pages/BagOpenerInfo";
import VaglioInfo from "./pages/VaglioInfo";
import Dispositivi from "./pages/Dispositivi";

const App = () => {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register/>}/>
        <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}/>}>
        <Route path="/settings" element={<Settings/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["user, admin", "superadmin"]}/>}>
          <Route path="/conveyor" element={<ConveyorInfo/>}/>
        </Route>

       <Route element={<ProtectedRoute allowedRoles={["user, admin", "superadmin"]}/>}>
          <Route path="/conveyor2" element={<Conveyor2Info/>}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user, admin", "superadmin"]}/>}>
          <Route path="/conveyor3" element={<Conveyor3Info/>}/>
        </Route>
        
       <Route element={<ProtectedRoute allowedRoles={["user, admin", "superadmin"]}/>}>
          <Route path="/conveyor4" element={<Conveyor4Info/>}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user, admin", "superadmin"]}/>}>
          <Route path="/bagopener" element={<BagOpenerInfo/>}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}/>}>
          <Route path="/vaglio" element={<VaglioInfo/>}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={"superadmin"}/>}>
          <Route path="/dispositivi" element={<Dispositivi/>}/>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;