import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../Services/api";
import "./Home.css";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/dashboard", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          navigate("/");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await API.post("/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      alert("Logout failed");
    } finally {
      setShowLogoutModal(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </div>
    );
  }

  if (!user) return null;

  const features = [
    {
      title: "Business Setup",
      desc: "Launch your clothing brand with guided planning, budgeting, and AI-driven recommendations.",
    },
    {
      title: "Manufacturers",
      desc: "Discover trusted suppliers and production partners to scale your business faster.",
    },
    {
      title: "AI Assistant",
      desc: "Get instant AI help for branding, product ideas, marketing, and growth strategies.",
    },
  ];

  return (
    <div className="home-page">

      {/* BACKGROUND EFFECTS */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      <div className="bg-grid"></div>

      {/* HEADER */}
      <motion.header
        className="home-header"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="logo">
          Startup Genius
        </div>

        <div className="header-actions">
          <div className="user-badge">
            Hi, {user.username}
          </div>

          <motion.button
            className="logout-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </motion.button>
        </div>
      </motion.header>

      {/* MAIN LAYOUT */}
      <div className="home-layout">

        {/* SIDEBAR */}
        <motion.aside
          className="sidebar"
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sidebar-top">
            <h3>Dashboard</h3>
            <p>Manage your startup journey</p>
          </div>

          <nav>
            <NavLink to="/start-business">
              Start Business
            </NavLink>

            <NavLink to="/aichat">
              AI Chatbot
            </NavLink>

            <NavLink to="/manufacturers">
              Manufacturers
            </NavLink>

            <NavLink to="/contact">
              Contact
            </NavLink>

            <NavLink to="/about">
              About
            </NavLink>
          </nav>
        </motion.aside>

        {/* CONTENT */}
        <main className="home-content">

          {/* HERO */}
          <motion.section
            className="hero-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-left">

              <motion.div
                className="hero-badge"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                AI Powered Clothing Business Platform
              </motion.div>

              <motion.h1
                className="hero-title"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Build Your Brand
                <span>Smarter & Faster</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Launch, manage, and scale your fashion business using
                intelligent AI tools, manufacturer networks, and smart planning systems.
              </motion.p>

              <motion.div
                className="hero-buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/start-business" className="primary-btn">
                  Start Business
                </Link>

                <Link to="/aichat" className="secondary-btn">
                  Open AI Assistant
                </Link>
              </motion.div>
            </div>

            {/* FLOATING SIDE */}
            <motion.div
              className="hero-right"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="floating-card card-1">
                <h4>Multiple</h4>
                <p>Verified Manufacturers</p>
              </div>

              <div className="floating-card card-2">
                <h4>AI Powered</h4>
                <p>Business Planning & Guidance</p>
              </div>

              <div className="floating-card card-3">
                <h4>24/7</h4>
                <p>Smart AI Assistance</p>
              </div>
            </motion.div>
          </motion.section>

          {/* FEATURES */}
          <div className="feature-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
              >
                <div className="feature-icon">
                  0{index + 1}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <motion.div
            className="modal"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3>Confirm Logout</h3>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="modal-buttons">
              <button className="cancelBtn" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>

              <button
                className="danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Home;