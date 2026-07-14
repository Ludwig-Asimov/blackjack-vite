import { isValid } from "./stringArray-validation"

/**
 * Takes a card from deck.
 * @param {String[]} deck
 * @returns {string} card
 */
export const hit = (deck) => {
    isValid(deck)

    return deck.pop();
};
