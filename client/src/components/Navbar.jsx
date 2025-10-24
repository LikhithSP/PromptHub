import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/favicon.svg" alt="Prompt icon" style={{height: '1.5em', verticalAlign: 'middle', marginRight: '0.5em'}} />
          PromptHub
        </Link>
        <div className="nav-links">
          <Link to="/"><i className="fa-solid fa-house"></i> Home</Link>
          {user ? (
            <>
              <Link to="/create"><i className="fa-solid fa-plus"></i> Create Prompt</Link>
              <span className="username"><i className="fa-solid fa-user"></i> {user.username}</span>
              <button onClick={logout} className="btn-logout">
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Login</Link>
              <Link to="/register"><i className="fa-solid fa-user-plus"></i> Register</Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
