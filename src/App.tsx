import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"
import Settings from "./pages/Settings";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;