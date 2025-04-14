'use client';

import { useEffect, useState } from "react";

export default function Carrinho() {
  const [user, setUser] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user"));
    if (userStorage) {
      setUser(userStorage);
    }

    const userCarrinho = JSON.parse(userStorage?.userCarrinho || "[]");
    if (userCarrinho) {
      setCarrinho(userCarrinho);
    }
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const fetchedGames = await Promise.all(
          carrinho.map(async (id) => {
            const response = await fetch(`http://localhost:8080/api/games/${id}`);
            if (response.ok) {
              return response.json();
            } else {
              console.error(`Erro ao buscar jogo com ID: ${id}`);
              return null;
            }
          })
        );
        setGames(fetchedGames.filter((game) => game !== null));
      } catch (error) {
        console.error("Erro ao buscar jogos:", error);
      }
    };

    fetchGames();
  }, [carrinho]);

  const handleFinalizarCompra = () => {
    console.log("Compra finalizada com os seguintes jogos:", carrinho);
    const userStorage = JSON.parse(localStorage.getItem("user"));
    const userJogos = JSON.parse(userStorage.userJogos || "[]");
    userJogos.push(...carrinho);
    userStorage.userJogos = userJogos;
    userStorage.userCarrinho = [];
    localStorage.setItem("user", JSON.stringify(userStorage));
    setCarrinho([]);
  };

  const handleRemoverItem = (gameId) => {
    const updatedCarrinho = carrinho.filter((jogo) => jogo !== gameId);
    setCarrinho(updatedCarrinho);

    const updatedGames = games.filter((game) => game.id !== gameId);
    setGames(updatedGames);

    const userStorage = JSON.parse(localStorage.getItem("user"));
    userStorage.userCarrinho = JSON.stringify(updatedCarrinho);
    localStorage.setItem("user", JSON.stringify(userStorage));
  };

  if (!user) {
    return <div>Por favor, faça login para acessar o carrinho.</div>;
  }

  return (
    <div>
      <h1>Carrinho de Compras</h1>

      {carrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              {game.title}
              <button onClick={() => handleRemoverItem(game.id)}>Remover</button>
            </li>
          ))}
        </ul>
      )}

      {carrinho.length > 0 && (
        <button onClick={handleFinalizarCompra}>Finalizar Compra</button>
      )}
    </div>
  );
}
