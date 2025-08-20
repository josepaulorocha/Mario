"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashTable = void 0;
var value_pair_1 = require("./value-pair");
// Função auxiliar para converter qualquer chave em uma string.
function defaultToString(item) {
    if (item === null) {
        return 'NULL';
    }
    if (item === undefined) {
        return 'UNDEFINED';
    }
    if (typeof item === 'string' || item instanceof String) {
        return "".concat(item);
    }
    return item.toString();
}
var HashTable = /** @class */ (function () {
    function HashTable(toStrFn) {
        if (toStrFn === void 0) { toStrFn = defaultToString; }
        this.toStrFn = toStrFn;
        this.table = {};
    }
    /**
     * Função de hash 'loselose'. Não recomendada para produção devido
     * ao alto número de colisões, mas mantida para fins de estudo.
     */
    HashTable.prototype.loseloseHashCode = function (key) {
        if (typeof key === 'number') {
            return key;
        }
        var tableKey = this.toStrFn(key);
        var hash = 0;
        for (var i = 0; i < tableKey.length; i++) {
            hash += tableKey.charCodeAt(i);
        }
        return hash % 37;
    };
    /**
     * Função de hash djb2, que oferece uma distribuição muito melhor e
     * menos colisões que a 'loselose'.
     */
    HashTable.prototype.djb2HashCode = function (key) {
        var tableKey = this.toStrFn(key);
        var hash = 5381;
        for (var i = 0; i < tableKey.length; i++) {
            hash = (hash * 33) + tableKey.charCodeAt(i);
        }
        return hash % 1013;
    };
    /**
     * Retorna o código hash para uma chave. Atualmente, usa a implementação
     * mais eficiente (djb2).
     */
    HashTable.prototype.hashCode = function (key) {
        return this.djb2HashCode(key);
    };
    /**
     * Adiciona um novo par (chave, valor) à tabela hash.
     */
    HashTable.prototype.put = function (key, value) {
        if (key != null && value != null) {
            var position = this.hashCode(key);
            this.table[position] = new value_pair_1.ValuePair(key, value);
            return true;
        }
        return false;
    };
    /**
     * Retorna o valor associado a uma chave específica.
     */
    HashTable.prototype.get = function (key) {
        var valuePair = this.table[this.hashCode(key)];
        return valuePair == null ? undefined : valuePair.value;
    };
    /**
     * Remove um valor da tabela hash usando a chave.
     */
    HashTable.prototype.remove = function (key) {
        var hash = this.hashCode(key);
        var valuePair = this.table[hash];
        if (valuePair != null) {
            delete this.table[hash];
            return true;
        }
        return false;
    };
    HashTable.prototype.getTable = function () {
        return this.table;
    };
    HashTable.prototype.isEmpty = function () {
        return this.size() === 0;
    };
    HashTable.prototype.size = function () {
        return Object.keys(this.table).length;
    };
    HashTable.prototype.clear = function () {
        this.table = {};
    };
    HashTable.prototype.toString = function () {
        if (this.isEmpty()) {
            return '';
        }
        var keys = Object.keys(this.table);
        var objString = "{".concat(keys[0], " => ").concat(this.table[keys[0]].toString(), "}");
        for (var i = 1; i < keys.length; i++) {
            objString = "".concat(objString, ",{").concat(keys[i], " => ").concat(this.table[keys[i]].toString(), "}");
        }
        return objString;
    };
    return HashTable;
}());
exports.HashTable = HashTable;
