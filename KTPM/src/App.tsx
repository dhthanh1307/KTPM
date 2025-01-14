import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Event from './Component/Event';
import Promotion from './Component/Promotion';
import Report from './Component/Report';
import Account from './Component/Account';
import Login from './Component/Login';
import Register from './Component/Register';
import PrivateRoute from './Component/ProctectedRoute'; // Import PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Các route yêu cầu đăng nhập */}
        <Route 
          path="/event" 
          element={<PrivateRoute element={<Event />} />} 
        />
        <Route 
          path="/promotion" 
          element={<PrivateRoute element={<Promotion />} />} 
        />
        <Route 
          path="/report" 
          element={<PrivateRoute element={<Report />} />} 
        />
        <Route 
          path="/account" 
          element={<PrivateRoute element={<Account />} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
