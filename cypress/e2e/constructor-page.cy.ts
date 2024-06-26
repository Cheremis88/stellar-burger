import { setCookie, deleteCookie } from '../../src/utils/cookie';

const topBun = `[data-cy='topBun']`;
const bottomBun = `[data-cy='bottomBun']`;
const filling = `[data-cy='filling']`;

describe('Tests for constructor page', () => {

  beforeEach(() => {
    cy.intercept('GET', '*/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
    cy.get(`[data-cy='643d69a5c3f7b9001cfa093d']`).as('bun');
    cy.get(`[data-cy='643d69a5c3f7b9001cfa0946']`).as('filling');
  });

  describe('Creating an order', () => {
    
    it('adding ingredients to the burger by button click', () => {
      cy.addIngredients('@bun', '@filling');
      cy.get(topBun).contains('флюоресцентная булка', { matchCase: false });
      cy.get(bottomBun).contains('Флюоресцентная булка', { matchCase: false });
      cy.get(filling).contains('Хрустящие минеральные кольца', { matchCase: false });
    });

    it('placing, sending and closing an order', () => {
      setCookie('accessToken', '123');
      localStorage.setItem('refreshToken', '456');
      cy.intercept('GET', '*/auth/user', { fixture: 'user.json' });
      cy.intercept('POST', '*/orders', { fixture: 'order.json' });
      cy.visit('/');
      cy.addIngredients('@bun', '@filling');
      cy.contains('Оформить').click();
      cy.get('#modals').contains('38144');
      cy.get('#modals').find('button').click();
      cy.get('#modals').children().should('not.exist');
      cy.get(topBun).should('not.exist');
      cy.get(bottomBun).should('not.exist');
      cy.get(filling).should('not.exist');
      localStorage.clear();
      deleteCookie('accessToken');
    });
  });

  describe('Modal window operations', () => {

    beforeEach(() => cy.get('@filling').find('a').click());

    it('window contains correct ingredient', () => {
      cy.get('#modals').contains('Хрустящие минеральные кольца');
    });

    it('closing window by clicking on cross-button', () => {
      cy.get('#modals').find('button').click();
      cy.get('#modals').children().should('not.exist');
    });

    it('closing window by clicking on overlay', () => {
      cy.get(`[data-cy='overlay']`).click({ force: true });
      cy.get('#modals').children().should('not.exist');
    });

    it('closing window by pressing Escape', () => {
      cy.document().trigger('keydown', { key: 'Escape' });
      cy.get('#modals').children().should('not.exist');
    });
  });
});