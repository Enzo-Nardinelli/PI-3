'use client'
import Form from "../components/formComponent"
import { useCadastro } from "../hooks/useCadastro"

export default function Cadastro() {
    const {email, setEmail, password, setPassword, handleSubmit} = useCadastro()
    return(
        <div>
            <h3>Cadastrar-se</h3>
            <Form
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
            />
        </div>
    )
}