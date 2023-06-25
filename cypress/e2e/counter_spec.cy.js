describe("Counter App", () => {
  it("increments the counter", () => {
    cy.visit(`/output/eval-001/app/${Cypress.env("evalId")}/index.html`);

    cy.get("#count").should("contain", "0");

    cy.get("#incrementBtn").click();

    cy.get("#count").should("contain", "1");
  });
});
