import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        navigate('/admin-dashboard', { state: { role: 'Admin' } });
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/user-dashboard', { state: { role: 'User' } });
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.';
      switch(err.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Account temporarily locked.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
          break;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Please enter your credentials to login</p>
        </div>
        
        {error && <p className="login-error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="login-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing In...
              </>
            ) : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p className="login-link">
            Don't have an account? <span onClick={() => navigate('/signup')}>Create one</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;