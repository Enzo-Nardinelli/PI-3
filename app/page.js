'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Home from "./home/page";
import Cadastro from "./register/page";
import Form from "./components/formComponent";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./login/page";
import Register from "./register/page";
import GameRegister from "./gameregister/page";
import GameDetails from "./GameDetails/page";
import { AuthProvider } from "./authProvider/authProvider";
import Carrinho from "./carrinho/page";
import CartPage from "./carrinho2/cartPage";
import edituser from "./edituser/page";
import EnderecoPage from "./carrinho2/EnderecoPage";
import PagamentoPage from "./carrinho2/PagamentoPage";
import ResumoPedido from "./carrinho2/ResumoPedido";
import EditPedido from "./editPedido/page";
import LoginPage from "./Backoffice/login";
import LinksPage from "./Backoffice/principal";
import RegisterPage from "./Backoffice/cadastrar";

export default function Inicio() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gameregister" element={<GameRegister />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/carrinho" element={<Carrinho/>} />
          <Route path="/carrinho2" element={<CartPage/>} />
          <Route path="/edituser" element={<edituser/>} />
          <Route path="/endereco" element={<EnderecoPage />} />
          <Route path="/pagamento" element={<PagamentoPage />} />
          <Route path="/resumo" element={<ResumoPedido />} />
          <Route path="/editPedido" element={<EditPedido/>} />
          <Route path="/backofficelogin" element={<LoginPage />} />
          <Route path="/backofficeprincipal" element={<LinksPage />} />
          <Route path="/backofficecadastro" element={<RegisterPage/>} />
        </Routes>
      </Router>
    )
}
