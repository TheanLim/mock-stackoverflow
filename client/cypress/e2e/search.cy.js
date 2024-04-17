beforeEach(() => {
    cy.task('dbTeardown');
    cy.task('dbSeed');
})

describe('Search 1', () => {
    it('Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation{enter}');
        cy.wait(10);
        cy.get('.postTitle').should('contain', qTitles[0]);
    })
})

describe('Search 2', () => {
    it('Search string matches tag and text', () => {
        const qTitles = ['What does the Fox Say?', 'android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.wait(10)
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Search 3', () => {
    it('Output of the search should be in newest order by default', () => {
        const qTitles = ['What does the Fox Say?', 'Quick question about storage on android', 'android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.wait(10)
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    });
});

describe('Search 4', () => {
    it('Output of the search should show number of results found', () => {
        const qTitles = ['What does the Fox Say?', 'Quick question about storage on android', 'android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('android [react]{enter}');
        cy.wait(10);
        cy.contains(qTitles.length+" questions");
    });
});

describe('Search 5', () => {
    it('Output of the empty search should show all results ', () => {
        const qTitles = ['What does the Fox Say?', 'Quick question about storage on android', 'Object storage for a web application', 'android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('{enter}');
        cy.wait(10);
        cy.contains(qTitles.length+" questions");
    });
});

describe('Search 6', () => {
    it('Search string with non-existing tag and non-tag word', () => {
        cy.visit('http://localhost:3000');
        cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
        cy.wait(10);
        cy.contains('No Questions Found');
    });
});

describe('Search 7', () => {
    it('Search string with case-insensitive matching', () => {
        cy.visit('http://localhost:3000');
        cy.wait(10);
        cy.get('#searchBar').type('AnDrOiD{enter}');
        cy.contains('android');
    });
});
