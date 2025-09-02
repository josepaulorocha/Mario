// Atividade 10/hash_table.ts (CORRIGIDO)
import { ValuePair } from './value-pair.js';
// Função auxiliar para converter qualquer chave em uma string.
function defaultToString(item) {
    if (item === null) {
        return 'NULL';
    }
    if (item === undefined) {
        return 'UNDEFINED';
    }
    if (typeof item === 'string' || item instanceof String) {
        return `${item}`;
    }
    return item.toString();
}
export class HashTable {
    constructor(toStrFn = defaultToString) {
        this.toStrFn = toStrFn;
        this.table = {};
    }
    /**
     * Função de hash 'loselose'. Não recomendada para produção devido
     * ao alto número de colisões, mas mantida para fins de estudo.
     */
    loseloseHashCode(key) {
        if (typeof key === 'number') {
            return key;
        }
        const tableKey = this.toStrFn(key);
        let hash = 0;
        for (let i = 0; i < tableKey.length; i++) {
            hash += tableKey.charCodeAt(i);
        }
        return hash % 37;
    }
    /**
     * Função de hash djb2, que oferece uma distribuição muito melhor e
     * menos colisões que a 'loselose'.
     */
    djb2HashCode(key) {
        const tableKey = this.toStrFn(key);
        let hash = 5381;
        for (let i = 0; i < tableKey.length; i++) {
            hash = (hash * 33) + tableKey.charCodeAt(i);
        }
        return hash % 1013;
    }
    /**
     * Retorna o código hash para uma chave. Atualmente, usa a implementação
     * mais eficiente (djb2).
     */
    hashCode(key) {
        return this.djb2HashCode(key);
    }
    /**
     * Adiciona um novo par (chave, valor) à tabela hash.
     */
    put(key, value) {
        if (key != null && value != null) {
            const position = this.hashCode(key);
            this.table[position] = new ValuePair(key, value);
            return true;
        }
        return false;
    }
    /**
     * Retorna o valor associado a uma chave específica.
     */
    get(key) {
        const valuePair = this.table[this.hashCode(key)];
        return valuePair == null ? undefined : valuePair.value;
    }
    /**
     * Remove um valor da tabela hash usando a chave.
     */
    remove(key) {
        const hash = this.hashCode(key);
        const valuePair = this.table[hash];
        if (valuePair != null) {
            delete this.table[hash];
            return true;
        }
        return false;
    }
    getTable() {
        return this.table;
    }
    // --- NOVO MÉTODO ADICIONADO ---
    /**
     * Retorna um array com todos os pares chave-valor.
     */
    keyValues() {
        return Object.values(this.table);
    }
    isEmpty() {
        return this.size() === 0;
    }
    size() {
        return Object.keys(this.table).length;
    }
    clear() {
        this.table = {};
    }
    toString() {
        if (this.isEmpty()) {
            return '';
        }
        const keys = Object.keys(this.table);
        let objString = `{${keys[0]} => ${this.table[keys[0]].toString()}}`;
        for (let i = 1; i < keys.length; i++) {
            objString = `${objString},{${keys[i]} => ${this.table[keys[i]].toString()}}`;
        }
        return objString;
    }
}
