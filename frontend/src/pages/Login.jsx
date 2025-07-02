import { useState } from 'react';
import loginImg from '../assets/images/login-img.png';
import axios from 'axios';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}?role=${role}`;
  };


  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      const { token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      window.location.href = role === 'admin' ? '/admin' : '/dashboard';
    } catch (err) {
      const message = err.response?.data?.msg || 'Login failed';
      alert(message);
      console.error('Login error:', err);
    }
  };



  return (
    <div className="login-container">
      <div className="login-left">
        <img src={loginImg} alt="Login Visual" />
      </div>

      <div className="login-right">
        <h2>Login to Excel Analytics</h2>

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>or login with</p>
        <div className="oauth-buttons">
          <button onClick={() => handleOAuth('google')}>Google</button>
        </div>

        <p className="redirect-text">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
