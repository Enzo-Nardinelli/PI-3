"use client";
import GameList from '../components/gameListComponent.js';
import SearchBar from '../components/searchBarComponent.js';
import './style.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
        // Retrieve the stored JSON string
    const userJson = localStorage.getItem('user');
    
    const fetchGames = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/games'); // Replace with your backend URL if hosted
        const data = await response.json();
        setGames(data); // Update the games state with fetched data
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchGames();
  }, []);

  const handleClickNav = () => {
    navigate("/users");
  }

  // Filter games based on search query
  // const filteredGames = games.filter((game) =>
  //   game.title.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="app">
        <header className="header">
        {/* Logo à esquerda */}
        <div className="nav-logo">
          <img src="/imagens/logo.jpg" height="30" width="30" alt="Logo" />
        </div>

        {/* Itens de navegação no meio */}
        <ul className="nav-list">
          <div onClick={() => {navigate("/backofficelogin")}}>.</div>
        </ul>

        {/* Carrinho e usuário à direita */}
        <div className="nav-icons">
          <li className="nav-item">
            <img src="/imagens/carrinho.png" height="20" width="20" alt="Carrinho" onClick={handleClickCarrinho} />
          </li>
          <li className="nav-item" id="loginAcesso">
            <img src="/imagens/user.png" height="20" width="20" alt="User" onClick={handleClickUser} />
          </li>
          {/* Link para a página de editar usuário */}
          <li className="nav-item">
            <Link href="/edituser">
              <img src="/imagens/edit.png" height="20" width="20" alt="Editar Usuário" />
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/editPedido">
              <img src="/imagens/menu-hamburguer.png" height="20" width="20" alt="Ver pedidos" />
            </Link>
          </li>
        </div>
      </header>
      <main>
        {/* <h1 className="page-title">LOJA</h1> */}
        <div className="navBar">
            <ul className="navTeste">
              <li className="navBugado">Populares</li>
              <li className="navBugado">Lista personalisada</li>
              <li className="navBugado">Novidades</li>
              <li className="navBugado">Categorias</li>
              <li className="navBugado">Preços</li>
              <li className="navBugado" onClick={handleClickNav}>Usuários</li>
           </ul>
          <SearchBar handleSearch={setSearchQuery} />
        </div>
        <div className="gameListDiv">
          <h4>JOGOS</h4>
          {/* <GameList games={filteredGames} /> */}
          <GameList games={games} />
        </div>
      </main>
    </div>
  );
}

export default Home;
