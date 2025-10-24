import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-logo">
            <img src="/favicon.svg" alt="Prompt icon" style={{height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em'}} />
            PromptHub
          </div>
          <h1>Join PromptHub Today!</h1>
          <p>
            Create an account and get access to thousands of curated AI prompts. 
            Share your own prompts with the community and boost your productivity instantly!
          </p>
        </div>
        <div className="auth-hero-footer">
          © {new Date().getFullYear()} PromptHub. All rights reserved.
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-box">
          <h2>Create Account</h2>
          <p className="subtitle">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                minLength="3"
                maxLength="30"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a strong password"
                minLength="6"
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                minLength="6"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Creating Account...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i> Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
