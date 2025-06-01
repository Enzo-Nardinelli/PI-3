import React from 'react';
import { useNavigate } from 'react-router-dom';

function LinksPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Links</h2>
      <ul>
        <li>
          <a onClick={()=>{navigate("/backofficecadastro")}} target="_blank" rel="noreferrer">Cadastrar Usuário</a>
        </li>
        <li>
          <a onClick={()=>{navigate("/gameregister")}} target="_blank" rel="noreferrer">Cadastrar Produto</a>
        </li>
      </ul>
    </div>
  );
}

export default LinksPage;
