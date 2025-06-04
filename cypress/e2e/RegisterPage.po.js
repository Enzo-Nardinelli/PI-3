class RegisterPage {

    getUsername(){
        return cy.get("#username");
    }

    getEmail(){
        return cy.get("#email");
    }

    getPassword1(){
        return cy.get("#password1");
    }

    getPassword2(){
        return cy.get("#password2");
    }

    getGender(){
        return cy.get("#genderSelect");
    }

    getDate(){
        return cy.get("#date");
    }

    getCep(){
        return cy.get("#cep");
    }

    getNumber(){
        return cy.get("#numero");
    }

    goToLogin(){
        cy.get('#loginAcesso').click();
    }

    getRegisterSubmitButton(){
        return cy.get("#registerSubmitButton");
    }
}

export default new RegisterPage;