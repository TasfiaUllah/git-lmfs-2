import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-full.png';
import signupImg from '../assets/welcome-image-login.png';
import './Auth.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    matrixId: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords do not match!');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    localStorage.setItem('token', data.token);
    navigate('/login');

  } catch (err) {
    setError('Server error. Please try again.');
    setLoading(false);
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Image Side */}
        <div className="auth-image-panel">
          <img
            src={signupImg}
            alt="Sign Up"
            className="auth-side-img"
          />
        </div>

        {/* Form Side */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">

            <img
              src={logo}
              alt="CampusFind Logo"
              className="auth-logo"
            />

            <h1 className="auth-title">
              Create an Account!
            </h1>

            <p className="auth-subtitle">
              Join CampusFind to find your lost treasure
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="form-row">

                <div className="form-group">
                  <label>Matrix ID</label>

                  <input
                    type="text"
                    name="matrixId"
                    placeholder="Enter your Student ID"
                    value={formData.matrixId}
                    onChange={handleChange}
                    required
                  />
                </div>

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

              </div>

              <div className="form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name as used in university"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  placeholder="Set your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Enter the password again"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="auth-btn"
                disabled={loading}
              >
                {loading
                  ? 'Creating account...'
                  : 'Sign Up'}
              </button>

            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">
                Login Here
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;