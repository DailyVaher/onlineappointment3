describe('Online Appointment App', () => {

    let email = Math.random().toString(36).substring(2, 15) + '@example.com';
    let password = Math.random().toString(36).substring(2, 15);

    // Sign Up before the first test
    before(() => {
        cy.visit('http://localhost:4000/');
        cy.get('button[data-bs-toggle="modal"]').contains('Sign Up').click({force: true})
        cy.get('#signUpEmail').type(email)
        cy.get('#signUpPassword').type(password)
        cy.get('.modal-footer button').contains('Sign Up').click({force: true})

        // Verify that the modal is closed
        cy.get('.modal').should('not.be.visible')

    })

    // Log in before each test
    beforeEach(() => {
        cy.visit('http://localhost:4000/');
        cy.get('button[data-bs-toggle="modal"]').contains('Sign In').click({force: true})
        cy.get('#signInEmail').type('test.test@example.com')
        cy.get('#signInPassword').type('password')
        cy.get('.modal-footer button').contains('Sign In').click({force: true})
        cy.get('.modal').should('be.visible') // Ensure the modal is closed
    })

    it('should add meetings', () => {

        // Generate random title and content
        let title = Math.random().toString(36).substring(2, 15);
        let content = Math.random().toString(36).substring(2, 15);

        // Call the Cypress command to add an appointment
        cy.addAppointment(title, content)

    })

    it('should edit meetings', () => {

        // Generate random title and content
        let title = Math.random().toString(36).substring(2, 15);
        let content = Math.random().toString(36).substring(2, 15);

        // Call the Cypress command to add an appointment
        cy.addAppointment(title, content)

        // Get the appointment card by title and content
        cy.get('div.appointment-card:contains("${title}"):contains("${content}")').within(() => {

            // Click the "Edit" button in the appointment card
            cy.get('button[data-cy="openEditAppointmentModal"]').click({force: true})

        });

        // Edit Title and Content
        cy.get('#editAppointmentTitle').type(title + 'Edited', {force: true})
        cy.get('#editAppointmentContent').type(content + 'Edited', {force: true})

        // Click the "Save" button to save the appointment
        cy.get('button[data-cy="btnEditAppointment"]').click({force: true})

    })

    it('should delete meetings', () => {

        // Generate random title and content
        let title = Math.random().toString(36).substring(2, 15);
        let content = Math.random().toString(36).substring(2, 15);

        // Call the Cypress command to add an appointment
        cy.addAppointment(title, content)

        // Get the appointment card by title and content
        cy.get('div.appointment-card:contains("${title}"):contains("${content}")').within(() => {

            // Click the "Delete" button in the appointment card
            cy.get('button[data-cy="openDeleteAppointmentModal"]').click({force: true})

        });

        // Check that the Cancel button works
        cy.get('#deleteAppointmentModal').should('be.visible');
        cy.get('#deleteAppointmentModal .modal-footer button.btn-secondary').click({force: true});
        cy.get('#deleteAppointmentModal').should('not.be.visible');

        // Open the Delete modal again
        cy.get('div.appointment-card:contains("${title}"):contains("${content}")').within(() => {

            // Click the "Delete" button in the appointment card
            cy.get('button[data-cy="openDeleteAppointmentModal"]').click({force: true})

        })

        // Click the "Delete" button to confirm deletion
        cy.get('button[data-cy="btnDeleteAppointment"]').click({force: true});

        // Check that the modal is closed
        cy.get('#deleteAppointmentModal').should('not.be.visible');

        // Check that the appointment card is deleted
        cy.contains('div.appointment-card:contains("${title}"):contains("${content}")').should('not.exist')

    })

    it('should log out', () => {
        // Get the "Sign Out" button
        cy.get('button').contains('Sign Out').click({force: true})

        // Verify that the "Sign In" button is visible
        cy.get('button').contains('Sign In').should('be.visible')
    })

})
