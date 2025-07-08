import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Files from './pages/Files';
import ExcelStats from './components/ExcelStats';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/files" element={<Files />} />
        <Route path="/files/:id" element={<ExcelStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
