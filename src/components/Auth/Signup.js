import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // Debugging: Log initial auth state
  useEffect(() => {
    console.log('Firebase auth object:', auth);
    console.log('Firebase db object:', db);
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateForm = () => {
    console.log('Validating form...');
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form validation result:', isValid);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit triggered with data:', formData);
    
    // Validate form
    if (!validateForm()) {
      console.log('Validation failed - stopping submission');
      return;
    }
    
    setLoading(true);
    console.log('Attempting signup...');
    
    try {
      // Debug: Log before auth attempt
      console.log('Attempting to create user with:', {
        email: formData.email,
        password: formData.password
      });

      // 1. Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      console.log('Auth success! User created:', userCredential.user.uid);

      // 2. Prepare user data
      const userData = {
        name: formData.name,
        email: formData.email,
        createdAt: new Date(),
        uid: userCredential.user.uid,
        lastLogin: new Date()
      };

      // 3. Save to Firestore
      console.log('Attempting to save to Firestore...');
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      console.log('Firestore save successful!');

      // 4. Show success message
      toast.success('🎉 Account created successfully! Redirecting...', {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        onClose: () => {
          navigate('/login', {
            state: { 
              signupSuccess: true,
              email: formData.email 
            },
            replace: true
          });
        }
      });

    } catch (err) {
      console.error('SIGNUP ERROR:', {
        code: err.code,
        message: err.message,
        fullError: err
      });
      
      let errorMessage = 'Signup failed. Please try again.';
      let shouldNavigate = false;
      
      switch(err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already in use. Try logging in instead.';
          shouldNavigate = true;
          break;
        case 'auth/weak-password':
          errorMessage = 'Password must be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password authentication is not enabled. Contact support.';
          break;
        case 'permission-denied':
          errorMessage = 'Database permission denied. Please try again later.';
          break;
        default:
          errorMessage = `Error: ${err.message || 'Unknown error occurred'}`;
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });

      if (shouldNavigate) {
        navigate('/login', { state: { email: formData.email }, replace: true });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        console.log('Loading state set to false');
      }
    }
  };
  
  return (
    <div className="signup-container">
      <ToastContainer />
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p className="auth-subtitle">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`form-group ${errors.name ? 'error' : ''}`}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error-input' : ''}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className={`form-group ${errors.email ? 'error' : ''}`}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error-input' : ''}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 6 characters)"
              className={errors.password ? 'error-input' : ''}
              required
              minLength="6"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={errors.confirmPassword ? 'error-input' : ''}
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
            onClick={(e) => {
              console.log('Button click event:', e);
              e.stopPropagation();
            }}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account?</p>
          <button 
            className="auth-button secondary"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;