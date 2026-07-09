import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Services/api";
import "./AdminItems.css";

const emptyForm = {
  name: "",
  category: "caps",
  image: ""
};

const categoryOptions = [
  { value: "caps", label: "Caps" },
  { value: "upper-summer", label: "Upper Summer" },
  { value: "upper-winter", label: "Upper Winter" },
  { value: "lower", label: "Lower" }
];

function AdminItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/items");
      setItems(res.data);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({
      name: item.name || "",
      category: item.category || "caps",
      image: item.image || ""
    });
    setEditing(item._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      return alert("Name and category are required");
    }

    try {
      if (editing) {
        await API.put(`/admin/items/${editing}`, form);
      } else {
        await API.post("/admin/items", form);
      }
      setShowForm(false);
      fetchItems();
    } catch (err) {
      alert("Failed to save item");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/items/${deleteTarget._id}`);
      setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
    } catch {
      alert("Failed to delete item");
    } finally {
      setDeleteTarget(null);
    }
  };

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="admin-items-page">
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      <motion.header className="ai-header" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="ai-header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="logo">Admin Panel</span>
        </div>
        <div className="ai-badge">Items</div>
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

      <div className="ai-layout">
        <main className="ai-content">
          <motion.div className="ai-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1>Items</h1>
              <p>Manage product items used in business setup</p>
            </div>
            <motion.button className="ai-add-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}>
              + Add Item
            </motion.button>
          </motion.div>

          {loading ? (
            <p className="ai-loading">Loading...</p>
          ) : items.length === 0 ? (
            <p className="ai-loading">No items found. Seed them first.</p>
          ) : (
            Object.entries(grouped).map(([category, catItems]) => (
              <section key={category} className="ai-section">
                <div className="ai-section-head">
                  <h3>{categoryOptions.find((o) => o.value === category)?.label || category}</h3>
                  <span>{catItems.length} items</span>
                </div>
                <div className="ai-grid">
                  {catItems.map((item, i) => (
                    <motion.div key={item._id} className="ai-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -6 }}>
                      {item.image && (
                        <div className="ai-card-img">
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="ai-card-body">
                        <h4>{item.name}</h4>
                        <span className="ai-slug">{item.slug}</span>
                        <div className="ai-card-actions">
                          <button className="ai-edit-btn" onClick={() => openEdit(item)}>Edit</button>
                          <button className="ai-del-btn" onClick={() => setDeleteTarget(item)}>Delete</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="form-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="form-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="form-modal-header">
                <h2>{editing ? "Edit Item" : "Add Item"}</h2>
                <button className="form-close" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="form-body">
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Item name" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.png" />
                </div>
                {form.image && (
                  <div className="form-image-preview">
                    <img src={form.image} alt="preview" onError={(e) => { e.target.style.display = "none" }} />
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="form-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="form-submit">{editing ? "Update" : "Create"}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="modal-overlay">
          <motion.div className="modal" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h3>Delete Item</h3>
            <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>?</p>
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

export default AdminItems;
