"use client";
import Header from '../components/headerComponent.js';
import GameList from '../components/gameListComponent.js';
import SearchBar from '../components/searchBarComponent.js';
import './style.css';
import React, { useState, useEffect } from 'react';

function Home() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    
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
          <h4>JOGOS</h4>
          <GameList games={filteredGames} />
        </div>
      </main>
    </div>
  );
}

export default Home;
