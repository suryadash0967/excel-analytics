import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Files from './pages/Files';
import ExcelStats from './components/ExcelStats';
import Navbar from './components/Navbar';
import './App.css';
import { useEffect } from 'react';

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);
  useEffect(() => {
    if (location.pathname === "/") {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/files" element={<Files />} />
        <Route path="/files/:id" element={<ExcelStats />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
