describe("Library", () => {
  it("retrieves book by id", () => {
    const activeEnv = Cypress.env("deployment-env");
    cy.visit("src/index.html");
    cy.get(`[data-cy="${activeEnv}Radio"]`).click();

    cy.get('[data-cy="bookId"]').type(Cypress.env(activeEnv).bookId);
    cy.get('[data-cy="submitBookId"]').click();
    cy.get('[data-cy="bookName"]').should(
      "have.text",
      Cypress.env(activeEnv).bookName
    );
    cy.pause();
  });
});
