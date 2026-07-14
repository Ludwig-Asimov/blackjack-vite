/**
 * 2C = Two of clubs (Tréboles).
 * 2D = Two of diamonds.
 * 2H = Two of Hearts.
 * 2S = Two of Spades.
 */

"use strict";

// *> Importaciones individuales.
// import { createDeck } from "./use-cases/blackjack/deck-creation.js";
// import { hit } from "./use-cases/blackjack/hit.js"
// import { cardScore } from "./use-cases/blackjack/card-score.js"

// *> Importaciones de Barril.
import { createDeck, hit, cardScore, } from "./use-cases/blackjack/index";

let deck        = [];

let tipos       = ['C','D','H','S'];
let especiales  = ['A','J','Q','K'];

export const maxScore = 21;

let playersData = [];

const createPlayers = ( playersQuantity ) => {
    let playersData = [];

    // Se agrega la CPU.
    const totalParticipants = playersQuantity + 1;

    playersData = Array.from(
        { length: totalParticipants },
        (_, index) => {
            const id = index + 1;
            const isCroupier = (id === totalParticipants);

            const player = {
                id,
                active: true,
                score: 0,
                name: (isCroupier ? "Croupier" : `Jugador ${id}`),
                isHuman: (!isCroupier),
                cards: [],
                bullets: 0
            };

            return player;
        });

    return playersData;
}

export const init = (playersQuantity) => {
    deck = createDeck(tipos, especiales);
    playersData = createPlayers(playersQuantity);
    return getPlayersData(playersData);
};

const getPlayersData = () => Object.freeze(             // Congela el conjunto de datos resultante.
        playersData.map(
            player => Object.freeze( { ...player } )    // crea una replica y la Congela.
        )
    );

export const getPlayerData = (id) => {
    if (!id) throw new Error("Invalid Id");

    const playerData = playersData.find(player => player.id === id);

    return (playerData) ? Object.freeze( { ...playerData } ) : null;
}

// Turno Jugadores

const scoreRules = (player, card) => {
    const score = cardScore(card);

    if (card.includes( especiales[0] )) ++player.bullets;

    player.score += score;

    while (player.score > 21 && player.bullets > 0) {
        player.score -= 10;
        --player.bullets;
    }

    player.active = !(player.score > 21);

    return player;
};

export const playerTurn = ( playerId ) => {
    const player = playersData.find(player => player.id === playerId);

    if (!player) throw new Error("Error: Player not found");

    do {
        const card = hit(deck);

        player.cards.push(card);
        scoreRules(player, card);
    } while (!player.isHuman && player.score < 17);

    return Object.freeze( { ...player } );
};

export const getWinners = () => {
    const activePlayers = playersData.filter(player => player.active);

    if (activePlayers.length === 0) return [];

    const winnerScore = activePlayers.reduce( (max, player) => Math.max(max, player.score), 0);

    const winners = activePlayers.filter(player => player.score === winnerScore);

    return winners.map( player => Object.freeze( { ...player } ) );
};
