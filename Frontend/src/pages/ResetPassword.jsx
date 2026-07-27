import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../Services/api";
import ErrorToast from "../component/ErrorToast";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!email) {
    return (
      <div className="reset-page">
        <div className="mesh-bg"></div>
        <div className="noise"></div>
        <div className="reset-card">
          <h2>Invalid Access</h2>
          <p>No email found. Please request a new OTP.</p>
          <button className="reset-btn" onClick={() => navigate("/forget-password")}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    setError("");

    if (!otp || !newPassword || !confirmPassword) {
      setError("All fields are required");
      setKey(k => k + 1);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setKey(k => k + 1);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setKey(k => k + 1);
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/reset-password", { email, otp, newPassword });
      if (res.data.success) {
        navigate("/", { state: { resetSuccess: true } });
      } else {
        setError(res.data.message);
        setKey(k => k + 1);
      }
    } catch {
      setError("Something went wrong");
      setKey(k => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <ErrorToast key={key} message={error} onClose={() => setError("")} />

      <div className="mesh-bg"></div>
      <div className="noise"></div>

      <motion.div
        className="reset-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="reset-hero">
          <div className="hero-content">
            <span className="hero-badge">New Password</span>
            <h1>Set Your<br />New<br />Password</h1>
            <p>Enter the OTP sent to your email and choose a new password.</p>
          </div>
        </div>

        <div className="reset-panel">
          <div className="panel-top">
            <h2>Reset Password</h2>
            <p>OTP sent to <strong>{email}</strong></p>
          </div>

          <form>
            <div className="input-box">
              <label>OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
              />
            </div>

            <div className="input-box">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="input-box">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
              />
            </div>

            <button type="button" className="reset-btn" disabled={loading} onClick={handleSubmit}>
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
