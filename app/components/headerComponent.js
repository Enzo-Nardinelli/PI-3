"use client";
import React from 'react';
import './headerComponent.css';
import Link from 'next/link';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleClickCarrinho = () => {
    console.log("Redirecionando para o carrinho");
    navigate("/carrinho2");
  };

  const handleClickUser = () => {
    console.log("Redirecionando para o login");
    navigate("/login");
  };

  const handleClickUser2 = () => {
    console.log("Redirecionando para o user");
    navigate("/edituser");
  };

  return (
    <header className="header">
      {/* Logo à esquerda */}
      <div className="nav-logo">
        <img src="/imagens/logo.jpg" height="30" width="30" alt="Logo" />
      </div>

      {/* Itens de navegação no meio */}
      <ul className="nav-list">
        <li className="nav-item">LOJA</li>
        <li className="nav-item">BIBLIOTECA</li>
        <li className="nav-item">COMUNIDADE</li>
        <li className="nav-item">AMIGOS</li>
      </ul>

      {/* Carrinho e usuário à direita */}
      <div className="nav-icons">
        <li className="nav-item">
          <img src="/imagens/carrinho.png" height="20" width="20" alt="Carrinho" onClick={handleClickCarrinho} />
        </li>
        <li className="nav-item">
          <img src="/imagens/user.png" height="20" width="20" alt="User" onClick={handleClickUser} />
        </li>
        {/* Link para a página de editar usuário */}
        <li className="nav-item">
          <img src="/imagens/edit.png" height="20" width="20" alt="Editar Usuário" onClick={handleClickUser2}/>
        </li>
      </div>
    </header>
  );
};

export default Header;
