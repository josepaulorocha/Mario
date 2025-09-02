// A lista global pode servir como um fallback ou uma referência de todos os itens possíveis.
export const TIPOS_DE_POWERUPS = ["Cogumelo", "Flor de fogo", "Estrela", "Pena"];
export class PowerUps {
    constructor() {
        this.tipo = "Desconhecido";
    }
    /**
     * Gera um Power-Up a partir de uma lista de itens fornecida.
     * Se nenhuma lista for fornecida, usa a lista global como padrão.
     * @param itensDisponiveis Um array com os itens possíveis para sorteio.
     * @returns O nome do Power-Up gerado.
     */
    gerarPowerUp(itensDisponiveis) {
        // Garante que a lista não está vazia para evitar erros.
        const listaDeSorteio = itensDisponiveis.length > 0 ? itensDisponiveis : TIPOS_DE_POWERUPS;
        const numero = Math.floor(Math.random() * listaDeSorteio.length);
        this.tipo = listaDeSorteio[numero];
        return this.tipo;
    }
}
