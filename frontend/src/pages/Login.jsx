import { useState } from 'react';
import loginImg from '../assets/images/login-img.png';
import axios from 'axios';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash  } from "react-icons/fa";
import googleLogo from '../assets/images/google-logo.png';
import { useEffect } from "react";

function Login() {
  useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password, role
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setErrors({ api: err.response?.data?.error || 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/google?role=${role}`;
  };

  return (
    <div className='login-wrapper'>
      <div className="login-container">

        <div className="login-left">
          <img src={loginImg} alt="Login Visual" />
        </div>

        <div className="login-right">
          <h2 className='login-head'>
            <span role="img" aria-label="logo">
              📊
            </span>
            {" "}Excel Analytics</h2>
          <h3 style={{ marginBottom: "2rem", fontWeight: '500' }}>Good To See You Again!</h3>

          <div className="role-selector">
            <div
              className={`role-box ${role === 'user' ? 'selected' : ''}`}
              onClick={() => setRole('user')}
            >
              <div className="role-icon"><FaUser /></div>
              <div className="role-label">User</div>
            </div>
            <div
              className={`role-box ${role === 'admin' ? 'selected' : ''}`}
              onClick={() => setRole('admin')}
            >
              <div className="role-icon"><MdAdminPanelSettings /></div>
              <div className="role-label">Admin</div>
            </div>
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div className="password-input-container" style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <span
              className="password-toggle"
              style={{
                position: 'absolute',
                right: 10,
                top: '40%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '1.1em',
                color: '#000',
                userSelect: 'none'
              }}
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="oauth-buttons">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              Or Sign In with <img src={googleLogo} alt="" />
            </button>
          </div>

          {errors.api && <div className="error-message">{errors.api}</div>}

          <p className="redirect-text">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;