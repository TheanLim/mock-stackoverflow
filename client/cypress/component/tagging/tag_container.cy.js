import React from 'react'
import TagContainer from '../../../src/components/main/baseComponents/tagcontainer'

describe('TagContainer', () => {
  it('mounts with correct tags', () => {
    const tags = [{name: 'tag1'}, {name: 'tag2'}];
    const clickMethodSpy = cy.spy().as('clickMethodSpy');
    cy.mount(<TagContainer
      clickMethod={clickMethodSpy}
      tags={tags}/>);
    cy.get('.question_tags');
    cy.get('.question_tag_button').should('have.length', 2);
    cy.get('.question_tag_button').contains("tag1");
    cy.get('.question_tag_button').contains("tag2");
  });

  it('call clickMethod when a tag is clicked', () => {
    const tags = [{name: 'tag1'}, {name: 'tag2'}];
    const clickMethodSpy = cy.spy().as('clickMethodSpy');
    cy.mount(<TagContainer
      clickMethod={clickMethodSpy}
      tags={tags}/>);
    cy.get('.question_tags');
    cy.get('.question_tag_button').first().click();
    cy.get('@clickMethodSpy').should('have.been.calledWith', 'tag1');
  });
})