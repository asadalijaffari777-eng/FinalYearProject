import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import { motion } from "framer-motion";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setMessage("All fields are required");
    }

    try {
      const res = await API.post("/login", form);

      if (res.data.success) {
        navigate("/dashboard");
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">

      <div className="mesh-bg"></div>
      <div className="noise"></div>

      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* LEFT HERO */}
        <div className="login-hero">
          <div className="hero-content">
            <span className="hero-badge">Startup Genius</span>

            <h1>
              Welcome
              <br />
              Back.
            </h1>

            <p>
              Continue building your clothing business with AI-powered guidance.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-panel">

          <div className="panel-top">
            <h2>Login</h2>
            <p>Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-box">
              <label>Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
              />
            </div>

            <div className="input-box">
              <label>Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
              />
            </div>

            <button className="login-btn">Login</button>

            <button
              type="button"
              className="google-btn"
              onClick={() => {
                window.location.href = "http://localhost:3001/fyp/google";
              }}
            >
              Continue with Google
            </button>

          </form>

          {message && <p className="error-msg">{message}</p>}

          <div className="bottom-text">
            New here?
            <span className="createAccountBtn" onClick={() => navigate("/register")}>
              Create Account
            </span>
          </div>

        </div>

      </motion.div>

    </div>
  );
}

export default Login;