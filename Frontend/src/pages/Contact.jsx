import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Contact.css";

function Contact() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="contact-page">

      {/* BACKGROUND */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER */}
      <motion.header
        className="contact-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-left">
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

          <Link to="/dashboard" className="logo">
            Startup Genius
          </Link>
        </div>

        <div className="contact-badge">
          Contact Team
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
        animate={{
          x: menuOpen ? 0 : -300
        }}
        transition={{
          type: "spring",
          stiffness: 120
        }}
      >
        <div className="sidebar-top">
          <h2>Menu</h2>

          <button onClick={() => setMenuOpen(false)}>
            ✕
          </button>
        </div>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/start-business">Start Business</NavLink>
          <NavLink to="/manufacturers">Manufacturers</NavLink>
          <NavLink to="/aichat">AI Chatbot</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </motion.aside>

      {/* MAIN */}
      <main className="contact-container">

        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
        >

          <div className="contact-title">
            <h1>Contact Us</h1>

            <p>
              Meet the development team behind Startup Genius.
            </p>
          </div>

          <div className="contact-list">

            <div className="contact-item">
              <h3>Muhammad Bilal</h3>

              <p>CMS: 60619</p>

              <a href="mailto:Bilal@buitems.com">
                Bilal@buitems.com
              </a>
            </div>

            <div className="contact-item">
              <h3>Mustafa</h3>

              <p>CMS: 61255</p>

              <a href="mailto:Mustafa@buitems.com">
                Mustafa@buitems.com
              </a>
            </div>

            <div className="contact-item">
              <h3>Asad Ullah</h3>

              <p>CMS: 61984</p>

              <a href="mailto:Asad@buitems.com">
                Asad@buitems.com
              </a>
            </div>

          </div>

        </motion.div>

      </main>
    </div>
  );
}

export default Contact;