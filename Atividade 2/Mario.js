// Variáveis principais
let posicaoMario = { x: 0, y: 0 };
let pontos = 0;
let vidas = 3;

// Função para mover o Mario
function moverMario(direcao) {
  const velocidade = 5;
  if (direcao === "esquerda") {
    posicaoMario.x -= velocidade;
  } else if (direcao === "direita") {
    posicaoMario.x += velocidade;
  } else if (direcao === "pular") {
    posicaoMario.y -= 50; // simula pulo
    setTimeout(() => {
      posicaoMario.y += 50; // simula gravidade
    }, 500);
  }
  console.log("Posição do Mario:", posicaoMario);
}

// Função para verificar colisões com objetos
function verificarColisao(objetos) {
  objetos.forEach((objeto) => {
    if (
      posicaoMario.x === objeto.x &&
      posicaoMario.y === objeto.y
    ) {
      if (objeto.tipo === "moeda") {
        pontos += 10;
        console.log("Moeda coletada! Pontos:", pontos);
      } else if (objeto.tipo === "inimigo") {
        vidas -= 1;
        console.log("Você foi atingido por um inimigo! Vidas restantes:", vidas);
      }
    }
  });
}

// Função para reiniciar o jogo
function reiniciarJogo() {
  posicaoMario = { x: 0, y: 0 };
  pontos = 0;
  vidas = 3;
  console.log("Jogo reiniciado.");
}

// Função para gerar um número inteiro aleatório entre dois valores
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("Random integer [1, 10]:", getRandomInt(1, 10));  

