/**
 * Returns the card's value
 * @param {string} carta
 * @returns {Number} Value - Card value;
 */
export const cardScore = ( card ) => {
    const value = card.substring(0, card.length - 1);

    return isNaN(value) ?
        ((value === "A") ? 11 : 10) :
        parseInt(value);
};
