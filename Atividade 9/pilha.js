"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
    // Retorna uma cópia do array interno para análise, sem modificar a pilha
    Pilha.prototype.toArray = function () {
        return __spreadArray([], this.storage, true);
    };
    /**
     * Remove um item específico da pilha. Não é uma operação de pilha padrão,
     * mas é útil para mecânicas de jogo onde um item específico é consumido.
     * @param item O item a ser removido.
     * @returns Retorna true se o item foi encontrado e removido, false caso contrário.
     */
    Pilha.prototype.removerItem = function (item) {
        var index = this.storage.lastIndexOf(item); // Pega o último adicionado
        if (index !== -1) {
            this.storage.splice(index, 1);
            return true;
        }
        return false;
    };
    return Pilha;
}());
exports.Pilha = Pilha;
