describe('Adding appointments as existing user', () => {
    it('should log in a user and create a new appointment successfully', () => {
        cy.visit('http://localhost:4000/');
        cy.get('button').contains('Sign In').click({force: true});
        cy.wait(2000);
        cy.get('#signInEmail').type('admin')
        cy.get('#signInPassword').type('KollneKollne')
        cy.get('#signInModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click({force: true});
        cy.wait(2000);
        cy.get('button').contains('Add Appointment').click({force: true});
        cy.wait(2000);
        cy.get('#addAppointmentTitle').type('Appointment 1', {force: true})
        cy.get('#addAppointmentContent').type('This is an example of an appointment', {force: true})
        cy.get('#addAppointmentModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click({force: true});
        cy.wait(2000);
    });
});
