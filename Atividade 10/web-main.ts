// Atividade 10/web-main.ts (COM ORDEM DE LOGS CORRIGIDA)
import { Personagem } from "./personagem.js";
import { Inimigo } from "./inimigo.js";
import { PowerUps } from "./powerups.js";
import { FilaDupla } from "./fila-dupla.js";
import { Pilha } from "./pilha.js";
import { Dictionary } from "./dictionary.js";
import { HashTable } from "./hash_table.js";
import { DoublyCircularLinkedList } from "./lista-circular.js";
import { LinkedListOfSets } from "./lista-ligada-sets.js";
import { mergeSort } from "./ordenacao.js";
import { MinHeap } from "./heap.js";
import { Compare } from "./utils.js";

// --- INTERFACES E TIPOS ---
type CharacterData = {
    log: FilaDupla<string>;
    historico: Pilha<string>;
    enemyDefeatCount: Dictionary<string, number>;
};
interface GameObject { x: number; y: number; width: number; height: number; color: string; }
interface Player extends Personagem, GameObject {
    velocityY: number; isJumping: boolean; speedMultiplier: number; isInvincible: boolean;
    invincibilityTimer: number; originalColor: string;
    isDamageInvincible: boolean; damageInvincibilityTimer: number;
}
interface Enemy extends GameObject { type: string; direction: number; speed: number; startX: number; endX: number; }
interface PowerUpBlock extends GameObject { hit: boolean; }
interface PowerUpItem extends GameObject { type: string; }
interface Platform extends GameObject {}
interface BonusEvent {
    scoreThreshold: number;
    enemyType: string;
}

// --- CONFIGURAÇÃO INICIAL DO JOGO ---
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const scoreEl = document.getElementById('score')!;
const livesEl = document.getElementById('lives')!;
const nextBonusEl = document.getElementById('next-bonus')!;
const characterSelection = document.getElementById('character-selection')!;
const gameContainer = document.getElementById('game-container')!;
const rankingScreen = document.getElementById('ranking-screen')!;
const rankingList = document.getElementById('ranking-list')!;
const playAgainBtn = document.getElementById('play-again-btn')!;
const phaseCompleteScreen = document.getElementById('phase-complete-screen')!;
const phaseCompleteMessage = document.getElementById('phase-complete-message')!;
const continueBtn = document.getElementById('continue-btn')!;
const dataStructuresScreen = document.getElementById('data-structures-screen')!;
const toggleDataBtn = document.getElementById('toggle-data-btn')!;
const closeDataBtn = document.getElementById('close-data-btn')!;
const logQueueList = document.getElementById('log-queue-list')!;
const actionStackList = document.getElementById('action-stack-list')!;
const enemyDictList = document.getElementById('enemy-dict-list')!;
const viewFinalDataBtn = document.getElementById('view-final-data-btn')!;
const viewPhaseDataBtn = document.getElementById('view-phase-data-btn')!;
const dataCharSelector = document.getElementById('data-char-selector')!;

// --- ESTADO DO JOGO ---
let player: Player;
let enemies: Enemy[] = [];
let powerUpBlocks: PowerUpBlock[] = [];
let powerUps: PowerUpItem[] = [];
let platforms: Platform[] = [];
let flagpole: GameObject;
const keys: { [key: string]: boolean } = {};
let cameraX = 0;
const LEVEL_WIDTH = 3200;
let gameAnimationFrame: number;
let isLevelCompleting = false;
let isPaused = false;
let powerUpEffects: HashTable<string, (player: Player) => void>;
let levelRegions: LinkedListOfSets<string>;
let lastOpenScreen: 'game' | 'phase-complete' | 'ranking' = 'game';
let allCharactersData: HashTable<string, CharacterData>;
let bonusEventsHeap: MinHeap<BonusEvent>;

// --- CONTROLE DE PERSONAGENS ---
const characterRotation = new DoublyCircularLinkedList<string>();
characterRotation.add('Mario');
characterRotation.add('Luigi');
characterRotation.add('Peach');
const finalScores: { nome: string, pontuacao: number }[] = [];

// --- LISTENERS DE EVENTOS ---
document.getElementById('mario-btn')!.addEventListener('click', () => startGameWith('Mario'));
document.getElementById('luigi-btn')!.addEventListener('click', () => startGameWith('Luigi'));
document.getElementById('peach-btn')!.addEventListener('click', () => startGameWith('Peach'));

playAgainBtn.addEventListener('click', () => {
    rankingScreen.style.display = 'none';
    characterSelection.style.display = 'block';
    finalScores.length = 0;
    characterRotation.resetToHead();
    if (allCharactersData) allCharactersData.clear();
});

continueBtn.addEventListener('click', continueGame);
toggleDataBtn.addEventListener('click', () => { lastOpenScreen = 'game'; toggleDataScreen(); });
viewPhaseDataBtn.addEventListener('click', () => { lastOpenScreen = 'phase-complete'; toggleDataScreen(); });
viewFinalDataBtn.addEventListener('click', () => { lastOpenScreen = 'ranking'; toggleDataScreen(); });
closeDataBtn.addEventListener('click', toggleDataScreen);

// --- FUNÇÕES PRINCIPAIS ---
function startGameWith(characterName: 'Mario' | 'Luigi' | 'Peach') {
    if (!allCharactersData) {
        allCharactersData = new HashTable<string, CharacterData>();
    }
    characterRotation.setCurrentByData(characterName);
    characterSelection.style.display = 'none';
    gameContainer.style.display = 'block';
    const filaDeLogs = new FilaDupla<string>();
    const historicoDeAcoes = new Pilha<string>();
    const personagemBase = new Personagem(characterName, filaDeLogs, historicoDeAcoes);
    const enemyDefeatCount = new Dictionary<string, number>();
    allCharactersData.put(characterName, {
        log: filaDeLogs,
        historico: historicoDeAcoes,
        enemyDefeatCount: enemyDefeatCount
    });
    const originalColor = characterName === 'Mario' ? 'red' : characterName === 'Luigi' ? 'green' : 'pink';
    player = Object.assign(personagemBase, {
        x: 50, y: 0, width: 40, height: 50, color: originalColor, originalColor: originalColor,
        velocityY: 0, isJumping: false, speedMultiplier: 1, isInvincible: false, invincibilityTimer: 0,
        isDamageInvincible: false, damageInvincibilityTimer: 0
    });
    initGame();
}

function initGame() {
    isLevelCompleting = false;
    isPaused = false;
    Object.keys(keys).forEach(key => delete keys[key]);
    if (gameAnimationFrame) cancelAnimationFrame(gameAnimationFrame);
    cameraX = 0;
    platforms = [{ x: 0, y: canvas.height - 20, width: LEVEL_WIDTH, height: 20, color: 'green' }];
    player.x = 50;
    player.y = canvas.height - 20 - player.height;
    player.velocityY = 0;
    player.isJumping = false;
    platforms.push({ x: 150, y: canvas.height - 100, width: 100, height: 20, color: 'brown' });
    platforms.push({ x: 400, y: canvas.height - 180, width: 150, height: 20, color: 'brown' });
    platforms.push({ x: 700, y: canvas.height - 120, width: 200, height: 20, color: 'brown' });
    platforms.push({ x: 1000, y: canvas.height - 250, width: 120, height: 20, color: 'brown' });
    platforms.push({ x: 1300, y: canvas.height - 150, width: 180, height: 20, color: 'brown' });
    platforms.push({ x: 1600, y: canvas.height - 100, width: 250, height: 20, color: 'brown' });
    platforms.push({ x: 2000, y: canvas.height - 200, width: 100, height: 20, color: 'brown' });
    platforms.push({ x: 2300, y: canvas.height - 160, width: 150, height: 20, color: 'brown' });
    const groundY = canvas.height - 20;
    enemies = [
        { x: 250, y: groundY - 40, width: 40, height: 40, type: 'Goomba', color: '#8B4513', direction: 1, speed: 0.5, startX: 250, endX: 400 },
        { x: 500, y: groundY - 40, width: 40, height: 40, type: 'Goomba', color: '#8B4513', direction: -1, speed: 0.5, startX: 450, endX: 600 },
        { x: 750, y: canvas.height - 120 - 40, width: 40, height: 40, type: 'Goomba', color: '#8B4513', direction: 1, speed: 0.6, startX: 750, endX: 850 },
        { x: 1100, y: groundY - 50, width: 40, height: 50, type: 'Koopa', color: '#228B22', direction: -1, speed: 1, startX: 1000, endX: 1200 },
        { x: 1400, y: groundY - 40, width: 40, height: 40, type: 'Goomba', color: '#8B4513', direction: 1, speed: 0.5, startX: 1350, endX: 1450 },
        { x: 1700, y: canvas.height - 100 - 50, width: 40, height: 50, type: 'Koopa', color: '#228B22', direction: -1, speed: 1, startX: 1650, endX: 1800 },
        { x: 2100, y: groundY - 70, width: 70, height: 70, type: 'Bowser', color: '#FF8C00', direction: 1, speed: 0.3, startX: 2050, endX: 2200 },
        { x: 2500, y: groundY - 40, width: 40, height: 40, type: 'Goomba', color: '#8B4513', direction: -1, speed: 0.7, startX: 2400, endX: 2550 },
    ];
    powerUpBlocks = [
        { x: 200, y: canvas.height - 180, width: 40, height: 40, color: '#FFA500', hit: false },
        { x: 800, y: canvas.height - 220, width: 40, height: 40, color: '#FFA500', hit: false },
        { x: 1500, y: canvas.height - 250, width: 40, height: 40, color: '#FFA500', hit: false },
        { x: 2200, y: canvas.height - 100, width: 40, height: 40, color: '#FFA500', hit: false },
    ];
    powerUps = [];
    flagpole = { x: LEVEL_WIDTH - 100, y: canvas.height - 220, width: 10, height: 200, color: 'silver' };
    powerUpEffects = new HashTable<string, (player: Player) => void>();
    powerUpEffects.put('Cogumelo', (p: Player) => { p.vidas += 1; p.log.addBack(`[EFEITO]: ${p.nome} usou um Cogumelo e ganhou uma vida extra!`); });
    powerUpEffects.put('Flor de fogo', (p: Player) => { p.isInvincible = true; p.invincibilityTimer = 300; p.log.addBack(`[EFEITO]: ${p.nome} usou uma Flor de Fogo e está invencível por 5 segundos!`); });
    powerUpEffects.put('Pena', (p: Player) => { p.speedMultiplier = 1.3; p.log.addBack(`[EFEITO]: ${p.nome} usou uma Pena e está mais rápido!`); });
    levelRegions = new LinkedListOfSets<string>();
    const region1Items = new Set<string>(["Cogumelo"]);
    const region2Items = new Set<string>(["Cogumelo", "Flor de fogo"]);
    const region3Items = new Set<string>(["Cogumelo", "Flor de fogo", "Pena"]);
    levelRegions.add(region1Items);
    levelRegions.add(region2Items);
    levelRegions.add(region3Items);
    bonusEventsHeap = new MinHeap<BonusEvent>((a, b) => {
        if (a.scoreThreshold < b.scoreThreshold) return Compare.LESS_THAN;
        if (a.scoreThreshold > b.scoreThreshold) return Compare.BIGGER_THAN;
        return Compare.EQUALS;
    });
    bonusEventsHeap.insert({ scoreThreshold: 1000, enemyType: 'Golden Goomba' });
    bonusEventsHeap.insert({ scoreThreshold: 2500, enemyType: 'Golden Goomba' });
    bonusEventsHeap.insert({ scoreThreshold: 4000, enemyType: 'Golden Goomba' });
    gameLoop();
}

function gameLoop() {
    if (!isPaused) {
        update();
        render();
    }
    gameAnimationFrame = requestAnimationFrame(gameLoop);
}

function toggleDataScreen() {
    isPaused = !isPaused;
    dataStructuresScreen.style.display = isPaused ? 'flex' : 'none';
    if (isPaused) {
        cancelAnimationFrame(gameAnimationFrame);
        buildDataCharacterSelector();
        const firstCharData = allCharactersData.keyValues()[0];
        if (firstCharData) {
            updateDataStructuresScreen(firstCharData.key);
        }
    } else {
        const screenToReturn = lastOpenScreen === 'game' ? gameContainer :
            lastOpenScreen === 'phase-complete' ? phaseCompleteScreen : rankingScreen;
        screenToReturn.style.display = lastOpenScreen === 'game' ? 'block' : 'flex';
        if (lastOpenScreen === 'game' && !isLevelCompleting && player.vidas > 0) {
            gameLoop();
        }
    }
}

function buildDataCharacterSelector() {
    dataCharSelector.innerHTML = '';
    const playedCharacters = allCharactersData.keyValues().map(kv => kv.key);
    playedCharacters.forEach((charName, index) => {
        const btn = document.createElement('button');
        btn.textContent = charName;
        btn.className = 'char-selector-btn';
        if (index === 0) btn.classList.add('active');
        btn.addEventListener('click', () => {
            document.querySelectorAll('.char-selector-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDataStructuresScreen(charName);
        });
        dataCharSelector.appendChild(btn);
    });
}

function updateDataStructuresScreen(characterName: string) {
    const data = allCharactersData.get(characterName);
    if (!data) return;
    logQueueList.innerHTML = '';
    actionStackList.innerHTML = '';
    enemyDictList.innerHTML = '';
    data.log.toArray().forEach(log => {
        const li = document.createElement('li'); li.textContent = log; logQueueList.appendChild(li);
    });
    data.historico.toArray().reverse().forEach(action => {
        const li = document.createElement('li'); li.textContent = action; actionStackList.appendChild(li);
    });
    data.enemyDefeatCount.keyValues().forEach(pair => {
        const li = document.createElement('li'); li.textContent = `${pair.key}: ${pair.value}`; enemyDictList.appendChild(li);
    });
}

function showPhaseCompleteScreen(message: string, isGameOver: boolean = false) {
    isLevelCompleting = true;
    cancelAnimationFrame(gameAnimationFrame);
    gameContainer.style.display = 'none';
    if (isGameOver) {
        const nextChar = characterRotation.peekProximoTurno();
        if (finalScores.length < 3) {
            phaseCompleteMessage.textContent = message + ` Prepare-se, ${nextChar}!`;
            continueBtn.textContent = "Continuar";
        } else {
            phaseCompleteMessage.textContent = "Todos os personagens jogaram!";
            continueBtn.textContent = "Ver Ranking";
        }
    } else {
        const nextChar = characterRotation.peekProximoTurno();
        if (finalScores.length < 3) {
            phaseCompleteMessage.textContent = `${player.nome} concluiu a fase! Vez de ${nextChar}!`;
            continueBtn.textContent = "Começar Próxima Rodada";
        } else {
            phaseCompleteMessage.textContent = `${player.nome} concluiu a fase! Todos jogaram!`;
            continueBtn.textContent = "Ver Ranking";
        }
    }
    phaseCompleteScreen.style.display = 'flex';
}

function continueGame() {
    phaseCompleteScreen.style.display = 'none';
    if (finalScores.length < 3) {
        const nextCharacter = characterRotation.proximoTurno();
        startGameWith(nextCharacter as 'Mario' | 'Luigi' | 'Peach');
    } else {
        showRanking();
    }
}

function showRanking() {
    gameContainer.style.display = 'none';
    rankingScreen.style.display = 'block';
    const sortedFinalScores = mergeSort([...finalScores], (a, b) => b.pontuacao - a.pontuacao);
    rankingList.innerHTML = '';
    sortedFinalScores.forEach(entry => {
        const li = document.createElement('li'); li.textContent = `${entry.nome}: ${entry.pontuacao} pontos`; rankingList.appendChild(li);
    });
}

function update() {
    if (isLevelCompleting) return;

    const nextBonus = bonusEventsHeap.peek();
    if (nextBonus && player.calcularPontuacaoTotal() >= nextBonus.scoreThreshold) {
        const event = bonusEventsHeap.extract()!;
        const bonusEnemy: Enemy = {
            x: player.x + 400, y: canvas.height - 20 - 40, width: 40, height: 40,
            type: event.enemyType, color: 'gold', direction: -1, speed: 2.5,
            startX: player.x + 300, endX: player.x + 500
        };
        enemies.push(bonusEnemy);
        player.log.addBack(`[EVENTO]: Um ${event.enemyType} apareceu!`);
    }

    if (player.isInvincible) {
        player.invincibilityTimer--;
        player.color = player.invincibilityTimer % 20 > 10 ? 'white' : player.originalColor;
        if (player.invincibilityTimer <= 0) {
            player.isInvincible = false;
            player.color = player.originalColor;
            player.log.addBack("[EFEITO]: O poder da Flor de Fogo acabou!");
        }
    }

    if (player.isDamageInvincible) {
        player.damageInvincibilityTimer--;
        player.color = player.damageInvincibilityTimer % 20 > 10 ? 'rgba(255, 0, 0, 0.5)' : player.originalColor;
        if (player.damageInvincibilityTimer <= 0) {
            player.isDamageInvincible = false;
            player.color = player.originalColor;
        }
    }

    if (player.y > canvas.height) {
        player.perderVida();
        player.speedMultiplier = 1;
        if (player.vidas <= 0) { handleGameOver(); return; }
        player.x = 50;
        player.y = canvas.height - 20 - player.height;
        player.velocityY = 0;
        player.isJumping = false;
    }

    const currentSpeed = 5 * player.speedMultiplier;
    if (keys['ArrowLeft'] && player.x > 0) player.x -= currentSpeed;
    if (keys['ArrowRight'] && player.x < LEVEL_WIDTH - player.width) player.x += currentSpeed;
    if (keys['Space'] && !player.isJumping) {
        player.velocityY = -16;
        player.isJumping = true;
    }

    player.y += player.velocityY;
    player.velocityY += 0.8;
    
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x <= enemy.startX || enemy.x + enemy.width >= enemy.endX) {
            enemy.direction *= -1;
        }
    });

    platforms.forEach(platform => {
        if (player.velocityY >= 0 &&
            player.x < platform.x + platform.width && player.x + player.width > platform.x &&
            player.y + player.height > platform.y && player.y + player.height <= platform.y + player.velocityY + 5) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    powerUpBlocks.forEach(block => {
        if (!block.hit && player.velocityY < 0 &&
            player.x < block.x + block.width && player.x + player.width > block.x &&
            player.y < block.y + block.height && player.y > block.y) {
            block.hit = true;
            player.velocityY = 2;
            const powerUpGenerator = new PowerUps();
            let availableItems: string[] = ["Cogumelo"];
            if (levelRegions.getHead()) {
                if (block.x < 1000) {
                    availableItems = Array.from(levelRegions.getHead()!.data);
                } else if (block.x < 2000 && levelRegions.getHead()!.next) {
                    availableItems = Array.from(levelRegions.getHead()!.next!.data);
                } else if (levelRegions.getHead()!.next?.next) {
                    availableItems = Array.from(levelRegions.getHead()!.next!.next!.data);
                }
            }
            const powerUpType = powerUpGenerator.gerarPowerUp(availableItems);
            powerUps.push({
                x: block.x, y: block.y - 40, width: 30, height: 30,
                type: powerUpType, color: 'gold'
            });
            player.log.addBack(`[POWER-UP]: ${powerUpType} liberado!`);
        }
        if (player.velocityY >= 0 && player.x < block.x + block.width &&
            player.x + player.width > block.x && player.y + player.height > block.y && player.y < block.y) {
            player.y = block.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    powerUps.forEach((powerUp, index) => {
        if (player.x < powerUp.x + powerUp.width && player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height && player.y + player.height > powerUp.y) {
            player.coletarPowerUp(powerUp.type);
            powerUps.splice(index, 1);
            player.log.addBack(`[COLETA]: ${powerUp.type} coletado!`);
        }
    });

    enemies.forEach((enemy, index) => {
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
            const characterData = allCharactersData.get(player.nome);
            if (!characterData) return;
            const enemyData = characterData.enemyDefeatCount;
            if (player.isInvincible) {
                const currentCount = enemyData.get(enemy.type) || 0;
                enemyData.set(enemy.type, currentCount + 1);
                enemies.splice(index, 1);
                player.log.addBack(`[COMBATE]: ${player.nome} derrotou ${enemy.type} com a Flor de Fogo!`);
            } else if (player.velocityY > 0 && (player.y + player.height) < (enemy.y + 20)) {
                player.atacarInimigo(false);
                const currentCount = enemyData.get(enemy.type) || 0;
                enemyData.set(enemy.type, currentCount + 1);
                enemies.splice(index, 1);
                player.velocityY = -8;
                player.log.addBack(`[COMBATE]: ${player.nome} derrotou ${enemy.type}.`);
            } else if (!player.isDamageInvincible) {
                const inimigoAtacante = new Inimigo(enemy.type);
                inimigoAtacante.atacar(player, player.log, player.historico);
                player.speedMultiplier = 1;
                player.isDamageInvincible = true;
                player.damageInvincibilityTimer = 120;
                player.x -= 20;
                if (player.vidas <= 0) { handleGameOver(); return; }
            }
        }
    });

    if (!isLevelCompleting && player.x + player.width > flagpole.x) {
        handleLevelComplete();
        return;
    }

    cameraX = player.x - canvas.width / 3;
    if (cameraX < 0) cameraX = 0;
    if (cameraX > LEVEL_WIDTH - canvas.width) cameraX = LEVEL_WIDTH - canvas.width;
    scoreEl.textContent = player.calcularPontuacaoTotal().toString();
    livesEl.textContent = player.vidas.toString();
    const nextBonusInfo = bonusEventsHeap.peek();
    nextBonusEl.textContent = nextBonusInfo ? nextBonusInfo.scoreThreshold.toString() : "Nenhum";
}

function calculateVarietyBonus(player: Player) {
    const enemyData = allCharactersData.get(player.nome)?.enemyDefeatCount;
    if (!enemyData || enemyData.isEmpty()) {
        return;
    }

    let bonusPoints = 0;
    enemyData.forEach((key, value) => {
        bonusPoints += 50;
    });

    if (enemyData.size() > 1) {
        bonusPoints += 250;
        player.log.addBack(`[BÔNUS]: Bônus por variedade de ${enemyData.size()} inimigos: +${bonusPoints} pontos!`);
    } else {
        player.log.addBack(`[BÔNUS]: Bônus por tipo de inimigo: +${bonusPoints} pontos!`);
    }

    player.pontuacoesRodadas.push(bonusPoints);
    player.log.addBack(`[FIM DE FASE]: Inimigos derrotados: ${enemyData.toString()}`);
}

function handleGameOver() {
    calculateVarietyBonus(player);
    finalScores.push({ nome: player.nome, pontuacao: player.calcularPontuacaoTotal() });
    showPhaseCompleteScreen(`Game Over para ${player.nome}!`, true);
}

function handleLevelComplete() {
    calculateVarietyBonus(player);
    finalScores.push({ nome: player.nome, pontuacao: player.calcularPontuacaoTotal() });
    player.log.addBack(`[FASE CONCLUÍDA]: ${player.nome} chegou ao final!`);
    showPhaseCompleteScreen("", false);
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-cameraX, 0);
    platforms.forEach(p => { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.width, p.height); });
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    enemies.forEach(e => { ctx.fillStyle = e.color; ctx.fillRect(e.x, e.y, e.width, e.height); });
    powerUpBlocks.forEach(b => {
        ctx.fillStyle = b.hit ? 'gray' : b.color;
        ctx.fillRect(b.x, b.y, b.width, b.height);
        if (!b.hit) {
            ctx.fillStyle = "black"; ctx.font = "30px 'Courier New'"; ctx.fillText("?", b.x + 10, b.y + 30);
        }
    });
    powerUps.forEach(p => { ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, p.width, p.height); });
    ctx.fillStyle = flagpole.color; ctx.fillRect(flagpole.x, flagpole.y, flagpole.width, flagpole.height);
    ctx.restore();
}

// --- CONTROLES ---
window.addEventListener('keydown', (e) => {
    if (!isPaused) keys[e.code] = true;
    if (player && player.historico && !isPaused) player.historico.push(`[TECLA DOWN]: ${e.code}`);
    if (e.code === 'KeyE' && !isPaused && player) {
        const powerUpUsado = player.usarPowerUp();
        if (powerUpUsado) {
            const effectFunction = powerUpEffects.get(powerUpUsado);
            if (effectFunction) {
                effectFunction(player);
            }
        }
    }
});
window.addEventListener('keyup', (e) => {
    if (!isPaused) keys[e.code] = false;
    if (player && player.historico && !isPaused) player.historico.push(`[TECLA UP]: ${e.code}`);
});