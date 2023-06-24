describe('Counter App', () => {
  it('increments the counter', () => {
    cy.visit('evals/eval-001/app/index.html');

    cy.get('#count').should('contain', '0');

    cy.get('#incrementBtn').click();

    cy.get('#count').should('contain', '1');
  });
});
