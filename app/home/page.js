"use client";
import React, { useState } from 'react';
import Header from '../components/headerComponent.js';
import GameList from '../components/gameListComponent.js';
import SearchBar from '../components/searchBarComponent.js';
import './style.css';

function Home() {
  const games = [
    { id: 1, title: 'Cyberpunk 2077', image: 'https://via.placeholder.com/200', price: 59.99 },
    { id: 2, title: 'The Witcher 3', image: 'https://via.placeholder.com/200', price: 39.99 },
    { id: 3, title: 'Elden Ring', image: 'https://via.placeholder.com/200', price: 49.99 },
    { id: 4, title: 'Red Dead Redemption 2', image: 'https://via.placeholder.com/200', price: 59.99 }
  ];

  const [searchQuery, setSearchQuery] = useState('');

  // Filter games based on search query
  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <Header />
      <main>
        {/* <h1 className="page-title">LOJA</h1> */}
        <div className="navBar">
            <ul className="navTeste">
              <li className="navBugado">Populares</li>
              <li className="navBugado">Lista personalisada</li>
              <li className="navBugado">Novidades</li>
              <li className="navBugado">Categorias</li>
              <li className="navBugado">Preços</li>
           </ul>
          <SearchBar handleSearch={setSearchQuery} />
        </div>
        <div className="gameListDiv">
          <h4>MAIS POPULARES</h4>
          <GameList games={filteredGames} />
          <h4>LISTA PERSONALISADA</h4>
          <GameList games={filteredGames} />
          <h4>NOVIDADES</h4>
          <GameList games={filteredGames} />
        </div>
      </main>
    </div>
  );
}

export default Home;
