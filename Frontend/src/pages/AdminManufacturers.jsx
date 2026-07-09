import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Services/api";
import "./AdminManufacturers.css";

const emptyForm = {
  name: "",
  image: "",
  categories: "",
  location: "",
  type: "medium",
  moq: 0,
  priceRange: "medium",
  website: "",
  instagram: "",
  facebook: "",
  linkedin: "",
  email: "",
  phone: ""
};

function AdminManufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/manufacturers");
      setManufacturers(res.data);
    } catch {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (m) => {
    setForm({
      name: m.name || "",
      image: m.image || "",
      categories: (m.categories || []).join(", "),
      location: m.location || "",
      type: m.type || "medium",
      moq: m.moq || 0,
      priceRange: m.priceRange || "medium",
      website: m.links?.website || "",
      instagram: m.links?.instagram || "",
      facebook: m.links?.facebook || "",
      linkedin: m.links?.linkedin || "",
      email: m.contact?.email || "",
      phone: m.contact?.phone || ""
    });
    setEditing(m._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.type) {
      return alert("Name and type are required");
    }

    const payload = {
      name: form.name,
      image: form.image,
      categories: form.categories.split(",").map((c) => c.trim()).filter(Boolean),
      location: form.location,
      type: form.type,
      moq: Number(form.moq),
      priceRange: form.priceRange,
      links: {
        website: form.website,
        instagram: form.instagram,
        facebook: form.facebook,
        linkedin: form.linkedin
      },
      contact: {
        email: form.email,
        phone: form.phone
      }
    };

    try {
      if (editing) {
        await API.put(`/admin/manufacturers/${editing}`, payload);
      } else {
        await API.post("/admin/manufacturers", payload);
      }
      setShowForm(false);
      fetchManufacturers();
    } catch (err) {
      alert("Failed to save manufacturer");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/manufacturers/${deleteTarget._id}`);
      setManufacturers((prev) => prev.filter((m) => m._id !== deleteTarget._id));
    } catch {
      alert("Failed to delete manufacturer");
    } finally {
      setDeleteTarget(null);
    }
  };

  const typeOptions = ["small", "medium", "large"];
  const priceOptions = ["low", "medium", "high"];

  return (
    <div className="admin-mfr-page">
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      <motion.header className="am-header" initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7 }}>
        <div className="am-header-left">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span className="logo">Admin Panel</span>
        </div>
        <div className="am-badge">Manufacturers</div>
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

      <div className="am-layout">
        <main className="am-content">
          <motion.div className="am-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1>Manufacturers</h1>
              <p>Manage manufacturer listings</p>
            </div>
            <motion.button className="am-add-btn" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd}>
              + Add Manufacturer
            </motion.button>
          </motion.div>

          {loading ? (
            <p className="am-loading">Loading...</p>
          ) : manufacturers.length === 0 ? (
            <p className="am-loading">No manufacturers found.</p>
          ) : (
            <div className="am-grid">
              {manufacturers.map((m, i) => (
                <motion.div key={m._id} className="am-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} whileHover={{ y: -6 }}>
                  {m.image && (
                    <div className="am-card-img">
                      <img src={m.image} alt={m.name} />
                    </div>
                  )}
                  <div className="am-card-body">
                    <div className="am-card-top">
                      <h3>{m.name}</h3>
                      <span className={`am-type-badge ${m.type}`}>{m.type}</span>
                    </div>
                    <p className="am-location">{m.location}</p>
                    <div className="am-tags">
                      {(m.categories || []).map((cat, j) => (
                        <span key={j}>{cat}</span>
                      ))}
                    </div>
                    <div className="am-card-info">
                      <span>MOQ: {m.moq}</span>
                      <span>Price: {m.priceRange}</span>
                    </div>
                    {(m.links?.website || m.links?.instagram) && (
                      <div className="am-card-links">
                        {m.links.website && <a href={m.links.website} target="_blank" rel="noreferrer">Website</a>}
                        {m.links.instagram && <a href={m.links.instagram} target="_blank" rel="noreferrer">Instagram</a>}
                      </div>
                    )}
                    <div className="am-card-actions">
                      <button className="am-edit-btn" onClick={() => openEdit(m)}>Edit</button>
                      <button className="am-del-btn" onClick={() => setDeleteTarget(m)}>Delete</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FORM MODAL */}
      <AnimatePresence>
        {showForm && (
          <motion.div className="form-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="form-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="form-modal-header">
                <h2>{editing ? "Edit Manufacturer" : "Add Manufacturer"}</h2>
                <button className="form-close" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit} className="form-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Manufacturer name" />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                </div>
                {form.image && (
                  <div className="form-image-preview">
                    <img src={form.image} alt="preview" onError={(e) => { e.target.style.display = "none" }} />
                  </div>
                )}
                <div className="form-group">
                  <label>Categories (comma separated)</label>
                  <input name="categories" value={form.categories} onChange={handleChange} placeholder="e.g. t-shirt, polo-shirt, hoodies" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select name="type" value={form.type} onChange={handleChange}>
                      {typeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price Range</label>
                    <select name="priceRange" value={form.priceRange} onChange={handleChange}>
                      {priceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>MOQ</label>
                    <input name="moq" type="number" value={form.moq} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-section-title">Links</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input name="website" value={form.website} onChange={handleChange} placeholder="https://" />
                  </div>
                  <div className="form-group">
                    <label>Instagram</label>
                    <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Facebook</label>
                    <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://" />
                  </div>
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
                <div className="form-section-title">Contact</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92..." />
                  </div>
                </div>
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
            <h3>Delete Manufacturer</h3>
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

export default AdminManufacturers;
