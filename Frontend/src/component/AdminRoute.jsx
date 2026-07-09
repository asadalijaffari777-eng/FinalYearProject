import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../Services/api";

function AdminRoute() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      try {
        await API.get("/admin/stats");
        if (mounted) setStatus("auth");
      } catch {
        if (mounted) setStatus("no-auth");
      }
    };
    verify();
    return () => { mounted = false; };
  }, []);

  if (status === "loading") return <div className="loading-screen" style={{background: '#020617', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>Loading...</div>;

  if (status === "no-auth") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

export default AdminRoute;
