// src/components/Header.js
import React from 'react';
import './headerComponent.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">Loja</li>
          <li className="nav-item">Biblioteca</li>
          <li className="nav-item">Comunidade</li>
          <li className="nav-item">Amigos</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
