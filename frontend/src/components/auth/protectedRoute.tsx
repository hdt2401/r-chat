import { useAuthStore } from '@/stores/auth'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router';

function ProtectedRoute() {
  const {accessToken, user, loading, refreshToken, fetchMe} = useAuthStore();
  const [start, setStart] = useState(true); // true if app is starting
  const init = async () => {
    if (!accessToken) {
      await refreshToken();
    }

    if (accessToken && !user) {
      await fetchMe();
    }

    setStart(false);
  }

  useEffect(() => {
    init();
  }, []);

  if (start || loading) {
    return <div className='flex h-screen items-center justify-center'>Loading...</div>
  }

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