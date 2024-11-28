import React, { useEffect, useState } from "react";

const Carrinho = () => {
  const [user, setUser] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    // Recuperar os dados do usuário do localStorage
    const userStorage = JSON.parse(localStorage.getItem("user"));
    if (userStorage) {
      setUser(userStorage); // Definir o usuário no estado
    }

    // Recuperar o carrinho do usuário (também do localStorage ou de onde você armazenar)
    const userCarrinho = JSON.parse(userStorage.userCarrinho);
    if (userCarrinho) {
      setCarrinho(userCarrinho); // Definir os itens do carrinho no estado
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
              console.error(`Failed to fetch game with ID: ${id}`);
              return null;
            }
          })
        );

        // Filter out null values for failed requests
        setGames(fetchedGames.filter((game) => game !== null));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [carrinho]);

  console.log(games);

  const handleFinalizarCompra = () => {
    // Aqui você pode fazer a chamada para a API de finalização da compra
    console.log("Compra finalizada com os seguintes jogos:", carrinho);
    // Após a compra, limpar o carrinho
    const userStorage = JSON.parse(localStorage.getItem("user"));
    userStorage.userCarrinho = [];
    setCarrinho([]);
  };

  const handleRemoverItem = (gameId) => {
    // Filter out the game from the carrinho
    const updatedCarrinho = carrinho.filter((jogo) => jogo !== gameId);
    setCarrinho(updatedCarrinho);
  
    // Filter out the game from the games array
    const updatedGames = games.filter((game) => game.id !== gameId);
    setGames(updatedGames);
  
    // Update the localStorage
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
};

export default Carrinho;
