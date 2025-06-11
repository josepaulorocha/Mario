"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pilha = void 0;
var Pilha = /** @class */ (function () {
    function Pilha() {
        this.storage = [];
    }
    // Adiciona um item ao topo da pilha
    Pilha.prototype.push = function (item) {
        this.storage.push(item);
    };
    // Remove e retorna o item do topo da pilha
    Pilha.prototype.pop = function () {
        return this.storage.pop();
    };
    // Retorna o item do topo sem remover
    Pilha.prototype.peek = function () {
        return this.storage[this.storage.length - 1];
    };
    // Verifica se a pilha está vazia
    Pilha.prototype.isEmpty = function () {
        return this.storage.length === 0;
    };
    return Pilha;
}());
exports.Pilha = Pilha;
