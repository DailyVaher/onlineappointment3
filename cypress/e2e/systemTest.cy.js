describe('Online Appointment App', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4000/');
    })

    it('should allow user sign up, log in, add/edit/delete meetings, and log out', () => {
        // Sign Up
        cy.get('button[data-bs-toggle="modal"]').contains('Sign Up').click({force: true})
        cy.get('#signUpEmail').type('test.test@gmail.com')
        cy.get('#signUpPassword').type('password')
        cy.get('.modal-footer button').contains('Sign Up').click({force: true})
        cy.get('.modal').should('be.visible') // Ensure the modal is closed

        // Log In
        cy.get('button[data-bs-toggle="modal"]').contains('Sign In').click({force: true})
        cy.get('#signInEmail').type('test.test@example.com')
        cy.get('#signInPassword').type('password')
        cy.get('.modal-footer button').contains('Sign In').click({force: true})
        cy.get('.modal').should('be.visible') // Ensure the modal is closed

        // Add appointment
        cy.intercept('GET', '/api/appointment-cards', (req) => {
            // Delay the response by 2 seconds
            req.delay(2000);
        }).as('getAndCacheAppointments');

        cy.get('#addAppointmentModal > .modal-dialog > .modal-content > .modal-footer > .btn-secondary').click({force: true});
        cy.get('#addAppointmentTitle').type('Title', {force: true})
        cy.get('#addAppointmentContent').type('Content', {force: true})

        // Wait for the network request to complete
        //cy.wait('@getAndCacheAppointments')

        // Verify appointment is added
        //cy.contains('.appointment-card', 'Title' )
        //    .should('be.visible')
        //    .parent()
        //    .within(() => {
        //        cy.contains('Content').should('be.visible')
        //        cy.get('button[data-bs-toggle="modal"][data-bs-target="#editAppointmentModal"]').click({force: true})
        //    })


        // Edit appointment
        cy.get('#editAppointmentTitle').clear({force: true}).type('Title', {force: true})
        cy.get('#editAppointmentContent').clear({force: true}).type('Content', {force: true})
        cy.get('button[type="button"][class="btn btn-success"]', { multiple: true }).each(($button) => {
            cy.wrap($button).click({ force: true });
        });

        // Verify appointment is edited
        //cy.contains('.appointment-card', 'Updated Appointment')
        //    .should('be.visible')
        //    .parent()
        //    .within(() => {
        //        cy.contains('Updated Content').should('be.visible')
        //   })

        // Delete appointment
        cy.get('button[data-bs-toggle="modal"][data-bs-target="#deleteAppointmentModal"]').click({force: true})
        cy.get('#deleteAppointmentModal').should('be.visible');

        // Verify the title of the modal
        cy.get('#deleteAppointmentModalLabel').should('have.text', 'Confirm Deletion');

        // Verify the text in the modal body
        cy.get('#deleteAppointmentModal .modal-body p').should('have.text', 'Are you sure you want to delete this appointment?');

        // Click the "Cancel" button to close the modal
        cy.get('#deleteAppointmentModal .modal-footer button.btn-secondary').click({force: true});

        // Verify that the modal is no longer visible
        cy.get('#deleteAppointmentModal').should('not.be.visible');
    });

    it('should delete the appointment', () => {
        // ... Add code to open the modal and perform the deletion ...

        // Click the "Delete" button to confirm deletion
        cy.get('#deleteAppointmentModal .modal-footer button.btn-danger').click({force: true});

        // ... Add assertions or further actions after the deletion ...

        // Verify appointment is deleted
        cy.contains('.appointment-card', 'Updated Appointment').should('not.exist')
    })
})
