"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inimigo = void 0;
var Inimigo = /** @class */ (function () {
    function Inimigo(tipo) {
        this.tipo = tipo;
    }
    Inimigo.prototype.atacar = function (personagem) {
        if (personagem.desviar()) {
            console.log("".concat(personagem.nome, " desviou do ataque de ").concat(this.tipo, "!"));
        }
        else if (personagem.vidas > 0) {
            personagem.vidas -= 1;
            console.log("".concat(this.tipo, " atacou ").concat(personagem.nome));
            console.log("".concat(personagem.nome, " agora tem ").concat(personagem.vidas, " vidas"));
        }
    };
    return Inimigo;
}());
exports.Inimigo = Inimigo;
