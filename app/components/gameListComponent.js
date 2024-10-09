// src/components/GameList.js
import React from 'react';
import GameCard from './gameCardComponent';
import './gameListComponent.css';

const GameList = ({ games }) => {
    return (
      <div className="game-list">
        {games.length > 0 ? (
          games.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p>No games found</p>
        )}
      </div>
    );
  };

export default GameList;