"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var personagem_1 = require("./personagem");
var inimigo_1 = require("./inimigo");
var powerups_1 = require("./powerups");
// Instanciando objetos e arrays
var inimigos = [
    new inimigo_1.Inimigo("Goomba"),
    new inimigo_1.Inimigo("Koopa Troopa"),
    new inimigo_1.Inimigo("Bowser")
];
var personagens = [
    new personagem_1.Personagem("Mario"),
    new personagem_1.Personagem("Luigi")
];
var powerUp = new powerups_1.PowerUps();
// Gera array de números aleatórios para simular eventos durante as rodadas
var randomArrayInt = Array.from({ length: 10 }, function () { return Math.floor(Math.random() * 100) + 1; });
console.log("=== Início da partida ===");
for (var rodada = 0; rodada < randomArrayInt.length; rodada++) {
    var num = randomArrayInt[rodada];
    console.log("\nRodada ".concat(rodada + 1, " - N\u00FAmero gerado: ").concat(num));
    if (num <= 60) {
        // Ataque de inimigo aleatório
        var inimigo = inimigos[Math.floor(Math.random() * inimigos.length)];
        inimigo.atacar(personagens[0]);
    }
    else {
        // Gera e coleta PowerUp
        var powerUpGerado = powerUp.gerarPowerUp();
        console.log("Power-Up ".concat(powerUpGerado, " apareceu!"));
        personagens[0].coletarPowerUp(powerUpGerado);
    }
    if (personagens[0].vidas <= 0) {
        console.log("\n".concat(personagens[0].nome, " perdeu todas as vidas! Fim de jogo."));
        break;
    }
}
