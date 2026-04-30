import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Services/api";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="overlay"></div>
        <div className="left-content">
          <h1>Startup Genius</h1>
          <p>
            Start your clothing business the smart way. Step-by-step guidance for beginners.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-box">

          <h2>Welcome Back</h2>
          <p className="subtitle">Login to continue</p>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            {/*GOOGLE LOGIN */}
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

          {message && <p className="error">{message}</p>}

          <p className="switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;