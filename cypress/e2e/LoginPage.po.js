class LoginPage {

    getRegisterButton(){
        return cy.get("#registerAcesso");
    }

    typeEmail(email){
        cy.get("#emailField").type(email);
    }

    typePassword(password){
        cy.get("#passwordField").type(password);
    }

    getLoginSubmitButton(){
        return cy.get("#loginSubmitButton");
    }

}

export default new LoginPage ;