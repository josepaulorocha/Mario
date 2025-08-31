import { ValuePair } from './value-pair';

// Função auxiliar para converter a chave em string.
function defaultToString(item: any): string {
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

export class Dictionary<K, V> {
    private table: { [key: string]: ValuePair<K, V> };
    private toStrFn: (key: K) => string;

    constructor(toStrFn: (key: K) => string = defaultToString) {
        this.toStrFn = toStrFn;
        this.table = {};
    }

    // Verifica se uma chave existe no dicionário.
    hasKey(key: K): boolean {
        return this.table[this.toStrFn(key)] != null;
    }

    // Adiciona um novo par chave-valor ou atualiza um existente.
    set(key: K, value: V): boolean {
        if (key != null && value != null) {
            const tableKey = this.toStrFn(key);
            this.table[tableKey] = new ValuePair(key, value);
            return true;
        }
        return false;
    }

    // Remove um par chave-valor do dicionário.
    remove(key: K): boolean {
        if (this.hasKey(key)) {
            delete this.table[this.toStrFn(key)];
            return true;
        }
        return false;
    }

    // Retorna o valor associado a uma chave.
    get(key: K): V | undefined {
        const valuePair = this.table[this.toStrFn(key)];
        return valuePair == null ? undefined : valuePair.value;
    }

    // Retorna um array com todos os pares chave-valor.
    keyValues(): ValuePair<K, V>[] {
        return Object.values(this.table);
    }

    // Executa uma função de callback para cada par chave-valor no dicionário.
    forEach(callbackFn: (key: K, value: V) => any): void {
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
    isEmpty(): boolean {
        return this.keyValues().length === 0;
    }

    /**
     * Retorna o número de elementos no dicionário.
     * @returns O número de pares chave-valor.
     */
    size(): number {
        return this.keyValues().length;
    }
    
    /**
     * Limpa todos os elementos do dicionário.
     */
    clear(): void {
        this.table = {};
    }

    /**
     * Retorna uma representação em string do dicionário.
     */
    toString(): string {
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