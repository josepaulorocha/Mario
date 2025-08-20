import { Personagem } from "./personagem"
import { Inimigo } from "./inimigo"
import { LinkedListOfSets, ListNode } from "./lista-ligada-sets"
import { DoublyCircularLinkedList } from "./lista-circular"
import { FilaDupla } from "./fila-dupla"
import { Pilha } from "./pilha"
import { PowerUps } from "./powerups"
import { mergeSort } from "./ordenacao"
import { Dictionary } from "./dictionary" // Importação

// --- SETUP DO MUNDO E PERSONAGENS ---
const historicoDeAcoes = new Pilha<string>();
const filaDeLogs = new FilaDupla<string>();
const conquistadoresDeRegiao = new Dictionary<string, string>();

const mundo1 = new LinkedListOfSets<string>();
const nomesDasRegioes = ["Campos Verdes", "Caverna Sombria", "Castelo do Bowser"];
mundo1.add(new Set(["Cogumelo", "Flor de fogo", "Pena"]));
mundo1.add(new Set(["Cogumelo", "Estrela"]));
mundo1.add(new Set(["Estrela", "Cogumelo", "Pena"]));

let regiaoAtualNode: ListNode<Set<string>> | null = mundo1.getHead();
let indiceRegiaoAtual = 0;
const regioesCompletadas = new Set<string>();

const listaDeJogadores = new DoublyCircularLinkedList<Personagem>();
const mario = new Personagem("Mario", filaDeLogs, historicoDeAcoes);
const luigi = new Personagem("Luigi", filaDeLogs, historicoDeAcoes);
const peach = new Personagem("Peach", filaDeLogs, historicoDeAcoes);
listaDeJogadores.add(mario);
listaDeJogadores.add(luigi);
listaDeJogadores.add(peach);

const filaDeInimigos = new FilaDupla<Inimigo>();
[new Inimigo("Goomba"), new Inimigo("Koopa Troopa"), new Inimigo("Bowser")]
    .forEach(inimigo => filaDeInimigos.addBack(inimigo));

const geradorDePowerUp = new PowerUps();

// --- INÍCIO DO JOGO ---
filaDeLogs.addBack(`\n=== Início da partida em: ${nomesDasRegioes[indiceRegiaoAtual]} ===`);

for (let rodada = 1; rodada <= 15; rodada++) {
    const personagemDaVez = listaDeJogadores.proximoTurno()!;
    
    if (personagemDaVez.isDerrotado) {
        filaDeLogs.addBack(`\n--- Rodada ${rodada} (Vez de: ${personagemDaVez.nome}, que está fora de jogo) ---`);
        continue;
    }
    
    filaDeLogs.addBack(`\n--- Rodada ${rodada} (Vez de: ${personagemDaVez.nome} em ${nomesDasRegioes[indiceRegiaoAtual]}) ---`);

    const chanceEvento = Math.random();

    if (chanceEvento <= 0.65) {
        const inimigoAtacante = filaDeInimigos.removeFront();
        if (inimigoAtacante) {
            filaDeLogs.addBack(`${inimigoAtacante.tipo} se prepara para atacar ${personagemDaVez.nome}!`);
            const itensDeDefesa = personagemDaVez.inventario.toArray().filter(item => item === "Pena");
            if (itensDeDefesa.length > 0) {
                personagemDaVez.consumirItem("Pena");
                filaDeLogs.addBack(`-> [FILTER] ${personagemDaVez.nome} usou uma Pena para desviar perfeitamente do ataque!`);
            } else {
                inimigoAtacante.atacar(personagemDaVez, filaDeLogs, historicoDeAcoes);
            }
            filaDeInimigos.addBack(inimigoAtacante);
        }
    } else {
        if (regiaoAtualNode) {
            const itensDaRegiao = Array.from(regiaoAtualNode.data);
            const powerUpGerado = geradorDePowerUp.gerarPowerUp(itensDaRegiao);
            
            filaDeLogs.addBack(`Um Power-Up (${powerUpGerado}) apareceu para ${personagemDaVez.nome}!`);
            personagemDaVez.coletarPowerUp(powerUpGerado);

            const nomeRegiao = nomesDasRegioes[indiceRegiaoAtual];
            if (!regioesCompletadas.has(nomeRegiao)) {
                const inventarioSet = new Set(personagemDaVez.inventario.toArray());
                const completouRegiao = Array.from(regiaoAtualNode.data).every(item => inventarioSet.has(item));
                
                if (completouRegiao) {
                    regioesCompletadas.add(nomeRegiao);
                    if (!conquistadoresDeRegiao.hasKey(nomeRegiao)) {
                        conquistadoresDeRegiao.set(nomeRegiao, personagemDaVez.nome);
                        filaDeLogs.addBack(`-> [PRIMEIRA CONQUISTA!] ${personagemDaVez.nome} foi o(a) primeiro(a) a coletar todos os itens de ${nomeRegiao}! Bônus de +5000 pontos!`);
                        personagemDaVez.pontuacoesRodadas.push(5000);
                    }
                }
            }
        }
    }

    if (personagemDaVez.vidas <= 0 && !personagemDaVez.isDerrotado) {
        historicoDeAcoes.push(`${personagemDaVez.nome} foi derrotado(a).`);
        personagemDaVez.isDerrotado = true;
    }

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
jogadores.sort((a, b) => b.calcularPontuacaoTotal() - a.calcularPontuacaoTotal());
jogadores.forEach((jogador, index) => {
    console.log(`${index + 1}º Lugar: ${jogador.nome} - ${jogador.calcularPontuacaoTotal()} pontos (Vidas: ${jogador.vidas})`);
});

console.log("\n--- Melhores Pontuações Individuais (por Rodada) ---");
jogadores.forEach(jogador => {
    if (jogador.pontuacoesRodadas.length > 0) {
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

console.log("\n--- Relatório de Conquistas de Região (Dictionary) ---");
if (conquistadoresDeRegiao.isEmpty()) {
    console.log("Nenhum jogador foi o primeiro a conquistar uma região nesta partida.");
} else {
    conquistadoresDeRegiao.forEach((regiao, jogador) => {
        console.log(`- A região '${regiao}' foi conquistada primeiro por: ${jogador}!`);
    });
}

// --- SEÇÃO 4: DEMONSTRAÇÃO CORRIGIDA DOS MÉTODOS DA HASHTABLE ---
console.log("\n--- Gerenciamento de Itens Especiais com HashTable (Dictionary) ---");

// Criando um novo Dictionary para itens especiais do jogo
const itensEspeciais = new Dictionary<string, string>();
itensEspeciais.set("Chave do Castelo", "Item raro para abrir a porta final.");
itensEspeciais.set("Pena Dourada", "Permite voar por tempo ilimitado.");
itensEspeciais.set("Moeda Estrela", "Vale por 100 moedas normais.");

// 1. Usando o método toString() para exibir o conteúdo da tabela
console.log("Inventário de itens especiais:", itensEspeciais.toString());

// 2. Usando o método get() para buscar um item específico
console.log("\nBuscando a 'Pena Dourada':", itensEspeciais.get("Pena Dourada"));

// 3. Usando o método remove() para simular o uso de um item
console.log("\nMario usou a 'Chave do Castelo'!");
itensEspeciais.remove("Chave do Castelo");
console.log("Inventário após usar a chave:", itensEspeciais.toString());

// 4. Usando os métodos size() e isEmpty() para verificar o estado
console.log(`\nAgora existem ${itensEspeciais.size()} itens especiais restantes.`);
if (!itensEspeciais.isEmpty()) {
    console.log("O inventário de itens especiais ainda contém itens valiosos!");
}