"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUps = exports.TIPOS_DE_POWERUPS = void 0;
exports.TIPOS_DE_POWERUPS = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];
class PowerUps {
    constructor() {
        this.tipo = "Desconhecido";
    }
    gerarPowerUp() {
        const numero = Math.floor(Math.random() * exports.TIPOS_DE_POWERUPS.length);
        this.tipo = exports.TIPOS_DE_POWERUPS[numero];
        return this.tipo;
    }
}
exports.PowerUps = PowerUps;
