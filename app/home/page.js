// src/App.js
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
    { id: 4, title: 'Red Dead Redemption 2', image: 'https://via.placeholder.com/200', price: 59.99 },
    { id: 5, title: 'Halo Infinite', image: 'https://via.placeholder.com/200', price: 29.99 },
    { id: 6, title: 'Cyberpunk 2077', image: 'https://via.placeholder.com/200', price: 59.99 },
    { id: 7, title: 'The Witcher 3', image: 'https://via.placeholder.com/200', price: 39.99 },
    { id: 8, title: 'Elden Ring', image: 'https://via.placeholder.com/200', price: 49.99 },
    // Add more games here...
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
        <h1 className="page-title">Steam Game Store</h1>
        <SearchBar handleSearch={setSearchQuery} />
        <div className="gameListDiv">
          <GameList games={filteredGames} />
        </div>
      </main>
    </div>
  );
}

export default Home;
