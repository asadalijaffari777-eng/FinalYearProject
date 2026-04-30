import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../Services/api";
import './Home.css'

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/dashboard", { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(err => {
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

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return null;

  return (
    <div className="home-page">

      {/* HEADER */}
      <header className="home-header">
        <div className="logo">Startup Genius</div>

        <div className="header-actions">
          <span className="user-name">Hi, {user.username}</span>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="home-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">

          <nav>
            <Link to="/start-business">Start Business</Link>
            <Link to="/manufacturers">Manufacturers</Link>
            <Link to="/aichat">AI Chatbot</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
          </nav>
        </aside>

        {/* CONTENT */}
        <main className="home-content">

          <div className="welcome-card">
            <h1>Welcome, {user.username}</h1>
            <p>
              Your dashboard to start and grow your clothing business step by step.
            </p>
            <Link to="/start-business" className="primary-btn">
              Start Business
            </Link>
          </div>

          <div className="feature-grid">

            <div className="feature-card">
              <h3>Business Setup</h3>
              <p>Step-by-step guidance to launch your brand.</p>
            </div>

            <div className="feature-card">
              <h3>Find Manufacturers</h3>
              <p>Discover suppliers near your location.</p>
            </div>

            <div className="feature-card">
              <h3>Grow Your Brand</h3>
              <p>Marketing and scaling strategies.</p>
            </div>

          </div>

        </main>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="modal-buttons">
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;