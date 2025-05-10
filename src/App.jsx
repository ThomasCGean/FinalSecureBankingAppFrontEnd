import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Statements from './pages/Statements';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import CallbackHandler from './pages/CallbackHandler'; // ✅ You need this import

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/statements">Statements</Link> |{" "}
        <Link to="/transactions">Transactions</Link> |{" "}
        <Link to="/transfer">Transfer</Link>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<CallbackHandler />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
