import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './../pages/Home';
import Services from './../pages/Services';
import Login from './../pages/Login';
import Register from './../pages/Register';
import Contact from './../pages/Contact';
import MyAccount from "../Dashboard/user-account/MyAccount"
import Dashboard from '../Dashboard/admin-account/Dashboard.jsx';

import ProtectedRoute from './ProtectedRoute';

const Routers = () => {

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/home' element={<Home />} />
      <Route path='/services' element={<Services />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/contact' element={<Contact />} />
      <Route
        path='/users/profile/me'
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <MyAccount />
          </ProtectedRoute>
        }
      />

      {/* Protected route for admin dashboard */}
      <Route
        path='/admin/profile/me'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default Routers;

