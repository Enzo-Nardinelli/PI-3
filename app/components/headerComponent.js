"use client";
import React from 'react';
import './headerComponent.css';
import logo from "../imagens/logo.jpg";


console.log(logo);

const Header = () => {
  return (
    <header className="header">
        <ul className="nav-list">
         <img src={logo} height="20" width="20"/>
          <li className="nav-item">LOJA</li>
          <li className="nav-item">BIBLIOTECA</li>
          <li className="nav-item">COMUNIDADE</li>
          <li className="nav-item">AMIGOS</li>
        </ul>
    </header>
  );
};

export default Header;
