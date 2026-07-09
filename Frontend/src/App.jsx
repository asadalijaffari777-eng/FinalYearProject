import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminRoute from "./component/AdminRoute";
import StartBusiness from "./pages/StartBusiness";
import AIChat from "./pages/AIChat";
import Manufacturers from "./pages/Manufacturers";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminManufacturers from "./pages/AdminManufacturers";
import AdminItems from "./pages/AdminItems";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/start-business" element={<StartBusiness />} />
        <Route path="/aichat" element={<AIChat />} />
        <Route path="/manufacturers" element={<Manufacturers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/manufacturers" element={<AdminManufacturers />} />
          <Route path="/admin/items" element={<AdminItems />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
