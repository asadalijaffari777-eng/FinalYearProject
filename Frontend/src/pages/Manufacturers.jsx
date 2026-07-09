import { useEffect, useState, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../Services/api";
import "./Manufacturers.css";

const TYPE_OPTIONS = ["all", "small", "medium", "large"];
const PRICE_OPTIONS = ["all", "low", "medium", "high"];
const CATEGORY_OPTIONS = [
  "all", "caps", "sports-shirt", "t-shirt", "polo-shirt", "hoodies",
  "sweat-shirt", "jackets", "winter-upper", "jeans-pants", "trousers",
  "socks", "underwear", "school-shirt", "cotton-vest", "long-socks", "short-socks"
];

function Manufacturers() {
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await API.get("/manufacturers");
        setManufacturers(res.data || []);
      } catch {
        setManufacturers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    let result = manufacturers;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        (m.location || "").toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((m) => m.type === typeFilter);
    }

    if (priceFilter !== "all") {
      result = result.filter((m) => m.priceRange === priceFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((m) =>
        (m.categories || []).includes(categoryFilter)
      );
    }

    return result;
  }, [manufacturers, search, typeFilter, priceFilter, categoryFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const stats = useMemo(() => {
    const total = manufacturers.length;
    const small = manufacturers.filter((m) => m.type === "small").length;
    const medium = manufacturers.filter((m) => m.type === "medium").length;
    const large = manufacturers.filter((m) => m.type === "large").length;
    return { total, small, medium, large };
  }, [manufacturers]);

  return (
    <div className="manufacturer-page">

      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      <motion.header
        className="mp-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
        <Link to="/dashboard" className="logo">Startup Genius</Link>
      </motion.header>

      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <motion.aside
        className="sidebar"
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <nav>
          <NavLink to="/dashboard" onClick={() => setSidebarOpen(false)}>Home</NavLink>
          <NavLink to="/start-business" onClick={() => setSidebarOpen(false)}>Start Business</NavLink>
          <NavLink to="/manufacturers" onClick={() => setSidebarOpen(false)}>Manufacturers</NavLink>
          <NavLink to="/aichat" onClick={() => setSidebarOpen(false)}>AI Chatbot</NavLink>
          <NavLink to="/contact" onClick={() => setSidebarOpen(false)}>Contact</NavLink>
          <NavLink to="/about" onClick={() => setSidebarOpen(false)}>About</NavLink>
        </nav>
      </motion.aside>

      <main className="mp-content">

        <motion.div
          className="mp-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Manufacturers</h1>
          <p>Browse trusted production partners for your clothing business</p>
        </motion.div>

        {!loading && (
          <motion.div
            className="mp-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mp-stat-card">
              <span className="mp-stat-value">{stats.total}</span>
              <span className="mp-stat-label">Total Partners</span>
            </div>
            <div className="mp-stat-card">
              <span className="mp-stat-value">{stats.large}</span>
              <span className="mp-stat-label">Large Scale</span>
            </div>
            <div className="mp-stat-card">
              <span className="mp-stat-value">{stats.medium}</span>
              <span className="mp-stat-label">Medium Scale</span>
            </div>
            <div className="mp-stat-card">
              <span className="mp-stat-value">{stats.small}</span>
              <span className="mp-stat-label">Small Scale</span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="mp-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mp-search-box">
            <svg className="mp-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisibleCount(12); }}
            />
            {search && (
              <button className="mp-clear-btn" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div className="mp-filter-group">
            <label>Type</label>
            <div className="mp-chip-group">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  className={`mp-chip ${typeFilter === t ? "active" : ""}`}
                  onClick={() => { setTypeFilter(t); setVisibleCount(12); }}
                >
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mp-filter-group">
            <label>Price</label>
            <div className="mp-chip-group">
              {PRICE_OPTIONS.map((p) => (
                <button
                  key={p}
                  className={`mp-chip ${priceFilter === p ? "active" : ""}`}
                  onClick={() => { setPriceFilter(p); setVisibleCount(12); }}
                >
                  {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mp-filter-group">
            <label>Category</label>
            <select
              className="mp-select"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setVisibleCount(12); }}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All Categories" : c.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="mp-loading-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="mp-skeleton" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <motion.div
            className="mp-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mp-empty-icon">🔍</div>
            <h3>No manufacturers match your filters</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="mp-reset-btn" onClick={() => { setSearch(""); setTypeFilter("all"); setPriceFilter("all"); setCategoryFilter("all"); }}>
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mp-result-count">{filtered.length} manufacturer{filtered.length !== 1 ? "s" : ""} found</div>
            <div className="mp-grid">
              {visible.map((m, i) => (
                <motion.div
                  key={m._id}
                  className="mp-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -8 }}
                >
                  {m.image && (
                    <div className="mp-card-img">
                      <img src={m.image} alt={m.name} loading="lazy" />
                      <span className={`mp-card-badge ${m.type}`}>{m.type}</span>
                    </div>
                  )}
                  <div className="mp-card-body">
                    <div className="mp-card-header">
                      <h3>{m.name}</h3>
                      <span className="mp-card-price">{m.priceRange}</span>
                    </div>
                    {m.location && (
                      <div className="mp-card-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                        </svg>
                        {m.location}
                      </div>
                    )}
                    <div className="mp-card-cats">
                      {(m.categories || []).slice(0, 4).map((cat, j) => (
                        <span key={j}>{cat.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</span>
                      ))}
                      {(m.categories || []).length > 4 && (
                        <span className="mp-more">+{m.categories.length - 4}</span>
                      )}
                    </div>
                    <div className="mp-card-meta">
                      <div className="mp-meta-item">
                        <span className="mp-meta-label">MOQ</span>
                        <span className="mp-meta-value">{m.moq}</span>
                      </div>
                      <div className="mp-meta-item">
                        <span className="mp-meta-label">Price</span>
                        <span className="mp-meta-value mp-price-{m.priceRange}">{m.priceRange}</span>
                      </div>
                    </div>
                    {(m.links?.website || m.links?.instagram || m.links?.facebook || m.links?.linkedin) && (
                      <div className="mp-card-links">
                        {m.links.website && (
                          <a href={m.links.website} target="_blank" rel="noreferrer" className="mp-link mp-link-web" title="Website">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            </svg>
                          </a>
                        )}
                        {m.links.instagram && (
                          <a href={m.links.instagram} target="_blank" rel="noreferrer" className="mp-link mp-link-ig" title="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                          </a>
                        )}
                        {m.links.facebook && (
                          <a href={m.links.facebook} target="_blank" rel="noreferrer" className="mp-link mp-link-fb" title="Facebook">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                          </a>
                        )}
                        {m.links.linkedin && (
                          <a href={m.links.linkedin} target="_blank" rel="noreferrer" className="mp-link mp-link-in" title="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                    <div className="mp-card-contact">
                      {m.contact?.email && (
                        <a href={`mailto:${m.contact.email}`} className="mp-contact-link">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                          </svg>
                          {m.contact.email}
                        </a>
                      )}
                      {m.contact?.phone && (
                        <span className="mp-contact-phone">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                          </svg>
                          {m.contact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <motion.div
                className="mp-load-more"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  className="mp-load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                >
                  Show More ({filtered.length - visibleCount} remaining)
                </button>
              </motion.div>
            )}
          </>
        )}

      </main>
    </div>
  );
}

export default Manufacturers;