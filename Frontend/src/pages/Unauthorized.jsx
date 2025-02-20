import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore.js';

const Unauthorized = () => {
  const { setIsLogin, checkingAuth, user } = useUserStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!checkingAuth && !user) {
      setIsLogin(true);
      navigate('/');
    }
  }, [navigate,user, checkingAuth]);

  return null;
};

export default Unauthorized;
