import { Link, useNavigate } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import logo from "../assets/logo-full.png";
import "./Navbar.css";

function Navbar({ isLoggedIn = true, userInitial = "U" }) {
  const navigate = useNavigate();

  return (
    <nav className="cf-navbar">
      <Link to="/home" className="cf-navbar-logo">
        <img src={logo} alt="CampusFind" />
      </Link>

      {isLoggedIn ? (
        <>
          <div className="cf-navbar-search">
            <Search size={16} />
            <input type="text" placeholder="Search for object..." />
          </div>
          <div className="cf-navbar-icons">
            <Bell size={20} />
            <div className="cf-navbar-avatar">{userInitial}</div>
          </div>
        </>
      ) : (
        <>
          <ul className="cf-navbar-links">
            <li onClick={() => navigate("/lost-items")}>Lost Items</li>
            <li onClick={() => navigate("/found-items")}>Found Items</li>
            <li onClick={() => navigate("/about")}>About</li>
            <li onClick={() => navigate("/faq")}>FAQ</li>
          </ul>
          <div className="cf-navbar-guest-btns">
            <button className="btn-outline" onClick={() => navigate("/login")}>Login</button>
            <button className="btn-solid" onClick={() => navigate("/register")}>Register</button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;