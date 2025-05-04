import React from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; 


const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Replaced logo img with text or placeholder */}
      <div className="logo">
         <img src={logo} alt="BG Logo" />
      </div>

      
      <div className="desktopmenu">
         <Link to="/" className="desktopMenuItemList">Home</Link>
         <Link to="/about" className="desktopMenuItemList">About</Link>
         <Link to="/experience" className="desktopMenuItemList">Experience</Link>
         <Link to="/portfolio" className="desktopMenuItemList">Portfolio</Link>

      </div>
      
     {/* <button className="desktopMenuButton">
        Contact
      </button>*/}
    </nav>
  );
};

export default Navbar;