import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-logo">
            <img src="/favicon.svg" alt="Prompt icon" style={{height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em'}} />
            PromptHub
          </div>
          <h1>Welcome Back!</h1>
          <p>
            Skip repetitive and manual prompt-searching tasks. Get highly productive 
            through our curated collection and save tons of time!
          </p>
        </div>
        <div className="auth-hero-footer">
          © {new Date().getFullYear()} PromptHub. All rights reserved.
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-box">
          <h2>Login</h2>
          <p className="subtitle">
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                minLength="6"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Logging in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket"></i> Login Now
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
