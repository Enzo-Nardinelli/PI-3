import { useState } from "react";
import { cadastarUsuario } from "../services/cadastrarUsuarios";



export function useCadastro(){
    const [email,setEmail] = useState(''); 
    const [password,setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await cadastarUsuario({email, password});
            window.location.href = '/boas-vindas'
        } catch (error) {
            
        }

    }

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleSubmit
    }

}
