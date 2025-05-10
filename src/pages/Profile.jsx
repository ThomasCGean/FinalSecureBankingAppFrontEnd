import { useEffect, useState } from 'react';
import { getToken } from '../auth';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    preferredLanguage: '',
    paperless: false,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('You must be logged in to view your profile.');
      setLoading(false);
      return;
    }

    fetch('https://06opu6k427.execute-api.us-east-1.amazonaws.com/prod/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`GET error: ${res.status} - ${msg}`);
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setFormData({
          preferredLanguage: data["Preferred Language"] || '',
          paperless: data["Paperless"] || false,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load profile.');
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUpdate = () => {
    setError(null);
    setMessage(null);
    const token = getToken();
    if (!token) {
      setError('You must be logged in to update your profile.');
      return;
    }

    fetch('https://06opu6k427.execute-api.us-east-1.amazonaws.com/prod/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preferredLanguage: formData.preferredLanguage,
        paperless: formData.paperless,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`PUT error: ${res.status} - ${msg}`);
        }
        return res.json();
      })
      .then(() => {
        setMessage('Preferences updated successfully.');
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to update preferences.');
      });
  };

  if (loading) return <p className="page-container">Loading profile...</p>;

  return (
    <div className="page-container">
      <h2>Your Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {profile && (
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <label>
            Name:
            <input
              type="text"
              value={`${profile.FirstName || ''} ${profile.LastName || ''}`}
              disabled
            />
          </label>
          <label>
            Email:
            <input type="text" value={profile.Email || ''} disabled />
          </label>
          <label>
            Preferred Language:
            <input
              type="text"
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
            />
          </label>
          <label>
            Paperless Communication:
            <input
              type="checkbox"
              name="paperless"
              checked={formData.paperless}
              onChange={handleChange}
            />
          </label>
          <button type="button" onClick={handleUpdate}>
            Update Preferences
          </button>
        </form>
      )}
    </div>
  );
}
