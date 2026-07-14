"use strict";

import * as blackjack from "./blackjack.js";
import handTemplate from "../assets/templates/playerHand.html?raw";

let playersHands = [];
let finishedPlayers = 0;

const deshabiliarBotones = (botones = []) => {
    botones.forEach(btn => btn.disabled = true);
}

const cardRendering = (card, cardsContainer) => {
    const imgCard = document.createElement("img");

    imgCard.src = `./assets//img/cartas/${card}.png`;
    imgCard.classList.add("carta");

    cardsContainer.append(imgCard);
};

const playersQuantityPrompt = () => {
    let playersQuantity = 0;

    do {
        const input = prompt("Enter number of players", "1");

        if (input === null) {
            console.warn("Proceso cancelado por el usuario.");
            break;
        }

        const response = parseInt(input, 10);

        if (!isNaN(response) && response > 0) {
            playersQuantity += parseInt(response, 10);
            break;
        }

        alert("Debe haber almenos un jugador");
    } while(true);

    return playersQuantity;
}

const playersHandsRendering = async (playersData, playersPanel, cpuPanel) => {
    let $templateHtml = document.createElement("template");
    $templateHtml.innerHTML = handTemplate.trim();

    return Array.from( playersData,
        (player) => {
            const $playerHand = $templateHtml.content.cloneNode(true);
            const $mainContainer = $playerHand.querySelector("div.col");
            const $cards = $mainContainer.querySelector("div.jugador-cartas");
            const $title = $mainContainer.querySelector("h1");
            const $score = $title.querySelector("small");

            const playerHand = {
                id: player.id,
                $cards,
                $score,
                $buttons: []
            };

            $title.firstChild.textContent = `${player.name} - `;
            playerHand.$score.textContent = player.score;

            if (player.isHuman) {
                const $button = document.createElement("button");
                $button.type = "button";

                const $btn_Hit = $button.cloneNode(true),
                    $btn_Stand = $button.cloneNode(true);

                $btn_Stand.dataset.playerId = player.id;
                $btn_Stand.classList.add("btn", "btn-warning", "me-4");
                $btn_Stand.setAttribute("name", "stand");
                $btn_Stand.textContent = "Stand";

                $btn_Hit.dataset.playerId = player.id;
                $btn_Hit.classList.add("btn", "btn-primary", "ms-4");
                $btn_Hit.setAttribute("name", "hit");
                $btn_Hit.textContent = "Hit!";

                $mainContainer.append($btn_Stand, $btn_Hit);

                playerHand.$buttons.push($btn_Stand, $btn_Hit);

                playersPanel.appendChild($playerHand);
            }
            else {
                cpuPanel.appendChild($playerHand);
            }

            return playerHand;
        });
};

const gameReset = async (playersPanel, cpuPanel) => {
    playersPanel.innerHTML = "";
    cpuPanel.innerHTML = "";
    finishedPlayers = 0;

    playersHands = await renderPlayers(playersPanel, cpuPanel);
};

const getPlayerHand = (playerId) => {
    const playerHand = playersHands.find(player => player.id === playerId);

    if (!playerHand) throw new Error("Error: player not found");

    return playerHand;
};

const playerTurn = ( playerId ) => {
    const playerHand = getPlayerHand(playerId);

    const playerData = blackjack.playerTurn(playerId);

    playerHand.$score.textContent = playerData.score;

    if (!playerData.isHuman) {
        playerData.cards.forEach(card => cardRendering(card, playerHand.$cards));
    } else {
        const card = playerData.cards.at(-1);

        cardRendering(
            card,
            playerHand.$cards
        );
    }

    if (playerData.isHuman && playerData.score >= blackjack.maxScore) {
        playerStop(playerHand);
    }
};

const playerStop = (player) => {
    const playerHand = (typeof player === "number" && Number.isFinite(player)) ? getPlayerHand(player) : player;

    deshabiliarBotones(playerHand.$buttons);
    playerFinished(playerHand.id);
};

const playerFinished = (playerId) => {
    if (playersHands.some(player => player.id === playerId)) {
        document.dispatchEvent( new CustomEvent("playerFinished", { detail: playerId }) );
    }
};

const cpuTurn = () => {
    const playerId = playersHands.length;

    playerTurn(playerId);
    playerFinished(playerId);
};

const playerButtonsCallBack = (e) => {
    const playerId = +(e.target.dataset.playerId);

    switch (e.target.name) {
        case "hit":
            playerTurn(playerId);
            break;
        case "stand":
            playerStop(playerId);
            break;
        default:
            break;
    }
};

const renderPlayers = async (playersPanel, cpuPanel) => {
    const playersQuantity = playersQuantityPrompt();
    const playersData = blackjack.init(playersQuantity);

    const playersHands = await playersHandsRendering(playersData, playersPanel, cpuPanel);

    return playersHands;
};

const init = async () => {
    const btn_NuevoJuego = document.body.querySelector("#btn_NuevoJuego");
    const playersPanel = document.body.querySelector("div#players-panel");
    const cpuPanel = document.body.querySelector("div#cpu-panel");

    playersHands = await renderPlayers(playersPanel, cpuPanel);

    playersPanel.addEventListener("click",
        (e) => {
            if (e.target.tagName === "BUTTON") {
                playerButtonsCallBack(e);
            }
        });

    document.addEventListener("playerFinished", () => {
        ++finishedPlayers;

        console.log(`Finished Players ${finishedPlayers}`);

        if (finishedPlayers === (playersHands.length - 1)) {
            cpuTurn();
        } else if (finishedPlayers === playersHands.length) {
            const winners = blackjack.getWinners();

            const message = (winners.length === 0) ?
                "Sin Ganadores: Se devuelve la apuesta!" :
                (winners.length > 1) ? winners.reduce((msg, player) => msg + `${player.name}, `, "Empatados: ") :
                `Ganador: ${winners[0].name}`;

            alert(message);
        }
    });

    btn_NuevoJuego.addEventListener("click", () => gameReset(playersPanel, cpuPanel));
};

// Main entry point when fully loaded DOM.
document.addEventListener(
    "DOMContentLoaded",
    init
);
