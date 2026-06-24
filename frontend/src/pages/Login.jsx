import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-full.png';
import welcomeImg from "../assets/welcome-image-login.png";
import './Auth.css';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    // Save token
    localStorage.setItem("token", data.token);

    // Navigate to dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    alert("Server error, try again later");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Form Side */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">

            <img
              src={logo}
              alt="CampusFind Logo"
              className="auth-logo"
            />

            <h1 className="auth-title">Welcome Back!</h1>

            <p className="auth-subtitle">
              Login to your account
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">
                Register Now
              </Link>
            </p>

          </div>
        </div>

        {/* Image Side */}
        <div className="auth-image-panel">
          <img
            src={welcomeImg}
            alt="Welcome"
            className="auth-side-img"
          />
        </div>

      </div>
    </div>
  );
}

export default Login;