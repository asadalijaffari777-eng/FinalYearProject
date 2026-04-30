import { useState } from 'react';
import API from '../Services/api';
import { useLocation, useNavigate } from "react-router-dom";
import './Verify.css';

function Verify() {
  const location = useLocation();
  const email = location.state?.email;
  
  if (!email) {
    return <h2>No email found. Please register again.</h2>;
  }

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const verifyHandle = async (e) => {
    e.preventDefault();
  
    try {
      // Remove /fyp from the URL
      const res = await API.post('/verify', { email, otp });
      const data = res.data;
  
      if (data.success) {
        console.log("Verification successful");
        // Small delay to ensure cookie is set
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Verification failed");
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="verify-page">
      <div className="overlay"></div>

      <div className="verify-container">
        <div className="verify-box">
          <h2>Verify Your Account</h2>
          <p className="subtitle">
            Enter the OTP sent to your email
          </p>

          <form onSubmit={verifyHandle}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              required
            />

            <button type="submit">Verify</button>
          </form>

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Verify;