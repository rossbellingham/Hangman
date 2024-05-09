/// <reference types="cypress" />

//TODO: Comment tests

describe('Hangman app', () => {
  context('On pageload or refresh', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })

    it('Loads all letters of the keyboard', () => {
      cy.get('#keyboard')
      .within(() => {
        cy.get('button').should('have.length', 26)
      })
    })

    it('Loads keyboard with no disabled buttons', () => {
      cy.get('button')
      .invoke('attr','disabled')
      .should('eq', undefined)
    })

    it('Loads drawing with no guesses', () => {
      cy.get('#drawing')
      .children()
      .should('have.length', 4)
    })

    it('Loads word-to-guess with no guessed letters', () => {
      cy.get('#word')
      .find('span')
      .filter('#wordLetter')
      .invoke('attr','style')      
      .should('contain','visibility: hidden;')           
    })

    it('Loads with blank win/loss text', () => {
      cy.get('#winlossText')
      .should('be.empty')
    })

    it('Loads a new word on page refresh', () => {
      cy.get('#word')
      .find('span')
      .filter('#wordLetter').then(($wordLetterBefore) => {

        const wordBeforeReload = $wordLetterBefore.text()
        cy.reload()

        cy.get('#word')
        .find('span')
        .filter('#wordLetter').then(($wordLetterAfter) => {

          const wordAfterReload = $wordLetterAfter.text()

          expect(wordBeforeReload).not.to.eq(wordAfterReload)
        })
      })      
    })

    it('Clicks keyboard letter', () => {
      cy.get('#keyboard')
      .within(() => {
        cy.get('button').first().click()
      })
    })
  
    it('Correct keyboard letter clicked is revealed in word-to-guess', () => {
      
      cy.get('#wordLetter').then(($firstLetter) => {

        const letterToClick = $firstLetter.text()
        cy.get('button').contains(letterToClick).click()

        cy.get('#wordLetter')
        .should('contain',letterToClick).and('be.visible')
      })
    })


    ///////////////////
    //FINISH TEST BELOW 
    ///////////////////

          // NB: I planned on using a loop to go through the keyboard keys and remove/disable the value if 
          // that letter was found in the dontClickCharacters array, but i think this may be over-engineered. 

          // const dontClickString = $wordLettersAvoid.text()
          // const dontClickCharacters = dontClickString.split("",dontClickString.length)
          // const keys = document.querySelectorAll("#key");
          // const word = document.querySelectorAll('#wordLetter');        
          // console.log(word);
          // console.log(keys);

    ///////////////////
    ///////////////////
    ///////////////////

    it('Incorrect keyboard letter clicked adds a piece of the drawing', () => {

      //THIS ONLY WORKS IF THE LETTER 'A' ISN'T IN THE WORD - I HAVE NO IDEA HOW TO MAKE IT WORK OTHERWISE
      cy.get('#drawing')
      .children()
      .then(() => {

        cy.get('button')
        .eq(0)
        .click()
        .then(() => {

          cy.get('#drawing').children().should('have.length',5)
        })
      })
    })
  })

  context('Ongoing game, after one or more guesses, until conclusion', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })

    it('Recognises an incorrect guess, after a correct one', () => {
      cy.get('#wordLetter').then(($firstLetter) => {

        const letterToClick = $firstLetter.text()

        cy.get('button').contains(letterToClick).click()
        cy.get('button').eq(25).click()

        cy.get('#wordLetter').should('contain',letterToClick).and('be.visible')
        cy.get('#drawing').children().should('have.length',5)
      })
    })
  
    it('Recognises a correct guess, after an incorrect one', () => {
      cy.get('#wordLetter').then(($firstLetter) => {

        const letterToClick = $firstLetter.text()

        cy.get('button').eq(25).click()
        cy.get('button').contains(letterToClick).click()
        
        cy.get('#wordLetter').should('contain',letterToClick).and('be.visible')
        cy.get('#drawing').children().should('have.length',5)
      })
    })
  
    // it('Cannot make anymore guesses after the game has concluded', () => {
    //   cy.get('')
    // })
  
    // it('Correct text displays after game, respective of win state', () => {
    //   cy.get('')
    // })
  
    // it('Drawing reveals in the correct order until the game is over', () => {
    //   cy.get('')
    // })
  
    it('Disables guessed letter', () => {
      cy.get('#keyboard')
      .within(() => {
        cy.get('button').first().click()
      })

      cy.get('button')
      .first()
      .invoke('attr','disabled')
      .should('eq', 'disabled')
    })
  
    // it('Reveals remaining letters if game concludes as loss, with correct style', () => {
    //   cy.get('')
    // })  
  })
  
  context('Using physical keyboard as input', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/')
    })
    
    // it('Typing letter on physical keyboard counts as guess', () => {
    //   cy.get('')
    // })

    // it('Ignores number/special character input from physical keyboard', () => {
    //   cy.get('')
    // })
  })
})