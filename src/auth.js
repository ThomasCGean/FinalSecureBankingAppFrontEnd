// src/auth.js
export function redirectToLogin() {
    const base = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirect = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    const scope = 'openid email';
    const responseType = 'code';
  
    const url = `${base}/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirect)}`;
  
    window.location.href = url;
  }
  
  export async function exchangeCodeForToken(code) {
    const base = import.meta.env.VITE_COGNITO_DOMAIN;
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const redirect = import.meta.env.VITE_COGNITO_REDIRECT_URI;
  
    const res = await fetch(`${base}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirect,
      }),
    });
  
    const data = await res.json();
    if (data.id_token) {
      localStorage.setItem('id_token', data.id_token);
    }
  
    return data;
  }
  
  export function getToken() {
    return localStorage.getItem('id_token');
  }
  
  export function logout() {
    localStorage.removeItem('id_token');
    const base = import.meta.env.VITE_COGNITO_DOMAIN;
    const redirect = import.meta.env.VITE_COGNITO_REDIRECT_URI;
    window.location.href = `${base}/logout?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&logout_uri=${redirect}`;
  }
  