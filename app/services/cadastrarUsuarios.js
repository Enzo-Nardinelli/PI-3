export async function cadastarUsuario(dadosDoUsuario){
    const response = await fetch("http://localhost:8080/users/add-user",{
        method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify(dadosDoUsuario)
            
    });

    if(!response.ok){
        console.log("Falha na requisição");
    } 
    else{
        alert("deu bom");
    }

    return response.json();
} 