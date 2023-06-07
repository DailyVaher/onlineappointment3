describe('Creating a user to be able to add appointment', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000');
    });
    it('should sign up user with valid credentials', () => {
        cy.get('button').contains('Sign Up').click();
        cy.get('#signUpEmail').type('test.test@gmail.com');
        cy.get('#signUpPassword').type('Passw0rd');
        cy.get('#signUpModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
    });
    it('should log in a user perform different tasks with appointments and sign out', () => {
        cy.get('button').contains('Sign In').click();
        cy.get('#signInEmail').type('test.test@gmail.com');
        cy.get('#signInPassword').type('Passw0rd');
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
        cy.wait(1500);
        cy.get('button').contains('Add Appointment').click();
        cy.get('#addAppointmentTitle').type('Title');
        cy.get('#addAppointmentContent').type('Content');
        cy.get('#addAppointmentModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
        cy.wait(1500);
        cy.get('.recipe-card').should('contain', 'Title');
        cy.wait(1500);
        cy.get(':nth-child(2) > .btn').click();
        cy.get('#editAppointmentTitle').type('2');
        cy.get('#editAppointmentContent').type('2');
        cy.get('#editAppointmentModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
        cy.wait(1500);
        cy.get('.appointment-card').should('contain', 'Title 2');
        cy.get(':nth-child(2) > .btn-close').click();
        cy.wait(1500);
        cy.get('.appointment-card').should('not.contain', 'Title 2');
        cy.get('button').contains('Sign Out').click();
        cy.wait(1500);
    });
});
