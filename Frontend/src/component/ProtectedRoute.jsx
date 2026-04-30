import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../Services/api";

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); 
  // loading | auth | no-auth

useEffect(() => {
  const verify = async () => {
    try {
      await API.get("/dashboard");
      setStatus("auth");
    } catch {
      setStatus("no-auth");
    }
  };

  verify();
}, [location.pathname]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "no-auth") return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;