// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('addAppointment', (title, content) => {

    // Open add appointment modal
    //cy.get('button[data-cy="btnOpenAddAppointmentModal"]').click({force: true})
    cy.get('button[data-cy="btnAddAppointment"]').click({force: true})


    // Fill Title and Content
    cy.get('#addAppointmentTitle').type(title, {force: true})
    cy.get('#addAppointmentContent').type(content, {force: true})

    // Click the "Add" button to add the appointment
    //cy.get('button[data-cy="btnAddAppointment"]').click({force: true)
    cy.get('[data-cy="btnAddAppointment"]').click({force: true})

    // Verify that this appointment appeared

    // Use template literals
    cy.contains(`div.appointment-card:contains("${title}"):contains("${content}")`);


})
