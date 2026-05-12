import { useState } from "react";
import API from "../Services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Verify.css";

function Verify() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  if (!email) {
    return (
      <div className="verify-page">
        <div className="error-screen">
          No email found. Please register again.
        </div>
      </div>
    );
  }

  const verifyHandle = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/verify", { email, otp });

      if (res.data.success) {
        setTimeout(() => navigate("/dashboard"), 100);
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage("Verification failed");
    }
  };

  return (
    <div className="verify-page">

      <div className="mesh-bg"></div>
      <div className="noise"></div>

      <motion.div
        className="verify-wrapper"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* LEFT HERO */}
        <div className="verify-hero">
          <div className="hero-content">
            <span className="hero-badge">Secure Verification</span>

            <h1>
              Confirm
              <br />
              Your Account
            </h1>

            <p>
              Enter the OTP sent to your email to activate your account.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="verify-panel">

          <div className="panel-top">
            <h2>Verification</h2>
            <p>{email}</p>
          </div>

          <form onSubmit={verifyHandle}>

            <div className="input-box">
              <label>OTP Code</label>

              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                placeholder="Enter 6-digit code"
              />
            </div>

            <button className="verify-btn">
              Verify Account
            </button>

          </form>

          {message && (
            <p className="error-msg">{message}</p>
          )}

        </div>

      </motion.div>
    </div>
  );
}

export default Verify;