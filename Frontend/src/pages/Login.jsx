import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import { motion } from "framer-motion";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const msgRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      setMessage("All fields are required");
      return;
    }

    try {
      const res = await API.post("/login", form);

      if (res.data.success) {
        localStorage.removeItem("businessSelections");
        if (res.data.token) localStorage.setItem("token", res.data.token);
        navigate(res.data.user?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Login failed");
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
        transition={{ duration: 0.5 }}
      >
        <div className="login-hero">
          <div className="hero-content">
            <span className="hero-badge">AI Powered Platform</span>
            <h1>Welcome<br />Back To<br />Startup Genius</h1>
            <p>Continue your startup journey with AI guidance, supplier discovery, and smart business planning.</p>
          </div>
        </div>

        <div className="login-panel">
          <div className="panel-top">
            <h2>Login</h2>
            <p>Sign in to access your account.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="input-box">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
            <button type="submit" className="login-btn">Sign In</button>

            <div className="divider"><span>OR</span></div>

            <button type="button" className="google-btn" onClick={() => window.location.href = "/fyp/google"}>
              Continue with Google
            </button>

            <div className="forget-link" onClick={() => navigate('/forget-password')}>
              Forgot Password?
            </div>

            <p ref={msgRef} className="error-msg">{message || "\u00A0"}</p>
          </form>

          <div className="bottom-text">
            Don't have an account?
            <span onClick={() => navigate("/register")}>Register</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

export default Login;