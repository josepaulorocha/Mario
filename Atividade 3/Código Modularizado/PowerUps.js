"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUps = void 0;
var PowerUps = /** @class */ (function () {
    function PowerUps() {
        this.tipo = "Desconhecido";
    }
    PowerUps.prototype.gerarPowerUp = function () {
        var numero = Math.floor(Math.random() * 3); // 0, 1 ou 2
        if (numero === 0) {
            this.tipo = "Cogumelo";
        }
        else if (numero === 1) {
            this.tipo = "Flor de fogo";
        }
        else {
            this.tipo = "Estrela";
        }
        console.log("$voc\u00EA ganhou um Power Up: ".concat(this.tipo));
    };
    return PowerUps;
}());
exports.PowerUps = PowerUps;
