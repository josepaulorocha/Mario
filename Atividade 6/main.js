"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var personagem_1 = require("./personagem");
var inimigo_1 = require("./inimigo");
var powerups_1 = require("./powerups");
var ordenacao_1 = require("./ordenacao");
var pilha_1 = require("./pilha");
var fila_dupla_1 = require("./fila-dupla");
// PILHA 2: Guarda o histórico de todas as ações importantes
var historicoDeAcoes = new pilha_1.Pilha();
// FILA 2 (DUPLA): Gerencia todas as mensagens que serão exibidas
var filaDeLogs = new fila_dupla_1.FilaDupla();
// FILA 1: Fila circular para os inimigos atacarem em ordem
var filaDeInimigos = new fila_dupla_1.FilaDupla();
var inimigosBase = [
    new inimigo_1.Inimigo("Goomba"),
    new inimigo_1.Inimigo("Koopa Troopa"),
    new inimigo_1.Inimigo("Bowser")
];
inimigosBase.forEach(function (inimigo) { return filaDeInimigos.addBack(inimigo); });
// Instanciando objetos
var powerUp = new powerups_1.PowerUps();
var mario = new personagem_1.Personagem("Mario", filaDeLogs, historicoDeAcoes);
filaDeLogs.addBack("\n=== Início da partida ===");
for (var rodada = 1; rodada <= 10; rodada++) {
    filaDeLogs.addBack("\n--- Rodada ".concat(rodada, " ---"));
    var chanceEvento = Math.random();
    if (chanceEvento <= 0.6) { // 60% de chance de ataque de inimigo
        // Pega o inimigo da frente da fila para atacar
        var inimigoAtacante = filaDeInimigos.removeFront();
        if (inimigoAtacante) {
            historicoDeAcoes.push("".concat(inimigoAtacante.tipo, " atacou ").concat(mario.nome));
            inimigoAtacante.atacar(mario, filaDeLogs);
            // Coloca o inimigo de volta no final da fila
            filaDeInimigos.addBack(inimigoAtacante);
        }
    }
    else { // 40% de chance de achar um Power-Up
        var powerUpGerado = powerUp.gerarPowerUp();
        filaDeLogs.addBack("Power-Up ".concat(powerUpGerado, " apareceu!"));
        mario.coletarPowerUp(powerUpGerado);
    }
    // A cada 3 rodadas, Mario tenta usar um power-up
    if (rodada % 3 === 0) {
        mario.usarPowerUp();
    }
    if (mario.vidas <= 0) {
        // Adiciona a mensagem de Fim de Jogo na FRENTE da fila para prioridade
        filaDeLogs.addFront("\n!!! ".concat(mario.nome, " perdeu todas as vidas! Fim de jogo. !!!"));
        break;
    }
}
// Processa e exibe todas as mensagens da fila de logs
while (!filaDeLogs.isEmpty()) {
    console.log(filaDeLogs.removeFront());
}
// Ordena e exibe o ranking de pontuações
console.log("\n--- Ranking de Pontuações da Rodada ---");
var sortedArray = (0, ordenacao_1.mergeSort)(mario.pontuacoesRodadas).reverse();
for (var i = 0; i < sortedArray.length; i++) {
    console.log("".concat(i + 1, "\u00BA lugar - ").concat(sortedArray[i], " pontos"));
}
// Exibe o histórico de ações da última para a primeira
console.log("\n--- Histórico de Ações (Última para Primeira) ---");
while (!historicoDeAcoes.isEmpty()) {
    console.log("- ".concat(historicoDeAcoes.pop()));
}
