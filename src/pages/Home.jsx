import { useEffect, useState } from 'react';
import { getToken, logout, redirectToLogin } from '../auth';

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '80vh',
        width: '100%',
      }}
    >
      <h2>Welcome to the VaultGuard, the most secure banking app on this specific VPC
      </h2>
      {email && <p>You are signed in as: <strong>{email}</strong></p>}
      <button onClick={logout} style={{ marginTop: '1rem' }}>
        Sign Out
      </button>
    </div>
  );
}
