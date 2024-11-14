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

export default function Inicio() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gameregister" element={<GameRegister />} />
        <Route path="/game/:id" element={<GameDetails />} />
      </Routes>
    </Router>
      
    )
}  
