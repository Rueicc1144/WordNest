// client/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-content">
        <Link to="/" className="site-title">WordNest</Link>
      </div>
    </header>
  );
};

export default Header;
