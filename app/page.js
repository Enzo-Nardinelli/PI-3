'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Home from "./home/page";
import Cadastro from "./register/page";
import Form from "./components/formComponent";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./login/page";
import Register from "./register/page";
 
export default function Inicio() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    )
}
