import { useEffect, useState } from "react";
import { useLocation, Link, NavLink } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./Manufacturers.css";

function Manufacturers() {
  const location = useLocation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const query = location.search;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:3001/fyp/manufacturers${query}`
        );

        setData(res.data || []);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <div className="manufacturer-page">

      {/* BACKGROUND */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER */}
      <motion.header
        className="mp-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          ☰
        </button>

        <Link to="/dashboard" className="logo">
          Startup Genius
        </Link>
      </motion.header>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <motion.aside
        className={`sidebar ${menuOpen ? "open" : ""}`}
        initial={false}
        animate={{ x: menuOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <nav>
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/start-business" onClick={() => setMenuOpen(false)}>Start Business</NavLink>
          <NavLink to="/manufacturers" onClick={() => setMenuOpen(false)}>Manufacturers</NavLink>
          <NavLink to="/aichat" onClick={() => setMenuOpen(false)}>AI Chatbot</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <main className="mp-content">

        <motion.div
          className="mp-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>Manufacturers</h1>
          <p>Find trusted production partners for your business</p>
        </motion.div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : data.length === 0 ? (
          <p className="loading">No manufacturers found.</p>
        ) : (
          <div className="mp-grid">
            {data.map((m, index) => (
              <motion.div
                key={m._id}
                className="mp-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
              >
                <h3>{m.name}</h3>

                <span className={`badge ${m.type}`}>
                  {m.type}
                </span>

                <p className="location">{m.location}</p>

                <div className="tags">
                  {m.categories.map((cat, i) => (
                    <span key={i}>{cat}</span>
                  ))}
                </div>

                <div className="info">
                  <p><strong>MOQ:</strong> {m.moq}</p>
                  <p><strong>Price:</strong> {m.priceRange}</p>
                </div>

                <div className="links">
                  {m.links?.website && (
                    <a href={m.links.website} target="_blank">Website</a>
                  )}
                  {m.links?.instagram && (
                    <a href={m.links.instagram} target="_blank">Instagram</a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default Manufacturers;