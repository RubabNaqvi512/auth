import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiMail, FiLogOut, FiHome, FiSettings, FiCalendar, FiFileText, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import './dashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state after hooks are declared
  const [userData, setUserData] = useState({
    name: auth.currentUser?.displayName || 
          (location.state?.email || '').split('@')[0] || 
          'User',
    email: location.state?.email || auth.currentUser?.email || '',
    role: location.state?.role || 'User',
    isFallback: true,
    isLoading: true
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/login');
          return;
        }

        // First set basic data immediately
        setUserData(prev => ({
          ...prev,
          isLoading: true
        }));

        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserData({
              ...docSnap.data(),
              role: location.state?.role || 'User',
              isLoading: false,
              isFallback: false
            });
          } else {
            setUserData({
              name: user.displayName || user.email.split('@')[0],
              email: user.email,
              role: location.state?.role || 'User',
              isLoading: false,
              isFallback: true
            });
          }
        } catch (firestoreError) {
          console.log("Using fallback data due to Firestore error:", firestoreError);
          setUserData({
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            role: location.state?.role || 'User',
            isLoading: false,
            isFallback: true
          });
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to load user data');
        setUserData(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };
    
    // Only fetch if we haven't already loaded proper data
    if (userData.isLoading) {
      fetchUserData();
    }
  }, [navigate, location.state, userData.isLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed. Please try again.');
    }
  };

  const retryFetch = () => {
    setError(null);
    setUserData(prev => ({
      ...prev,
      isLoading: true
    }));
  };

  if (error && userData.isFallback) {
    return (
      <div className="error-screen">
        <FiAlertCircle size={48} className="error-icon" />
        <h3>Connection Issue</h3>
        <p>We're having trouble connecting to the server.</p>
        <p>You can still use the app with limited functionality.</p>
        <button onClick={retryFetch} className="retry-button">
          <FiRefreshCw className="retry-icon" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="user-profile-card">
          <div className="avatar">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{userData.name}</h3>
            <p className="user-role">{userData.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome className="nav-icon" />
            <span>Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FiUser className="nav-icon" />
            <span>Profile</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FiFileText className="nav-icon" />
            <span>Documents</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <FiCalendar className="nav-icon" />
            <span>Calendar</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className="nav-icon" />
            <span>Settings</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Welcome back, {userData.name}!</h1>
          <div className="header-actions">
            <div className="notification-badge">3</div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <div className="dashboard-content">
              <div className="stats-cards">
                <div className="stat-card">
                  <h3>Completed Tasks</h3>
                  <p>24</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Requests</h3>
                  <p>5</p>
                </div>
                <div className="stat-card">
                  <h3>Messages</h3>
                  <p>12</p>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <ul>
                  <li>Updated profile information</li>
                  <li>Submitted monthly report</li>
                  <li>Completed onboarding tasks</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-content">
              <div className="profile-details">
                <div className="detail-item">
                  <FiUser className="detail-icon" />
                  <div>
                    <p className="detail-label">Full Name</p>
                    <p className="detail-value">{userData.name}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <FiMail className="detail-icon" />
                  <div>
                    <p className="detail-label">Email</p>
                    <p className="detail-value">{userData.email}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <div className="role-badge">{userData.role}</div>
                </div>
              </div>
            </div>
          )}

          {/* Add other tab contents here */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;