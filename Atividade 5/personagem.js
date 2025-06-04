"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personagem = void 0;
var VIDA_MAXIMA = 3;
var Personagem = /** @class */ (function () {
    function Personagem(nome) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
        this.inventario = [];
        this.pontuacoesRodadas = [];
    }
    Personagem.prototype.printPular = function () {
        console.log("".concat(this.nome, " pulou!"));
    };
    Personagem.prototype.coletarPowerUp = function (powerUp) {
        this.inventario.push(powerUp);
        this.pontuacoesRodadas.push(800);
        console.log("".concat(this.nome, " coletou: ").concat(powerUp, " e ganhou 800 pontos!"));
    };
    Personagem.prototype.desviar = function () {
        var chance = Math.random(); // gera um número entre 0 e 1
        return chance <= 0.4; // 40% de chance de desviar
    };
    Personagem.prototype.atacarInimigo = function () {
        var pontos;
        if (!this.desviar()) {
            pontos = -100;
            console.log("".concat(this.nome, " falhou ao desviar e foi atingido! Perdeu 100 pontos."));
        }
        else {
            pontos = 400;
            console.log("".concat(this.nome, " atacou o inimigo! Ganhou 400 pontos."));
        }
        this.pontuacoesRodadas.push(pontos);
        return pontos;
    };
    return Personagem;
}());
exports.Personagem = Personagem;
