describe('Adding appointments as existing user', () => {
    it('should log in a user and create a new appointment successfully', () => {
        cy.visit('http://localhost:4000');
        cy.get('button').contains('Sign In').click();
        cy.get('#signInEmail').type('admin');
        cy.get('#signInPassword').type('admin123');
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click();
        cy.wait(2000);
        cy.get('button').contains('Add Appointment').click();
        cy.get('#addAppointmentTitle').type('Title');
        cy.get('#addAppointmentContent').type('Content');
        cy.get('#addAppointmentModal > .modal-dialog > .modal-content > .modal-footer > .btn-success').click({ force: true });
        cy.wait(2000);
        cy.get('.appointment-card').should('contain', 'Title');
    });
});
