describe("Enter Different Locations", function() {

    it("visit it", function() {
        cy.visit("http://localhost:3000")
    })
    it("enter a random word that is not a place", function() {
        cy.get('input[name=location]').type("test")
        cy.get(".locationLookup").click()
        cy.get('.errorMessage').should('be.visible')
    })

    it("enter zip code test", () => {
        cy.get('input[name=location]').clear().type("90210")
        cy.get(".locationLookup").click()
        cy.get(".weatherInfoContainer").should('be.visible')
    })

    
    it("enter a city", () => {
        cy.get('input[name=location]').clear().type("San Francisco")
        cy.get(".locationLookup").click()
        cy.get(".weatherInfoContainer").should('be.visible')
    })

    it("enter a full city", () => {
        cy.get('input[name=location]').clear().type("Detroit, MI, US")
        cy.get(".locationLookup").click()
        cy.get(".weatherInfoContainer").should('be.visible')
    })
})