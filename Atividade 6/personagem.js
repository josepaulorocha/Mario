"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personagem = void 0;
var pilha_1 = require("./pilha");
var VIDA_MAXIMA = 3;
var Personagem = /** @class */ (function () {
    function Personagem(nome, log, historico) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
        this.inventario = new pilha_1.Pilha(); // Inventário agora é uma Pilha
        this.pontuacoesRodadas = [];
        this.log = log; // Referência para a fila de logs
        this.historico = historico; // Referência para a pilha de histórico
    }
    Personagem.prototype.printPular = function () {
        this.log.addBack("".concat(this.nome, " pulou!"));
    };
    Personagem.prototype.coletarPowerUp = function (powerUp) {
        this.inventario.push(powerUp);
        this.pontuacoesRodadas.push(800);
        this.log.addBack("-> ".concat(this.nome, " coletou: ").concat(powerUp, " e ganhou 800 pontos!"));
        this.historico.push("".concat(this.nome, " coletou ").concat(powerUp));
    };
    // Método para usar o último power-up coletado
    Personagem.prototype.usarPowerUp = function () {
        var powerUpUsado = this.inventario.pop();
        if (powerUpUsado) {
            this.log.addBack("".concat(this.nome, " usou ").concat(powerUpUsado, "!"));
            this.historico.push("".concat(this.nome, " usou ").concat(powerUpUsado));
        }
        else {
            this.log.addBack("".concat(this.nome, " n\u00E3o tem power-ups para usar."));
        }
        return powerUpUsado;
    };
    Personagem.prototype.desviar = function () {
        var chance = Math.random();
        return chance <= 0.4;
    };
    Personagem.prototype.atacarInimigo = function (desviou) {
        var pontos;
        if (!desviou) {
            pontos = -100;
            this.log.addBack("<- ".concat(this.nome, " falhou ao desviar e foi atingido! Perdeu 100 pontos."));
        }
        else {
            pontos = 400;
            this.log.addBack("-> ".concat(this.nome, " atacou o inimigo! Ganhou 400 pontos."));
            this.historico.push("".concat(this.nome, " atacou um inimigo."));
        }
        this.pontuacoesRodadas.push(pontos);
        return pontos;
    };
    return Personagem;
}());
exports.Personagem = Personagem;
