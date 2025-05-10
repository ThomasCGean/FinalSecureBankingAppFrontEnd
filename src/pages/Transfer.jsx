import { useState } from 'react';
import { getToken } from '../auth';

export default function Transfer() {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'deposit',
    description: '',
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    const token = getToken();
    if (!token) {
      setError('You must be logged in to initiate a transfer.');
      setLoading(false);
      return;
    }

    const { amount, type, description } = formData;
    const payload = {
      amount: parseFloat(amount),
      type,
      description: description || undefined,
    };

    try {
      const res = await fetch('https://06opu6k427.execute-api.us-east-1.amazonaws.com/prod/transfer', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Transfer failed.');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Transfer Funds</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div style={{ color: 'green', marginBottom: '1rem' }}>
          <p><strong>{result.message}</strong></p>
          <p>New Balance: <strong>${result.balance.toFixed(2)}</strong></p>
          <p>Transaction ID: <code>{result.transaction.transaction_id}</code></p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}
      >
        <label>
          Amount:
          <input
            type="number"
            name="amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Type:
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </label>

        <label>
          Description (optional):
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit Transfer'}
        </button>
      </form>
    </div>
  );
}
