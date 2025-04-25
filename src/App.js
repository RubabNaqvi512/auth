import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login.js';  // Added .js
import Signup from './components/Auth/Signup.js';  // Added .js
import UserDashboard from './components/pages/UserDashboard.js';  // Added .js
import AdminDashboard from './components/pages/AdminDashboard.js';  // Added .js
import { AuthProvider } from './components/context/AuthContext.js';  // Added .js
import PrivateRoute from './components/PrivateRoute.js';  // Added .js

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;