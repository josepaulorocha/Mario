import { Personagem } from "./personagem";
import { Inimigo } from "./inimigo";
import { LinkedListOfSets, ListNode } from "./lista-ligada-sets";
import { DoublyCircularLinkedList } from "./lista-circular";
import { FilaDupla } from "./fila-dupla";
import { Pilha } from "./pilha";
import { PowerUps } from "./powerups";
import { mergeSort } from "./ordenacao";

// --- CONFIGURAÇÃO INICIAL ---
const historicoDeAcoes = new Pilha<string>(); // Guarda ações para exibir no final (LIFO).
const filaDeLogs = new FilaDupla<string>(); // Guarda eventos para exibir em ordem (FIFO).

// O mundo é uma lista ligada de Sets, onde cada Set contém os itens de uma região.
const mundo1 = new LinkedListOfSets<string>();
const nomesDasRegioes = ["Campos Verdes", "Caverna Sombria", "Castelo do Bowser"];
mundo1.add(new Set(["Cogumelo", "Flor de fogo", "Pena"]));
mundo1.add(new Set(["Cogumelo", "Estrela"]));
mundo1.add(new Set(["Estrela", "Cogumelo", "Pena"]));

let regiaoAtualNode: ListNode<Set<string>> | null = mundo1.getHead();
let indiceRegiaoAtual = 0;
const regioesCompletadas = new Set<string>();

// A lista circular garante que o turno passe para o próximo jogador de forma contínua.
const listaDeJogadores = new DoublyCircularLinkedList<Personagem>();
const mario = new Personagem("Mario", filaDeLogs, historicoDeAcoes);
const luigi = new Personagem("Luigi", filaDeLogs, historicoDeAcoes);
const peach = new Personagem("Peach", filaDeLogs, historicoDeAcoes);
listaDeJogadores.add(mario);
listaDeJogadores.add(luigi);
listaDeJogadores.add(peach);

// A fila de inimigos garante que eles ataquem em uma ordem rotativa.
const filaDeInimigos = new FilaDupla<Inimigo>();
[new Inimigo("Goomba"), new Inimigo("Koopa Troopa"), new Inimigo("Bowser")]
    .forEach(inimigo => filaDeInimigos.addBack(inimigo));

const geradorDePowerUp = new PowerUps();

// --- INÍCIO DO JOGO ---
filaDeLogs.addBack(`\n=== Início da partida em: ${nomesDasRegioes[indiceRegiaoAtual]} ===`);

for (let rodada = 1; rodada <= 15; rodada++) {
    const personagemDaVez = listaDeJogadores.proximoTurno()!;
    
    // Pula o turno se o personagem estiver derrotado.
    if (personagemDaVez.isDerrotado) {
        filaDeLogs.addBack(`\n--- Rodada ${rodada} (Vez de: ${personagemDaVez.nome}, que está fora de jogo) ---`);
        continue;
    }
    
    filaDeLogs.addBack(`\n--- Rodada ${rodada} (Vez de: ${personagemDaVez.nome} em ${nomesDasRegioes[indiceRegiaoAtual]}) ---`);

    const chanceEvento = Math.random();

    // 65% de chance de um inimigo atacar.
    if (chanceEvento <= 0.65) {
        const inimigoAtacante = filaDeInimigos.removeFront();
        if (inimigoAtacante) {
            filaDeLogs.addBack(`${inimigoAtacante.tipo} se prepara para atacar ${personagemDaVez.nome}!`);

            // [FILTER] Usa uma Pena do inventário para se defender automaticamente.
            const itensDeDefesa = personagemDaVez.inventario.toArray().filter(item => item === "Pena");
            if (itensDeDefesa.length > 0) {
                personagemDaVez.consumirItem("Pena");
                filaDeLogs.addBack(`-> [FILTER] ${personagemDaVez.nome} usou uma Pena para desviar perfeitamente do ataque!`);
            } else {
                inimigoAtacante.atacar(personagemDaVez, filaDeLogs, historicoDeAcoes);
            }
            filaDeInimigos.addBack(inimigoAtacante); // Inimigo volta para o final da fila.
        }
    } else { // Chance de encontrar um power-up.
        if (regiaoAtualNode) {
            const itensDaRegiao = Array.from(regiaoAtualNode.data);
            const powerUpGerado = geradorDePowerUp.gerarPowerUp(itensDaRegiao);
            
            personagemDaVez.coletarPowerUp(powerUpGerado);

            // [EVERY] Verifica se o jogador coletou TODOS os itens da região atual.
            const nomeRegiao = nomesDasRegioes[indiceRegiaoAtual];
            if (!regioesCompletadas.has(nomeRegiao)) {
                const inventarioSet = new Set(personagemDaVez.inventario.toArray());
                const completouRegiao = Array.from(regiaoAtualNode.data).every(item => inventarioSet.has(item));

                if (completouRegiao) {
                    filaDeLogs.addBack(`-> [EVERY] Conquista! ${personagemDaVez.nome} coletou todos os itens de ${nomeRegiao}! +5000 pontos!`);
                    personagemDaVez.pontuacoesRodadas.push(5000);
                    regioesCompletadas.add(nomeRegiao);
                }
            }
        }
    }

    if (personagemDaVez.vidas <= 0 && !personagemDaVez.isDerrotado) {
        historicoDeAcoes.push(`${personagemDaVez.nome} foi derrotado(a).`);
        personagemDaVez.isDerrotado = true;
    }

    // A cada 5 rodadas, avança para a próxima região.
    if (rodada % 5 === 0 && regiaoAtualNode?.next) {
        regiaoAtualNode = regiaoAtualNode.next;
        indiceRegiaoAtual++;
        filaDeLogs.addBack(`\n*** O grupo avançou para a região: ${nomesDasRegioes[indiceRegiaoAtual]}! ***`);
    }
}

// --- PÓS-JOGO ---
console.log("\n--- Log de Eventos da Partida ---");
while (!filaDeLogs.isEmpty()) {
    console.log(filaDeLogs.removeFront());
}

console.log("\n--- Ranking Final dos Jogadores ---");
const jogadores = [mario, luigi, peach];
// Ordena os jogadores pela pontuação final.
jogadores.sort((a, b) => b.calcularPontuacaoTotal() - a.calcularPontuacaoTotal());

jogadores.forEach((jogador, index) => {
    console.log(`${index + 1}º Lugar: ${jogador.nome} - ${jogador.calcularPontuacaoTotal()} pontos (Vidas: ${jogador.vidas})`);
});

console.log("\n--- Melhores Pontuações Individuais (por Rodada) ---");
jogadores.forEach(jogador => {
    if (jogador.pontuacoesRodadas.length > 0) {
        // Ordena as pontuações com mergeSort para exibir as 3 melhores.
        const pontuacoesOrdenadas = mergeSort(jogador.pontuacoesRodadas).reverse();
        const melhores3 = pontuacoesOrdenadas.slice(0, 3).join(' | ');
        console.log(`> ${jogador.nome}: ${melhores3}`);
    } else {
        console.log(`> ${jogador.nome}: Nenhuma pontuação registrada.`);
    }
});


console.log("\n--- Histórico de Ações (Última para Primeira) ---");
while (!historicoDeAcoes.isEmpty()) {
    console.log(`- ${historicoDeAcoes.pop()}`);
}