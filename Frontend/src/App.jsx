import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import StartBusiness from "./pages/StartBusiness";
import AIChat from "./pages/AIChat";
import Manufacturers from "./pages/Manufacturers";
import Contact from "./pages/Contact";
import About from "./pages/About";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/start-business" element={<ProtectedRoute><StartBusiness /></ProtectedRoute>} />
      <Route path="/aichat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/manufacturers" element={<ProtectedRoute><Manufacturers /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
      
    </Routes>
  );
}

export default App;