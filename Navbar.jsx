import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut, Compass } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
      boxShadow: '0 2px 8px rgba(255, 183, 0, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem'
      }}>
        <Link to="/dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--text-dark)',
          textDecoration: 'none',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          <Compass size={32} />
          Digital Detox
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            color: 'var(--text-dark)',
            borderRadius: '0.5rem',
            transition: 'all 0.2s',
            fontWeight: '500'
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <Home size={20} />
            Dashboard
          </Link>

          <Link to="/profile" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            textDecoration: 'none',
            color: 'var(--text-dark)',
            borderRadius: '0.5rem',
            transition: 'all 0.2s',
            fontWeight: '500'
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <User size={20} />
            {user?.username}
          </Link>

          <button onClick={handleLogout} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--danger)',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--danger)'}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





