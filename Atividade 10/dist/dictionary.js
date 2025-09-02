import { ValuePair } from './value-pair.js';
// Função auxiliar para converter a chave em string.
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
export class Dictionary {
    constructor(toStrFn = defaultToString) {
        this.toStrFn = toStrFn;
        this.table = {};
    }
    // Verifica se uma chave existe no dicionário.
    hasKey(key) {
        return this.table[this.toStrFn(key)] != null;
    }
    // Adiciona um novo par chave-valor ou atualiza um existente.
    set(key, value) {
        if (key != null && value != null) {
            const tableKey = this.toStrFn(key);
            this.table[tableKey] = new ValuePair(key, value);
            return true;
        }
        return false;
    }
    // Remove um par chave-valor do dicionário.
    remove(key) {
        if (this.hasKey(key)) {
            delete this.table[this.toStrFn(key)];
            return true;
        }
        return false;
    }
    // Retorna o valor associado a uma chave.
    get(key) {
        const valuePair = this.table[this.toStrFn(key)];
        return valuePair == null ? undefined : valuePair.value;
    }
    // Retorna um array com todos os pares chave-valor.
    keyValues() {
        return Object.values(this.table);
    }
    // Executa uma função de callback para cada par chave-valor no dicionário.
    forEach(callbackFn) {
        const valuePairs = this.keyValues();
        for (let i = 0; i < valuePairs.length; i++) {
            const result = callbackFn(valuePairs[i].key, valuePairs[i].value);
            if (result === false) {
                break;
            }
        }
    }
    // --- MÉTODOS ADICIONADOS ---
    /**
     * Verifica se o dicionário está vazio.
     * @returns True se não houver elementos, false caso contrário.
     */
    isEmpty() {
        return this.keyValues().length === 0;
    }
    /**
     * Retorna o número de elementos no dicionário.
     * @returns O número de pares chave-valor.
     */
    size() {
        return this.keyValues().length;
    }
    /**
     * Limpa todos os elementos do dicionário.
     */
    clear() {
        this.table = {};
    }
    /**
     * Retorna uma representação em string do dicionário.
     */
    toString() {
        if (this.isEmpty()) {
            return '';
        }
        const valuePairs = this.keyValues();
        let objString = `${valuePairs[0].toString()}`;
        for (let i = 1; i < valuePairs.length; i++) {
            objString = `${objString},${valuePairs[i].toString()}`;
        }
        return objString;
    }
}
