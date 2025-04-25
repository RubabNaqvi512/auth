import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Changed to HashRouter
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import UserDashboard from './components/pages/UserDashboard';
import AdminDashboard from './components/pages/AdminDashboard';
import { AuthProvider } from './components/context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router> {/* Removed basename */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Login />} /> {/* Catch-all route */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;