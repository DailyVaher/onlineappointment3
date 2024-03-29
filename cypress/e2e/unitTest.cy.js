describe('View signIn/signUp page', () => {
    it('Test viewing the signIn/signUp page', () => {
        cy.visit('http://localhost:4000');
        cy.get('.text-center > .row > :nth-child(1)').should('contain', 'Sign Up');
        cy.get('.text-center > .row > :nth-child(2)').should('contain', 'Sign In');
    });
});

describe('Pre-existed user login with invalid and valid credentials', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000');
    });

    it('should not login if email is incorrect', () => {
        cy.intercept('POST', '/sessions').as('signInRequest');
        cy.get('.text-center > .row > :nth-child(2)').contains('Sign In').click();
        cy.get('#signInEmail').type('admin.admin@gmail.com');
        cy.get('#signInPassword').type('admin123');
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
    });

    it('should not login if password is incorrect', () => {
        cy.intercept('POST', '/sessions').as('signInRequest');
        cy.get('.text-center > .row > :nth-child(2)').contains('Sign In').click();
        cy.get('#signInEmail').type('admin');
        cy.get('#signInPassword').type('Passw0rd');
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
    });

    it('should log in a user successfully with correct credentials', () => {
        // cy.intercept('POST', '/sessions').as('signInRequest');
        cy.get('.text-center > .row > :nth-child(2)').contains('Sign In').click();
        cy.get('#signInEmail').type('admin');
        cy.get('#signInPassword').type('KollneKollne');
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
    });
});
