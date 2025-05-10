// src/pages/CallbackHandler.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from '../auth';

export default function CallbackHandler() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const code = params.get('code');
    if (code) {
      exchangeCodeForToken(code).then(() => {
        navigate('/'); // or wherever you want to go after login
      });
    }
  }, [search, navigate]);

  return <p>Logging in...</p>;
}
