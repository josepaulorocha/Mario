import { Personagem } from "./personagem"
import { Inimigo } from "./inimigo"
import { PowerUps } from "./powerups"
import { mergeSort } from "./ordenacao"
import { Pilha } from "./pilha"
import { FilaDupla } from "./fila-dupla"

// PILHA 2: Guarda o histórico de todas as ações importantes
const historicoDeAcoes = new Pilha<string>()

// FILA 2 (DUPLA): Gerencia todas as mensagens que serão exibidas
const filaDeLogs = new FilaDupla<string>()

// FILA 1: Fila circular para os inimigos atacarem em ordem
const filaDeInimigos = new FilaDupla<Inimigo>()
const inimigosBase: Inimigo[] = [
  new Inimigo("Goomba"),
  new Inimigo("Koopa Troopa"),
  new Inimigo("Bowser")
];
inimigosBase.forEach(inimigo => filaDeInimigos.addBack(inimigo))

// Instanciando objetos
const powerUp = new PowerUps()
const mario = new Personagem("Mario", filaDeLogs, historicoDeAcoes)

filaDeLogs.addBack("\n=== Início da partida ===")

for (let rodada = 1; rodada <= 10; rodada++) {
  filaDeLogs.addBack(`\n--- Rodada ${rodada} ---`)

  const chanceEvento = Math.random()

  if (chanceEvento <= 0.6) { // 60% de chance de ataque de inimigo
    // Pega o inimigo da frente da fila para atacar
    const inimigoAtacante = filaDeInimigos.removeFront()
    if (inimigoAtacante) {
        historicoDeAcoes.push(`${inimigoAtacante.tipo} atacou ${mario.nome}`)
        inimigoAtacante.atacar(mario, filaDeLogs)
        // Coloca o inimigo de volta no final da fila
        filaDeInimigos.addBack(inimigoAtacante)
    }
  } else { // 40% de chance de achar um Power-Up
    const powerUpGerado = powerUp.gerarPowerUp()
    filaDeLogs.addBack(`Power-Up ${powerUpGerado} apareceu!`)
    mario.coletarPowerUp(powerUpGerado)
  }

  // A cada 3 rodadas, Mario tenta usar um power-up
  if (rodada % 3 === 0) {
    mario.usarPowerUp()
  }

  if (mario.vidas <= 0) {
    // Adiciona a mensagem de Fim de Jogo na FRENTE da fila para prioridade
    filaDeLogs.addFront(`\n!!! ${mario.nome} perdeu todas as vidas! Fim de jogo. !!!`)
    break
  }
}

// Processa e exibe todas as mensagens da fila de logs
while (!filaDeLogs.isEmpty()) {
    console.log(filaDeLogs.removeFront())
}

// Ordena e exibe o ranking de pontuações
console.log("\n--- Ranking de Pontuações da Rodada ---")
const sortedArray = mergeSort(mario.pontuacoesRodadas).reverse()
for (let i = 0; i < sortedArray.length; i++) {
  console.log(`${i + 1}º lugar - ${sortedArray[i]} pontos`)
}

// Exibe o histórico de ações da última para a primeira
console.log("\n--- Histórico de Ações (Última para Primeira) ---")
while (!historicoDeAcoes.isEmpty()) {
    console.log(`- ${historicoDeAcoes.pop()}`)
}