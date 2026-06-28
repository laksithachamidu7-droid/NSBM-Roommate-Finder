import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Roommates from './pages/Roommates';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import SavedProperties from './pages/SavedProperties';
import RoommateAdForm from './pages/RoommateAdForm';
import CreateProperty from './pages/CreateProperty';
import NsbmRoommateWizard from './pages/NsbmRoommateWizard';
import Settings from './pages/Settings';
import ChatDrawer from './components/ChatDrawer';


const DashboardLayout = () => {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <div className="dashboard-viewport">
        <Outlet />
      </div>
    </div>
  );
};

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content-viewport">
        <Outlet />
      </main>
    </div>
  );
};

const AppLayout = () => {
  return (
    <Routes>
      <Route 
        path="/nsbm-roommate" 
        element={
          <ProtectedRoute>
            <NsbmRoommateWizard />
          </ProtectedRoute>
        } 
      />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetail />} />
        <Route path="/roommates" element={<Roommates />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="saved" element={<SavedProperties />} />
          <Route path="roommate-ad" element={<RoommateAdForm />} />
          <Route path="create-property" element={<CreateProperty />} />
          <Route path="edit-property/:id" element={<CreateProperty />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
        <ChatDrawer />
      </Router>
    </AuthProvider>
  );
};

export default App;
