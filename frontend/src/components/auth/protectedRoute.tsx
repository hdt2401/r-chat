import { useAuthStore } from '@/stores/auth'
import React from 'react'
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const {accessToken, user, loading} = useAuthStore();
  if (!accessToken) {
    return (
      <Navigate to="/signin" replace/>
    )
  }
  return (
    <Outlet></Outlet>
  )
}

export default ProtectedRoute