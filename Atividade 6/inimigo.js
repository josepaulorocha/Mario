"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inimigo = void 0;
var Inimigo = /** @class */ (function () {
    function Inimigo(tipo) {
        this.tipo = tipo;
    }
    Inimigo.prototype.atacar = function (personagem, log) {
        var desviou = personagem.desviar();
        if (desviou) {
            log.addBack("".concat(personagem.nome, " desviou do ataque de ").concat(this.tipo, "!"));
            personagem.atacarInimigo(true); // Contra-ataca
        }
        else if (personagem.vidas > 0) {
            personagem.vidas -= 1;
            personagem.pontuacoesRodadas.push(-100);
            log.addBack("<- ".concat(this.tipo, " atacou ").concat(personagem.nome, "."));
            log.addBack("".concat(personagem.nome, " agora tem ").concat(personagem.vidas, " vidas."));
            log.addBack("".concat(personagem.nome, " perdeu 100 pontos."));
        }
    };
    return Inimigo;
}());
exports.Inimigo = Inimigo;
