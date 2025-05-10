import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Statements from './pages/Statements';
import Transactions from './pages/Transactions';
import Transfer from './pages/Transfer';
import CallbackHandler from './pages/CallbackHandler';
import './layout.css'; // ✅ Import the layout styles here

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', textAlign: 'center' }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/profile">Profile</Link> |{" "}
        <Link to="/statements">Statements</Link> |{" "}
        <Link to="/transactions">Transactions</Link> |{" "}
        <Link to="/transfer">Transfer</Link>
      </nav>

      {/* ✅ Apply page layout wrapper globally */}
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<CallbackHandler />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/statements" element={<Statements />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transfer" element={<Transfer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
