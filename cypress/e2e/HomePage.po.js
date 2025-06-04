class HomePage {

    visit(){
        cy.visit('http://localhost:3000/');
    }

    getLoginIcon(){
        return cy.get('#loginAcesso');
    }
}

export default new HomePage;