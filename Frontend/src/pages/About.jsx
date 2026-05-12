import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./About.css";

function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="about-page">

      {/* BACKGROUND */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER */}
      <motion.header
        className="about-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

        <Link to="/dashboard" className="logo">
          Startup Genius
        </Link>

        <div className="about-badge">
          About Us
        </div>
      </motion.header>

      {/* OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="overlay"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside
        className={`sidebar ${menuOpen ? "open" : ""}`}
        initial={false}
        animate={{ x: menuOpen ? 0 : -300 }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
      >
        <div className="sidebar-top">
          <h2>Menu</h2>

          <button onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav>
          <NavLink onClick={() => setMenuOpen(false)} to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink onClick={() => setMenuOpen(false)} to="/start-business">
            Start Business
          </NavLink>

          <NavLink onClick={() => setMenuOpen(false)} to="/manufacturers">
            Manufacturers
          </NavLink>

          <NavLink onClick={() => setMenuOpen(false)} to="/aichat">
            AI Chatbot
          </NavLink>

          <NavLink onClick={() => setMenuOpen(false)} to="/contact">
            Contact
          </NavLink>

          <NavLink onClick={() => setMenuOpen(false)} to="/about">
            About
          </NavLink>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <main className="about-container">

        <motion.div
          className="about-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>About Startup Genius</h1>

          <p>
            Startup Genius helps beginners launch and grow a clothing business
            with structured guidance, product planning, AI assistance, and
            manufacturer discovery.
          </p>

          <div className="about-section">
            <h3>What You Can Do</h3>

            <ul>
              <li>Discover manufacturers</li>
              <li>Build your inventory</li>
              <li>Get AI business guidance</li>
              <li>Plan your startup direction</li>
            </ul>
          </div>

          <Link to="/start-business" className="about-btn">
            Start Your Business →
          </Link>
        </motion.div>

      </main>
    </div>
  );
}

export default About;