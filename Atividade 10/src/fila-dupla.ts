export class FilaDupla<T> {
    private items: T[];
    private count: number; // Adicionado para contar os elementos

    constructor() {
        this.items = [];
        this.count = 0; // Inicia em 0
    }

    addFront(element: T): void {
        this.items.unshift(element);
        this.count++; // Incrementa
    }

    addBack(element: T): void {
        this.items.push(element);
        this.count++; // Incrementa
    }

    removeFront(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        this.count--; // Decrementa
        return this.items.shift();
    }

    removeBack(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        this.count--; // Decrementa
        return this.items.pop();
    }

    peekFront(): T | undefined {
        return this.items[0];
    }

    peekBack(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.count === 0;
    }

    // Método size() agora existe e é eficiente
    size(): number {
        return this.count;
    }

    clear(): void {
        this.items = [];
        this.count = 0;
    }

    toString(): string {
        return this.items.toString();
    }
}