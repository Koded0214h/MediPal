import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import './styles/login.css'
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CirclePage from './pages/CirclePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element ={<Dashboard />}/>
        <Route path="/circle" element={<CirclePage />} />
      </Routes>
    </Router>
  );
}

export default App; 
