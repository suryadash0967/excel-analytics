import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="custom-navbar">
      <div className="navbar-logo">
        <span role="img" aria-label="logo">📊</span>
        <span className="navbar-title">Excel Analytics</span>
      </div>

      <button className="hamburger-btn" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`navbar-links ${isOpen ? "mobile-open" : ""}`}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setIsOpen(false)}>
          Dashboard
        </NavLink>
        <NavLink to="/files" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"} onClick={() => setIsOpen(false)}>
          My Files
        </NavLink>
        <button className="navbar-logout-btn" onClick={() => { handleLogout(); setIsOpen(false); }}>
          Logout
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
