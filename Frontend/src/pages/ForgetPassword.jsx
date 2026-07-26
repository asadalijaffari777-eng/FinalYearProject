import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../Services/api";
import ErrorToast from "../component/ErrorToast";
import "./ForgetPassword.css";

function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Please enter your email");

    setLoading(true);

    try {
      const res = await API.post("/forget-password", { email });
      if (res.data.success) {
        navigate("/reset-password", { state: { email } });
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forget-page">
      <ErrorToast message={error} onClose={() => setError("")} />

      <div className="mesh-bg"></div>
      <div className="noise"></div>

      <motion.div
        className="forget-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="forget-hero">
          <div className="hero-content">
            <span className="hero-badge">Password Reset</span>
            <h1>Forgot<br />Your<br />Password?</h1>
            <p>Enter your email and we'll send you an OTP to reset your password.</p>
          </div>
        </div>

        <div className="forget-panel">
          <div className="panel-top">
            <h2>Reset Password</h2>
            <p>We'll send a verification code to your email.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" className="forget-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <div className="bottom-text">
            Remember your password?
            <span onClick={() => navigate("/")}>Login</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ForgetPassword;
