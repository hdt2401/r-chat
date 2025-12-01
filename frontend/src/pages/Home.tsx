import React from 'react'
import SignOut from '@/components/auth/signout'
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import api from '@/lib/axios';
import { toast } from 'sonner';

const Home = () => {
  const user = useAuthStore(s => s.user);
  const handleClick = async () => {
    try {
      await api.get('/user/test', {withCredentials: true});
      toast.success('Request successful');
    } catch (error) {
      console.error('Error making request:', error);
      toast.error('Request failed');
    }
  }
  return (
    <div>
      <p>hello {user?.displayName}</p>
      <SignOut />
      <Button onClick={handleClick}>Tesing</Button>
    </div>
  )
}

export default Home