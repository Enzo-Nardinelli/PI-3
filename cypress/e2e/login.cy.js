import HomePage from './HomePage.po.js';
import LoginPage from './LoginPage.po.js';
import RegisterPage from './RegisterPage.po.js';

describe('Teste de cadastro e autenticação, Cadastro', () => {
    
    before (()=>{
        const alertText = cy.stub()
        cy.on('window:alert', alertText)

        HomePage.visit();
        HomePage.getLoginIcon().click();

        LoginPage.getRegisterButton().click();

        RegisterPage.getUsername().type("Teste Teste");
        RegisterPage.getEmail().type("teste@gmail.com");
        RegisterPage.getPassword1().type("123");
        RegisterPage.getPassword2().type("123");
        RegisterPage.getGender().select("masculino");
        RegisterPage.getDate().type("1111-11-11");
        RegisterPage.getCep().type("05010040");
        RegisterPage.getNumber().type("111");
        cy.wait(1000);
        RegisterPage.getRegisterSubmitButton().click().then(()=>{
            expect(alertText.getCall(0)).to.be.calledWith("Register ok");
        })

        LoginPage.typeEmail("teste@gmail.com");
        LoginPage.typePassword("123");
        LoginPage.getLoginSubmitButton().click().then(()=>{
            expect(alertText.getCall(1)).to.be.calledWith("Login ok");
        })



    });

    it('Navega para a página de Login', () => {
      
    })
  })