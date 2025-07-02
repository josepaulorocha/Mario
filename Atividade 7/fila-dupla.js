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
exports.FilaDupla = void 0;
var FilaDupla = /** @class */ (function () {
    function FilaDupla() {
        this.storage = [];
    }
    // Adiciona um item no final da fila
    FilaDupla.prototype.addBack = function (item) {
        this.storage.push(item);
    };
    // Adiciona um item na frente da fila
    FilaDupla.prototype.addFront = function (item) {
        this.storage.unshift(item);
    };
    // Remove e retorna o item da frente
    FilaDupla.prototype.removeFront = function () {
        return this.storage.shift();
    };
    // Verifica se a fila está vazia
    FilaDupla.prototype.isEmpty = function () {
        return this.storage.length === 0;
    };
    // Retorna uma cópia do array interno para análise, sem modificar a fila
    FilaDupla.prototype.toArray = function () {
        return __spreadArray([], this.storage, true);
    };
    return FilaDupla;
}());
exports.FilaDupla = FilaDupla;
