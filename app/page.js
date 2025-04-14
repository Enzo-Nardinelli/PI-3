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
import UsersList from "./userlist/page";

export default function Inicio() {
  return (
    <Router>
        <Routes>
<<<<<<< Updated upstream
<<<<<<< HEAD
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
=======
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
>>>>>>> 0ad85f46f510b6b4107a268fdecde726dbda565e
=======
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
>>>>>>> Stashed changes
          <Route path="/gameregister" element={<GameRegister />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/carrinho" element={<Carrinho/>} />
          <Route path="/carrinho2" element={<CartPage/>} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
    </Router>
    )
}  
