import { useEffect, useState } from 'react';
import { getToken } from '../auth';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setError('You must be logged in to view transactions.');
      setLoading(false);
      return;
    }

    fetch('https://06opu6k427.execute-api.us-east-1.amazonaws.com/prod/transactions', {
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
        setTransactions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="page-container">Loading transactions...</p>;
  if (error) return <p className="page-container" style={{ color: 'red' }}>{error}</p>;
  if (transactions.length === 0) return <p className="page-container">No transactions found.</p>;

  return (
    <div className="page-container">
      <h2>Your Recent Transactions</h2>
      <table style={{ width: '100%', maxWidth: '900px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
            <th>Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Transaction ID</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.transaction_id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{new Date(tx.timestamp).toLocaleString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</td>
              <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
              <td>{tx.description}</td>
              <td>${tx.amount.toFixed(2)}</td>
              <td style={{ fontSize: '0.85em', color: '#666' }}>{tx.transaction_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
