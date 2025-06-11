"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUps = exports.TIPOS_DE_POWERUPS = void 0;
exports.TIPOS_DE_POWERUPS = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];
var PowerUps = /** @class */ (function () {
    function PowerUps() {
        this.tipo = "Desconhecido";
    }
    PowerUps.prototype.gerarPowerUp = function () {
        var numero = Math.floor(Math.random() * exports.TIPOS_DE_POWERUPS.length);
        this.tipo = exports.TIPOS_DE_POWERUPS[numero];
        return this.tipo;
    };
    return PowerUps;
}());
exports.PowerUps = PowerUps;
