import HomePage from './HomePage.po.js';
import LoginPage from './LoginPage.po.js';
import RegisterPage from './RegisterPage.po.js';

describe('Teste de validação de campos vazios, Cadastro', () => {
    const testeVariation = Math.floor(Math.random() * 999 + 1).toString();
    beforeEach(()=>{
        const alertText = cy.stub();
        cy.on('window:alert', alertText);

        HomePage.visit();
        HomePage.getLoginIcon().click();

        LoginPage.getRegisterButton().click();
    });

    it('Name field empty', () => {
        // RegisterPage.getUsername().type(" ");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.url().should('include', '/register');
    })

    it('Email field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        // RegisterPage.getEmail().type(" ");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    })

    it('Password field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type(" ");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    })

    it('Gender field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        // RegisterPage.getGender().select(" ");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    })

    it('Date field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        // RegisterPage.getDate().type(" ");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    })

    it('CEP field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        // RegisterPage.getCep().type(" ");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    })

    it('Number field empty', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        // RegisterPage.getNumber().type(" ");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    }) 

    it('Number field empty (Space key)', () => {
        RegisterPage.getUsername().type("Teste teste");
        RegisterPage.getEmail().type("teste"+testeVariation+"@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type(" ");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click();
        cy.wait(1000);
        cy.url().should('include', '/register');
    }) 
  })