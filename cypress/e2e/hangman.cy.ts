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
			cy.get('button').invoke('attr', 'disabled').should('eq', undefined)
		})

		it('Loads drawing with no guesses', () => {
			cy.get('#drawing').children().should('have.length', 4)
		})

		it('Loads word-to-guess with no guessed letters', () => {
			cy.get('#word').find('span').filter('#wordLetter').invoke('attr', 'style').should('contain', 'visibility: hidden;')
		})

		it('Loads with blank win/loss text', () => {
			cy.get('#winlossText').should('be.empty')
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
		//Implies 'Z' is an incorrect guess
		it('Recognises an incorrect guess, after a correct one', () => {
			cy.get('#wordLetter').then(($firstLetter) => {

				const letterToClick = $firstLetter.text()

				cy.get('button').contains(letterToClick).click()
				cy.get('button').eq(25).click()

				cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
				cy.get('#drawing').children().should('have.length', 5)
			})
		})
		//Implies 'Z' is an incorrect guess
		it('Recognises a correct guess, after an incorrect one', () => {
			cy.get('#wordLetter').then(($firstLetter) => {

				const letterToClick = $firstLetter.text()

				cy.get('button').eq(25).click()
				cy.get('button').contains(letterToClick).click()

				cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
				cy.get('#drawing').children().should('have.length', 5)
			})
		})

		it('Disables guessed letter', () => {
			cy.get('#keyboard').within(() => {
				cy.get('button').first().click()
			})
			cy.get('button').first().invoke('attr', 'disabled').should('eq', 'disabled')
		})

		it('Correct keyboard letter clicked is revealed in word-to-guess', () => {
			cy.get('#wordLetter').then(($firstLetter) => {

				const letterToClick = $firstLetter.text()
				cy.get('button').contains(letterToClick).click()

				cy.get('#wordLetter').should('contain', letterToClick).and('be.visible')
			})
		})

		it('Drawing reveals in the correct order', () => {
			// cy.get('#keyboard').within(() => {
			// 	cy.get('button').each($button => {
			// 		cy.wrap($button).click({ force: true });
			// 	})
			// })
			cy.get('#drawing').children().should('have.length', 4)
			cy.get('#winlossText').should('not.be.visible')
			
			cy.get('button').then(($button) => {
				const keys = $button.text()
				const splitKeys = keys.split("", keys.length)

				cy.get('#word').find('span').filter('#wordLetter').then(($letters) => {
					const word = $letters.text()
					const splitLetter = word.split("", word.length)
					let badIndexes: number[] = [];
					let indexToSplice: number;

					for(var i = 0; i < splitKeys.length; i++){

						for(let j = 0; j < splitLetter.length; j++){

							if(splitKeys[i].toString() === splitLetter[j].toString()){
								badIndexes.push(i)
							}
						}
					}

					for(var k = 0; k < splitLetter.length; k++){						
						indexToSplice = badIndexes.pop() as number;
						splitKeys.splice(indexToSplice, 1);
					}

					for (var l = 0; l < 6; l++){
						var newKeysToClickValue = splitKeys.at(l)!;

						cy.get('button').contains(newKeysToClickValue).click();						
					}
					
					cy.get('#drawing').children().should('have.length', 10)
					cy.get('#winlossText').should('be.visible').and('contain.text','Nice Try - Refresh to try again')
				})
			})
		})
	})
	
	context('Post-gameplay state', () => {
		//Tries to click each letter to end the game
		beforeEach(() => {
			for (let i = 0; i < 26; i++) {
				cy.get('button').eq(i).click({ force: true })
			}
		})

		it('Cannot make anymore guesses after the game has concluded', () => {
			cy.get('#winlossText').should('be.visible').and('contain.text', 'Nice Try - Refresh to try again')
			cy.get('#word').find('span').filter('#wordLetter').should('be.visible')
			cy.get('button').invoke('attr', 'disabled').should('eq', 'disabled')
		})

		it('Correct text displays after game, respective of win state', () => {
			cy.get('#winlossText').should('be.visible').and('contain.text', 'Nice Try - Refresh to try again')

			cy.reload()

			cy.get('#word').find('span').filter('#wordLetter').then(($letters) => {
				const word = $letters.text()
				const splitLetter = word.split("", word.length)

				for (let i = 0; i < $letters.length; i++) {
					cy.get('button').contains(`${splitLetter[i]}`).click({ force: true })
				}
			})

			cy.get('#winlossText').should('be.visible').and('contain.text', 'Winner! - Refresh to try again')
		})
	})
})