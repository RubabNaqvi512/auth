import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUsers, FiSettings, FiDatabase, FiBarChart2, FiLock } from 'react-icons/fi';
import './dashboard.css'; // Reuse the same CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('overview');
  const adminName = "Administrator"; // You can make this dynamic if needed

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar admin-sidebar">
        <div className="user-profile-card">
          <div className="avatar admin-avatar">
            <FiLock className="admin-icon" />
          </div>
          <div className="user-info">
            <h3>{adminName}</h3>
            <p className="user-role admin-role">Admin</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FiBarChart2 className="nav-icon" />
            <span>Overview</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers className="nav-icon" />
            <span>User Management</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'data' ? 'active' : ''}`}
            onClick={() => setActiveTab('data')}
          >
            <FiDatabase className="nav-icon" />
            <span>Database</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings className="nav-icon" />
            <span>System Settings</span>
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
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <div className="notification-badge">5</div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'overview' && (
            <div className="dashboard-content">
              <div className="admin-welcome">
                <h2>Welcome back, {adminName}!</h2>
                <p>You have full administrative privileges to manage the system.</p>
              </div>

              <div className="stats-cards">
                <div className="stat-card admin-stat">
                  <h3>Total Users</h3>
                  <p>1,248</p>
                </div>
                <div className="stat-card admin-stat">
                  <h3>Active Today</h3>
                  <p>327</p>
                </div>
                <div className="stat-card admin-stat">
                  <h3>New Registrations</h3>
                  <p>42</p>
                </div>
                <div className="stat-card admin-stat">
                  <h3>System Health</h3>
                  <p>100%</p>
                </div>
              </div>

              <div className="admin-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-btn">
                    <FiUsers className="action-icon" />
                    <span>Manage Users</span>
                  </button>
                  <button className="action-btn">
                    <FiSettings className="action-icon" />
                    <span>System Settings</span>
                  </button>
                  <button className="action-btn">
                    <FiDatabase className="action-icon" />
                    <span>Backup Database</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>User Management</h2>
              {/* User management content would go here */}
              <p>User list and management tools will appear here.</p>
            </div>
          )}

          {/* Add other tab contents similarly */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;