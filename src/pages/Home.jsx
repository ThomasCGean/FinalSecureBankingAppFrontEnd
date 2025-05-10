import { useEffect, useState } from 'react';
import { getToken, redirectToLogin, logout } from '../auth';

export default function Home() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      redirectToLogin();
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setEmail(payload.email);
    } catch (err) {
      console.error('Invalid token:', err);
      redirectToLogin();
    }
  }, []);

  if (!email) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome to the Secure Banking App</h2>
      <p>You are signed in as: <strong>{email}</strong></p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
