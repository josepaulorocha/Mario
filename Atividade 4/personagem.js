"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personagem = void 0;
var VIDA_MAXIMA = 3;
var Personagem = /** @class */ (function () {
    function Personagem(nome) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
        this.inventario = [];
    }
    Personagem.prototype.printPular = function () {
        console.log("".concat(this.nome, " pulou!"));
    };
    Personagem.prototype.coletarPowerUp = function (powerUp) {
        this.inventario.push(powerUp);
        console.log("".concat(this.nome, " coletou: ").concat(powerUp));
    };
    Personagem.prototype.desviar = function () {
        var chance = Math.random(); // gera um número entre 0 e 1
        return chance <= 0.4; // 40% de chance de desviar
    };
    return Personagem;
}());
exports.Personagem = Personagem;
