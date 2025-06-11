"use strict";
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
    return FilaDupla;
}());
exports.FilaDupla = FilaDupla;
