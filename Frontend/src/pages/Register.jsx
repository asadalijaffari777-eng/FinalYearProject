import { useState } from "react";
import API from "../Services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      return setMessage("All fields are required");
    }

    try {
      const res = await API.post("/register", form);

      if (res.data.success) {
        navigate("/verify", { state: { email: form.email } });
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-page">

      {/* LEFT SIDE */}
      <div className="register-left">
        <div className="overlay"></div>
        <div className="left-content">
          <h1>Startup Genius</h1>
          <p>
            Build your clothing brand from scratch with step-by-step guidance.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="register-right">
        <div className="register-box">

          <h2>Create Account</h2>
          <p className="subtitle">Start your journey today</p>

          <form onSubmit={handleRegister} autoComplete="off">

            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

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

            <button type="submit" className="register-btn">
              Register
            </button>

          </form>

          {message && <p className="error">{message}</p>}

          <p className="switch">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Register;