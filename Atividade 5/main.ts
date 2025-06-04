import { Personagem } from "./personagem"
import { Inimigo } from "./inimigo"
import { PowerUps } from "./powerups"
import { mergeSort} from "./ordenacao"

// Instanciando objetos e arrays

const inimigos: Inimigo[] = [
  new Inimigo("Goomba"),
  new Inimigo("Koopa Troopa"),
  new Inimigo("Bowser")
];

const personagens: Personagem[] = [
  new Personagem("Mario"),
  new Personagem("Luigi")
];

const powerUp = new PowerUps();

// Gera array de números aleatórios para simular eventos durante as rodadas
const randomArrayInt = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);

console.log("=== Início da partida ===");

for (let rodada = 0; rodada < randomArrayInt.length; rodada++) {
  const num = randomArrayInt[rodada]

  console.log(`\nRodada ${rodada + 1} - Número gerado: ${num}`)

  if (num <= 60) {
    // Ataque de inimigo aleatório
    const inimigo = inimigos[Math.floor(Math.random() * inimigos.length)]
    inimigo.atacar(personagens[0])
  } else {
    // Gera e coleta PowerUp
    const powerUpGerado = powerUp.gerarPowerUp()
    console.log(`Power-Up ${powerUpGerado} apareceu!`)
    personagens[0].coletarPowerUp(powerUpGerado)
  }

  if (personagens[0].vidas <= 0) {
    console.log(`\n${personagens[0].nome} perdeu todas as vidas! Fim de jogo.`)
    break
  }
}

// Chamando o Merge Sort

const sortedArray = mergeSort(personagens[0].pontuacoesRodadas).reverse()
console.log("Ranking de Pontuações:")
for (let i = 0; i < sortedArray.length; i++) {
  console.log(`${i+1} - ${sortedArray[i]}`)
}

