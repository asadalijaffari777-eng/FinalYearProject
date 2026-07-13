import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../Services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, userRes] = await Promise.all([
          API.get("/admin/stats"),
          API.get("/dashboard")
        ]);
        setStats(statsRes.data);
        setUser(userRes.data.user);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await API.post("/logout", {}, { withCredentials: true });
      navigate("/");
    } catch {
      alert("Logout failed");
    } finally {
      localStorage.removeItem("token");
      setShowLogoutModal(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div className="loader" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, link: "/admin/users", icon: "👥" },
    { label: "Manufacturers", value: stats?.totalManufacturers || 0, link: "/admin/manufacturers", icon: "🏭" },
    { label: "Total Items", value: stats?.totalItems || 0, link: "/admin/items", icon: "📦" },
  ];

  return (
    <div className="admin-page">
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      <motion.header className="admin-header" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="admin-header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="logo">Admin Panel</span>
        </div>
        <div className="header-actions">
          <div className="user-badge">Hi, {user?.username || "Admin"}</div>
          <motion.button className="logout-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowLogoutModal(true)}>Logout</motion.button>
        </div>
      </motion.header>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <motion.aside className="sidebar" initial={false} animate={{ x: sidebarOpen ? 0 : -300 }} transition={{ type: "spring", stiffness: 120, damping: 20 }}>
        <div className="sidebar-top">
          <h3>Admin</h3>
          <button onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <nav>
          <NavLink to="/admin" onClick={() => setSidebarOpen(false)}>Dashboard</NavLink>
          <NavLink to="/admin/users" onClick={() => setSidebarOpen(false)}>Users</NavLink>
          <NavLink to="/admin/manufacturers" onClick={() => setSidebarOpen(false)}>Manufacturers</NavLink>
          <NavLink to="/admin/items" onClick={() => setSidebarOpen(false)}>Items</NavLink>
          <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)}>Back to Site</NavLink>
        </nav>
      </motion.aside>

      <div className="admin-layout">
        <main className="admin-content">
          <motion.div className="admin-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Admin Dashboard</h1>
            <p>Manage your platform from one place</p>
          </motion.div>

          <div className="stats-grid">
            {statCards.map((card, i) => (
                <motion.div key={card.label} className={`stat-card ${i === 0 ? "blue" : i === 1 ? "purple" : "amber"}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, scale: 1.02 }} onClick={() => navigate(card.link)}>
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-value">{card.value}</div>
                <div className="stat-label">{card.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-grid">
              <motion.div className="action-card" whileHover={{ y: -5 }} onClick={() => navigate("/admin/users")}>
                <h4>Manage Users</h4>
                <p>View and manage registered users</p>
              </motion.div>
              <motion.div className="action-card" whileHover={{ y: -5 }} onClick={() => navigate("/admin/manufacturers")}>
                <h4>Manage Manufacturers</h4>
                <p>Add, edit, or remove manufacturers</p>
              </motion.div>
              <motion.div className="action-card" whileHover={{ y: -5 }} onClick={() => navigate("/admin/items")}>
                <h4>Manage Items</h4>
                <p>Add, edit, or remove product items</p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button className="cancelBtn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="danger" onClick={handleLogout}>Logout</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
