"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const personagem_1 = require("./personagem");
const inimigo_1 = require("./inimigo");
const powerups_1 = require("./powerups");
const ordenacao_1 = require("./ordenacao");
// Instanciando objetos e arrays
const inimigos = [
    new inimigo_1.Inimigo("Goomba"),
    new inimigo_1.Inimigo("Koopa Troopa"),
    new inimigo_1.Inimigo("Bowser")
];
const personagens = [
    new personagem_1.Personagem("Mario"),
    new personagem_1.Personagem("Luigi")
];
const powerUp = new powerups_1.PowerUps();
// Gera array de números aleatórios para simular eventos durante as rodadas
const randomArrayInt = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
console.log("=== Início da partida ===");
for (let rodada = 0; rodada < randomArrayInt.length; rodada++) {
    const num = randomArrayInt[rodada];
    console.log(`\nRodada ${rodada + 1} - Número gerado: ${num}`);
    if (num <= 60) {
        // Ataque de inimigo aleatório
        const inimigo = inimigos[Math.floor(Math.random() * inimigos.length)];
        inimigo.atacar(personagens[0]);
    }
    else {
        // Gera e coleta PowerUp
        const powerUpGerado = powerUp.gerarPowerUp();
        console.log(`Power-Up ${powerUpGerado} apareceu!`);
        personagens[0].coletarPowerUp(powerUpGerado);
    }
    if (personagens[0].vidas <= 0) {
        console.log(`\n${personagens[0].nome} perdeu todas as vidas! Fim de jogo.`);
        break;
    }
}
// Chamando o Merge Sort
const sortedArray = (0, ordenacao_1.mergeSort)(personagens[0].pontuacoesRodadas).reverse();
console.log("Ranking de Pontuações:");
for (let i = 0; i < sortedArray.length; i++) {
    console.log(`${i + 1} - ${sortedArray[i]}`);
}
