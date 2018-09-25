context('Home page', () => {
  it('shows the React app', () => {
    cy.visit('/');
    cy.get('h1').should('have.text', 'Welcome to React');
  });
});
