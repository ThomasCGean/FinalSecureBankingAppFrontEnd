import { useEffect, useState } from 'react';
import { getToken } from '../auth';

export default function Statements() {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError("You must be logged in to view statements.");
      return;
    }

    fetch('https://06opu6k427.execute-api.us-east-1.amazonaws.com/prod/statement', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const message = await res.text();
          throw new Error(`API Error: ${res.status} – ${message}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Raw API response:", data); // optional debug

        // Use the object directly (no double parsing)
        if (data?.url) {
          setUrl(data.url);
        } else {
          setError("Statement URL not found in response.");
        }
      })
      .catch((err) => {
        console.error('Error fetching statement:', err);
        setError("Failed to retrieve statement. Please try again later.");
      });
  }, []);

  return (
    <div>
      <h2>Your Bank Statement</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {url ? (
        <p>
          Click the following link to view your statement (expires in 5 minutes):{" "} 
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Statement
          </a>
        </p>
      ) : !error ? (
        <p>Loading statement...</p>
      ) : null}
    </div>
  );
}
