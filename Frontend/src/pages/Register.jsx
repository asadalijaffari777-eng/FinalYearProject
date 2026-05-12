
import { useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      return setMessage("All fields are required");
    }

    try {
      const res = await API.post("/register", form);

      if (res.data.success) {
        navigate("/verify", {
          state: { email: form.email },
        });
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="register-page">

      <div className="mesh-bg"></div>
      <div className="noise"></div>

      <motion.div
        className="register-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* LEFT */}
        <div className="register-hero">

          <div className="hero-content">
            <span className="hero-badge">
              AI Powered Platform
            </span>

            <h1>
              Build
              <br />
              Fashion Brands
              <br />
              Faster.
            </h1>

            <p>
              Launch your clothing business with AI guidance,
              supplier discovery, and smart business planning.
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="register-panel">

          <div className="panel-top">
            <h2>Create Account</h2>
            <p>
              Start building your startup professionally.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            <div className="input-box">
              <label>Name</label>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="register-btn">
              Create Account
            </button>

          </form>

          {message && (
            <p className="error-msg">{message}</p>
          )}

          <div className="bottom-text">
            Already have an account?

            <span onClick={() => navigate("/")}>
              Login
            </span>
          </div>

        </div>

      </motion.div>

    </div>
  );
}

export default Register;