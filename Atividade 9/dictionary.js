"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
var value_pair_1 = require("./value-pair");
// Função auxiliar para converter a chave em string.
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
var Dictionary = /** @class */ (function () {
    function Dictionary(toStrFn) {
        if (toStrFn === void 0) { toStrFn = defaultToString; }
        this.toStrFn = toStrFn;
        this.table = {};
    }
    // Verifica se uma chave existe no dicionário.
    Dictionary.prototype.hasKey = function (key) {
        return this.table[this.toStrFn(key)] != null;
    };
    // Adiciona um novo par chave-valor ou atualiza um existente.
    Dictionary.prototype.set = function (key, value) {
        if (key != null && value != null) {
            var tableKey = this.toStrFn(key);
            this.table[tableKey] = new value_pair_1.ValuePair(key, value);
            return true;
        }
        return false;
    };
    // Remove um par chave-valor do dicionário.
    Dictionary.prototype.remove = function (key) {
        if (this.hasKey(key)) {
            delete this.table[this.toStrFn(key)];
            return true;
        }
        return false;
    };
    // Retorna o valor associado a uma chave.
    Dictionary.prototype.get = function (key) {
        var valuePair = this.table[this.toStrFn(key)];
        return valuePair == null ? undefined : valuePair.value;
    };
    // Retorna um array com todos os pares chave-valor.
    Dictionary.prototype.keyValues = function () {
        return Object.values(this.table);
    };
    // Executa uma função de callback para cada par chave-valor no dicionário.
    Dictionary.prototype.forEach = function (callbackFn) {
        var valuePairs = this.keyValues();
        for (var i = 0; i < valuePairs.length; i++) {
            var result = callbackFn(valuePairs[i].key, valuePairs[i].value);
            if (result === false) {
                break;
            }
        }
    };
    // --- MÉTODOS ADICIONADOS ---
    /**
     * Verifica se o dicionário está vazio.
     * @returns True se não houver elementos, false caso contrário.
     */
    Dictionary.prototype.isEmpty = function () {
        return this.keyValues().length === 0;
    };
    /**
     * Retorna o número de elementos no dicionário.
     * @returns O número de pares chave-valor.
     */
    Dictionary.prototype.size = function () {
        return this.keyValues().length;
    };
    /**
     * Limpa todos os elementos do dicionário.
     */
    Dictionary.prototype.clear = function () {
        this.table = {};
    };
    /**
     * Retorna uma representação em string do dicionário.
     */
    Dictionary.prototype.toString = function () {
        if (this.isEmpty()) {
            return '';
        }
        var valuePairs = this.keyValues();
        var objString = "".concat(valuePairs[0].toString());
        for (var i = 1; i < valuePairs.length; i++) {
            objString = "".concat(objString, ",").concat(valuePairs[i].toString());
        }
        return objString;
    };
    return Dictionary;
}());
exports.Dictionary = Dictionary;
