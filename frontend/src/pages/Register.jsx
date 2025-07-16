import { useEffect, useState } from 'react';
import loginImg from '../assets/images/login-img.png';
import { MdAdminPanelSettings } from "react-icons/md";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import googleLogo from "../assets/images/google-logo.png";
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
  }, []);


  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role
      });
      window.location.href = '/login';
    } catch (err) {
      setErrors({ api: err.response?.data?.error || 'Register failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-wrapper'>
      <div className="login-container">

        <div className="login-left">
          <img src={loginImg} alt="Register Visual" />
        </div>

        <div className="login-right">
          <h2 className='login-head'>
            <span role="img" aria-label="logo">
              📊
            </span>
            {" "}Excel Analytics</h2>
          <h3 style={{ marginBottom: "2rem", fontWeight: '500' }}>Welcome Aboard!</h3>

          {/* Role Selector */}
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
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ paddingRight: '40px' }}
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
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="oauth-buttons">
            <button
              type="button"
              onClick={() => window.location.href = `http://localhost:5000/api/auth/google?role=${role}`}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              Or Sign Up with <img src={googleLogo} alt="" />
            </button>
          </div>

          {errors.api && <div style={{ color: 'red', marginTop: 8 }}>{errors.api}</div>}

          <p className="redirect-text">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;
