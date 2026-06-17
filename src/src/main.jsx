
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthProvider'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import NewAnnouncement from './pages/NewAnnouncement'
import AnnouncementDetail from './pages/AnnouncementDetail'
import Profile from './pages/Profile'
import Carriers from './pages/Carriers'
import './index.css'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>
  return user ? children : <Navigate to="/login" replace />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/nouvelle-annonce" element={<PrivateRoute><NewAnnouncement /></PrivateRoute>} />
          <Route path="/annonce/:id" element={<PrivateRoute><AnnouncementDetail /></PrivateRoute>} />
          <Route path="/profil" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/transporteurs" element={<PrivateRoute><Carriers /></PrivateRoute>} />
          <Route path="/annonces" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
