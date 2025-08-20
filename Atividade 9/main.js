"use strict";
// Atividade 8/main.ts
Object.defineProperty(exports, "__esModule", { value: true });
var personagem_1 = require("./personagem");
var inimigo_1 = require("./inimigo");
var lista_ligada_sets_1 = require("./lista-ligada-sets");
var lista_circular_1 = require("./lista-circular");
var fila_dupla_1 = require("./fila-dupla");
var pilha_1 = require("./pilha");
var powerups_1 = require("./powerups");
var ordenacao_1 = require("./ordenacao");
var dictionary_1 = require("./dictionary");
var hash_table_1 = require("./hash_table");
// --- SETUP DO MUNDO E PERSONAGENS ---
var historicoDeAcoes = new pilha_1.Pilha();
var filaDeLogs = new fila_dupla_1.FilaDupla();
// FUNCIONALIDADE 1: Usa Dictionary para registrar o primeiro a conquistar uma região
var conquistadoresDeRegiao = new dictionary_1.Dictionary();
// NOVA FUNCIONALIDADE: Usa HashTable para contar encontros com inimigos
// Onde a chave é o nome do inimigo (string) e o valor é o número de encontros (number)
var registroInimigos = new hash_table_1.HashTable();
var mundo1 = new lista_ligada_sets_1.LinkedListOfSets();
var nomesDasRegioes = ["Campos Verdes", "Caverna Sombria", "Castelo do Bowser"];
mundo1.add(new Set(["Cogumelo", "Flor de fogo", "Pena"]));
mundo1.add(new Set(["Cogumelo", "Estrela"]));
mundo1.add(new Set(["Estrela", "Cogumelo", "Pena"]));
var regiaoAtualNode = mundo1.getHead();
var indiceRegiaoAtual = 0;
var regioesCompletadas = new Set();
var listaDeJogadores = new lista_circular_1.DoublyCircularLinkedList();
var mario = new personagem_1.Personagem("Mario", filaDeLogs, historicoDeAcoes);
var luigi = new personagem_1.Personagem("Luigi", filaDeLogs, historicoDeAcoes);
var peach = new personagem_1.Personagem("Peach", filaDeLogs, historicoDeAcoes);
listaDeJogadores.add(mario);
listaDeJogadores.add(luigi);
listaDeJogadores.add(peach);
var filaDeInimigos = new fila_dupla_1.FilaDupla();
[new inimigo_1.Inimigo("Goomba"), new inimigo_1.Inimigo("Koopa Troopa"), new inimigo_1.Inimigo("Bowser")]
    .forEach(function (inimigo) { return filaDeInimigos.addBack(inimigo); });
var geradorDePowerUp = new powerups_1.PowerUps();
// --- INÍCIO DO JOGO ---
filaDeLogs.addBack("\n=== In\u00EDcio da partida em: ".concat(nomesDasRegioes[indiceRegiaoAtual], " ==="));
var _loop_1 = function (rodada) {
    var personagemDaVez = listaDeJogadores.proximoTurno();
    if (personagemDaVez.isDerrotado) {
        filaDeLogs.addBack("\n--- Rodada ".concat(rodada, " (Vez de: ").concat(personagemDaVez.nome, ", que est\u00E1 fora de jogo) ---"));
        return "continue";
    }
    filaDeLogs.addBack("\n--- Rodada ".concat(rodada, " (Vez de: ").concat(personagemDaVez.nome, " em ").concat(nomesDasRegioes[indiceRegiaoAtual], ") ---"));
    var chanceEvento = Math.random();
    if (chanceEvento <= 0.65) { // Evento de ataque de inimigo
        var inimigoAtacante = filaDeInimigos.removeFront();
        if (inimigoAtacante) {
            filaDeLogs.addBack("".concat(inimigoAtacante.tipo, " se prepara para atacar ").concat(personagemDaVez.nome, "!"));
            // --- LÓGICA DA HASHTABLE (REGISTRO DE INIMIGOS) ---
            var encontrosAnteriores = registroInimigos.get(inimigoAtacante.tipo) || 0;
            registroInimigos.put(inimigoAtacante.tipo, encontrosAnteriores + 1);
            // ----------------------------------------------------
            var itensDeDefesa = personagemDaVez.inventario.toArray().filter(function (item) { return item === "Pena"; });
            if (itensDeDefesa.length > 0) {
                personagemDaVez.consumirItem("Pena");
                filaDeLogs.addBack("-> [FILTER] ".concat(personagemDaVez.nome, " usou uma Pena para desviar perfeitamente do ataque!"));
            }
            else {
                inimigoAtacante.atacar(personagemDaVez, filaDeLogs, historicoDeAcoes);
            }
            filaDeInimigos.addBack(inimigoAtacante);
        }
    }
    else { // Evento de Power-Up
        if (regiaoAtualNode) {
            var itensDaRegiao = Array.from(regiaoAtualNode.data);
            var powerUpGerado = geradorDePowerUp.gerarPowerUp(itensDaRegiao);
            filaDeLogs.addBack("Um Power-Up (".concat(powerUpGerado, ") apareceu para ").concat(personagemDaVez.nome, "!"));
            personagemDaVez.coletarPowerUp(powerUpGerado);
            // Lógica do Dictionary (Conquistas)
            var nomeRegiao = nomesDasRegioes[indiceRegiaoAtual];
            if (!regioesCompletadas.has(nomeRegiao)) {
                var inventarioSet_1 = new Set(personagemDaVez.inventario.toArray());
                var completouRegiao = Array.from(regiaoAtualNode.data).every(function (item) { return inventarioSet_1.has(item); });
                if (completouRegiao) {
                    regioesCompletadas.add(nomeRegiao);
                    if (!conquistadoresDeRegiao.hasKey(nomeRegiao)) {
                        conquistadoresDeRegiao.set(nomeRegiao, personagemDaVez.nome);
                        filaDeLogs.addBack("-> [PRIMEIRA CONQUISTA!] ".concat(personagemDaVez.nome, " foi o(a) primeiro(a) a coletar todos os itens de ").concat(nomeRegiao, "! B\u00F4nus de +5000 pontos!"));
                        personagemDaVez.pontuacoesRodadas.push(5000);
                    }
                }
            }
        }
    }
    if (personagemDaVez.vidas <= 0 && !personagemDaVez.isDerrotado) {
        historicoDeAcoes.push("".concat(personagemDaVez.nome, " foi derrotado(a)."));
        personagemDaVez.isDerrotado = true;
    }
    if (rodada % 5 === 0 && (regiaoAtualNode === null || regiaoAtualNode === void 0 ? void 0 : regiaoAtualNode.next)) {
        regiaoAtualNode = regiaoAtualNode.next;
        indiceRegiaoAtual++;
        filaDeLogs.addBack("\n*** O grupo avan\u00E7ou para a regi\u00E3o: ".concat(nomesDasRegioes[indiceRegiaoAtual], "! ***"));
    }
};
for (var rodada = 1; rodada <= 15; rodada++) {
    _loop_1(rodada);
}
// --- PÓS-JOGO ---
console.log("\n--- Log de Eventos da Partida ---");
while (!filaDeLogs.isEmpty()) {
    console.log(filaDeLogs.removeFront());
}
console.log("\n--- Ranking Final dos Jogadores ---");
var jogadores = [mario, luigi, peach];
jogadores.sort(function (a, b) { return b.calcularPontuacaoTotal() - a.calcularPontuacaoTotal(); });
jogadores.forEach(function (jogador, index) {
    console.log("".concat(index + 1, "\u00BA Lugar: ").concat(jogador.nome, " - ").concat(jogador.calcularPontuacaoTotal(), " pontos (Vidas: ").concat(jogador.vidas, ")"));
});
console.log("\n--- Melhores Pontuações Individuais (por Rodada) ---");
jogadores.forEach(function (jogador) {
    if (jogador.pontuacoesRodadas.length > 0) {
        var pontuacoesOrdenadas = (0, ordenacao_1.mergeSort)(jogador.pontuacoesRodadas).reverse();
        var melhores3 = pontuacoesOrdenadas.slice(0, 3).join(' | ');
        console.log("> ".concat(jogador.nome, ": ").concat(melhores3));
    }
    else {
        console.log("> ".concat(jogador.nome, ": Nenhuma pontua\u00E7\u00E3o registrada."));
    }
});
console.log("\n--- Histórico de Ações (Última para Primeira) ---");
while (!historicoDeAcoes.isEmpty()) {
    console.log("- ".concat(historicoDeAcoes.pop()));
}
// Relatório da Funcionalidade 1 (Dictionary)
console.log("\n--- Relatório de Conquistas de Região (Dictionary) ---");
if (conquistadoresDeRegiao.isEmpty()) {
    console.log("Nenhum jogador foi o primeiro a conquistar uma região nesta partida.");
}
else {
    conquistadoresDeRegiao.forEach(function (regiao, jogador) {
        console.log("- A regi\u00E3o '".concat(regiao, "' foi conquistada primeiro por: ").concat(jogador, "!"));
    });
}
// NOVA SEÇÃO: Relatório e Demonstração da Funcionalidade 2 (HashTable)
console.log("\n--- Relatório de Encontros com Inimigos (HashTable) ---");
if (registroInimigos.isEmpty()) {
    console.log("Nenhum inimigo foi encontrado nesta partida.");
}
else {
    console.log("Foram encontrados ".concat(registroInimigos.size(), " tipos de inimigos:"));
    // Usando toString() para ver o estado da tabela
    console.log("Registro completo:", registroInimigos.toString());
    // Usando get() para buscar um inimigo específico
    var encontrosComGoomba = registroInimigos.get("Goomba");
    console.log("\nO inimigo \"Goomba\" foi encontrado ".concat(encontrosComGoomba, " vez(es)."));
    // Usando remove() para simular um evento
    console.log("\nRemovendo \"Bowser\" do registro para uma an\u00E1lise especial...");
    registroInimigos.remove("Bowser");
    console.log("Registro após remoção:", registroInimigos.toString());
}
