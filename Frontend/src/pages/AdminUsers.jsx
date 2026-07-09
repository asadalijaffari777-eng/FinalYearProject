import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../Services/api";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async (query = "") => {
    try {
      setLoading(true);
      const params = query ? `?search=${query}` : "";
      const res = await API.get(`/admin/users${params}`);
      setUsers(res.data);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      <motion.header className="au-header" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="au-header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="logo">Admin Panel</span>
        </div>
        <div className="au-badge">Users</div>
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

      <div className="au-layout">
        <main className="au-content">
          <motion.div className="au-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Users</h1>
            <p>Manage registered users</p>
          </motion.div>

          <form className="au-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {loading ? (
            <p className="au-loading">Loading...</p>
          ) : users.length === 0 ? (
            <p className="au-loading">No users found.</p>
          ) : (
            <div className="au-list">
              {users.map((user, i) => (
                <motion.div key={user._id} className="au-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="au-user-info">
                    <div className="au-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                    <div>
                      <div className="au-name">{user.username}</div>
                      <div className="au-email">{user.email}</div>
                    </div>
                  </div>
                  <div className="au-meta">
                    <span className={`au-role ${user.role}`}>{user.role}</span>
                    <span className={`au-status ${user.isVerified ? "verified" : "unverified"}`}>{user.isVerified ? "Verified" : "Unverified"}</span>
                    <span className="au-provider">{user.authProvider}</span>
                    <span className="au-date">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
                    <button className="au-delete-btn" onClick={() => setDeleteTarget(user)}>Delete</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3>Delete User</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget.username}</strong>?</p>
            <div className="modal-buttons">
              <button className="cancelBtn" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="danger" onClick={handleDelete}>Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
