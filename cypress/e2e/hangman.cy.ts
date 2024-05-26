/// <reference types="cypress" />

//TODO: Finish implementing and comment tests

describe('Using the Hangman app', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })

    context('On pageload or refresh', () => {
        it('Loads all letters of the keyboard', () => {
          cy.get('#keyboard').within(() => {
            cy.get('button').should('have.length', 26)
          })
        })

        it('Loads keyboard with no disabled buttons', () => {
          cy.get('button').invoke('attr','disabled').should('eq', undefined)
        })

        it('Loads drawing with no guesses', () => {
          cy.get('#drawing').children().should('have.length', 4)
        })

        it('Loads word-to-guess with no guessed letters', () => {
          cy.get('#word').find('span').filter('#wordLetter').invoke('attr','style').should('contain','visibility: hidden;')           
        })

        it('Loads with blank win/loss text', () => {
          cy.get('#winlossText')
          .should('be.empty')
        })

        it('Loads a new word on page refresh', () => {
          cy.get('#word').find('span').filter('#wordLetter').then(($wordLetterBefore) => {

            const wordBeforeReload = $wordLetterBefore.text()
            cy.reload()

            cy.get('#word').find('span').filter('#wordLetter').then(($wordLetterAfter) => {

              const wordAfterReload = $wordLetterAfter.text()
              expect(wordBeforeReload).not.to.eq(wordAfterReload)
            })
          })      
        })   
    })

    context('Ongoing game, after one or more guesses, until conclusion', () => {
        it('Recognises an incorrect guess, after a correct one', () => {
          cy.get('#wordLetter').then(($firstLetter) => {

            const letterToClick = $firstLetter.text()

            cy.get('button').contains(letterToClick).click()
            cy.get('button').eq(25).click()

            cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
            cy.get('#drawing').children().should('have.length',5)
          })
        })
      
        it('Recognises a correct guess, after an incorrect one', () => {
          cy.get('#wordLetter').then(($firstLetter) => {

            const letterToClick = $firstLetter.text()

            cy.get('button').eq(25).click()
            cy.get('button').contains(letterToClick).click()
            
            cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
            cy.get('#drawing').children().should('have.length',5)
          })
        })
      
        it('Disables guessed letter', () => {
          cy.get('#keyboard').within(() => {
            cy.get('button').first().click()
          })
          cy.get('button').first().invoke('attr','disabled').should('eq', 'disabled')
        })
    
        it('Correct keyboard letter clicked is revealed in word-to-guess', () => {
          cy.get('#wordLetter').then(($firstLetter) => {

            const letterToClick = $firstLetter.text()
            cy.get('button').contains(letterToClick).click()

            cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
          })
        })

        it('Incorrect keyboard letter clicked adds a piece of the drawing', () => {
          //This only works if the letter 'A' isn't in the word, I have no idea how to implement it otherwise
          cy.get('button').eq(0).click().then(() => {

            cy.get('#drawing').children().should('have.length',5)
          })          
        })
    })
})