describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

describe('Teste API usuarios, Registro', () => {
  it('Deve retornar sucesso', () => {
    const userData = {
      username: "Teste",
      email: "Teste",
      password: "Teste",
      genero: "Teste",
      dataNascimento: "Teste",
      enderecoFaturamento: {
        cep: "Teste",
        logradouro: "Teste",
        numero: "Teste",
        bairro: "Teste",
        cidade: "Teste",
        uf: "Teste"
      }
    };
    cy.request({
      method: "POST",
      url:"http://localhost:8080/api/auth/register",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.eq("Usuario registrado");
    });
  })
})