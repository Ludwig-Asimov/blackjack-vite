import { shuffle } from "underscore";
import { isValid } from "./stringArray-validation"

/**
 *Creates a new random deck.
 * @param {String[]} tipos - Example: ['C','D','H','S']
 * @param {String[]} especiales - Example: ['A','J','Q','K']
 * @returns {String[]} deck
 */
export const createDeck = (tipos, especiales) => {
    isValid(tipos);
    isValid(especiales);

    const deck = [];

    for (let i = 2; i <= 10; i++) {
        tipos.forEach(
            tipo => deck.push(`${i}${tipo}`)
        );
    }

    tipos.forEach(
        tipo => especiales.forEach(
            especial => deck.push(`${especial}${tipo}`)
        )
    );

    // console.log(deck);
    return shuffle( deck );
};
