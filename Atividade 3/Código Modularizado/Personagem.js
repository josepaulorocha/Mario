"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personagem = void 0;
var Personagem = /** @class */ (function () {
    function Personagem(nome) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
    }
    Personagem.prototype.printPular = function () {
        console.log("".concat(this.nome, " pulou!"));
    };
    return Personagem;
}());
exports.Personagem = Personagem;
var VIDA_MAXIMA = 3;
