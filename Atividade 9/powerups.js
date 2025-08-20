"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerUps = exports.TIPOS_DE_POWERUPS = void 0;
// A lista global pode servir como um fallback ou uma referência de todos os itens possíveis.
exports.TIPOS_DE_POWERUPS = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];
var PowerUps = /** @class */ (function () {
    function PowerUps() {
        this.tipo = "Desconhecido";
    }
    /**
     * Gera um Power-Up a partir de uma lista de itens fornecida.
     * Se nenhuma lista for fornecida, usa a lista global como padrão.
     * @param itensDisponiveis Um array com os itens possíveis para sorteio.
     * @returns O nome do Power-Up gerado.
     */
    PowerUps.prototype.gerarPowerUp = function (itensDisponiveis) {
        // Garante que a lista não está vazia para evitar erros.
        var listaDeSorteio = itensDisponiveis.length > 0 ? itensDisponiveis : exports.TIPOS_DE_POWERUPS;
        var numero = Math.floor(Math.random() * listaDeSorteio.length);
        this.tipo = listaDeSorteio[numero];
        return this.tipo;
    };
    return PowerUps;
}());
exports.PowerUps = PowerUps;
