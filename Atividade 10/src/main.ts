// Adicionando .js ao final de cada importação local
import { Personagem, Peach, Mario, Luigi } from './personagem.js';
import { Inimigo, KoopaTroopa, Bowser } from './inimigo.js';
import { PowerUp, Estrela, Cogumelo, Pena } from './powerups.js';
import { UI } from './ui.js';
import { Bloco } from './bloco.js';

interface Collidable {
    x: number;
    y: number;
    width: number;
    height: number;
}

class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private characterSelection: HTMLElement;
    private uiPanel: HTMLElement;
    private endScreen: HTMLElement;
    
    private ui: UI;
    private player!: Personagem;
    private enemies: Inimigo[] = [];
    private powerUps: PowerUp[] = [];
    private platforms: Collidable[] = [];
    private blocks: Bloco[] = [];
    
    private score: number = 0;
    private cameraX: number = 0;
    private goalPole: { x: number, y: number, width: number, height: number };
    private gamePaused: boolean = false;
    private keys: { [key: string]: boolean } = {};

    // Imagens do cenário
    private groundImage: HTMLImageElement;
    private skyImage: HTMLImageElement;
    private groundPlatform: Collidable;
    private groundLevelY: number = 482; // Valor preciso para o nível do chão

    constructor() {
        // CORREÇÃO: O ID correto do canvas é "gameCanvas"
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.characterSelection = document.querySelector('.character-selection') as HTMLElement;
        this.uiPanel = document.getElementById('ui-panel') as HTMLElement;
        this.endScreen = document.querySelector('.end-screen') as HTMLElement;
        this.ui = new UI();
        this.goalPole = { x: 3800, y: 350, width: 20, height: 150 };

        // Carregar imagens do cenário
        this.groundImage = new Image();
        this.groundImage.src = 'imagens/cenario.png';
        this.skyImage = new Image();
        this.skyImage.src = 'imagens/cenarioceu.jpg';

        this.groundPlatform = { x: 0, y: this.groundLevelY, width: 4000, height: 118 };

        this.setupCharacterSelection();
        this.setupRestartButton();
    }
    
    private setupCharacterSelection(): void {
        document.querySelectorAll('.character').forEach(character => {
            character.addEventListener('click', () => {
                const charName = character.getAttribute('data-char')!;
                const startY = this.groundLevelY - 70;
                if (charName === 'Mario') this.player = new Mario(100, startY);
                else if (charName === 'Luigi') this.player = new Luigi(100, startY);
                else if (charName === 'Peach') this.player = new Peach(100, startY);

                this.ui.setCurrentPlayer(charName);
                this.characterSelection.style.display = 'none';
                this.canvas.style.display = 'block';
                this.uiPanel.style.display = 'flex';
                this.startGame();
            });
        });
    }

    private startGame(): void {
        this.createLevel();
        this.addInputListeners();
        this.gameLoop();
    }
    
    private createLevel(): void {
        // Plataformas flutuantes
        this.platforms.push({ x: 500, y: 400, width: 150, height: 20 });
        this.platforms.push({ x: 800, y: 300, width: 150, height: 20 });
        this.platforms.push({ x: 1200, y: 450, width: 200, height: 20 });
        
        // Blocos de Power-up
        this.blocks.push(new Bloco(600, 300));
        this.blocks.push(new Bloco(644, 300));
        this.blocks.push(new Bloco(688, 300));

        // Inimigos
        this.enemies.push(new KoopaTroopa(900, this.groundLevelY - 45));
        this.enemies.push(new Bowser(2000, this.groundLevelY - 60));
        this.enemies.push(new KoopaTroopa(1300, 450 - 45));
    }

    private addInputListeners(): void {
        window.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
    }
    
    private handleInput(): void {
        if (this.keys['a'] || this.keys['arrowleft']) this.player.moveLeft();
        else if (this.keys['d'] || this.keys['arrowright']) this.player.moveRight();
        else this.player.stop();
        if (this.keys['w'] || this.keys[' '] || this.keys['arrowup']) this.player.jump();
    }

    private update(): void {
        if (this.gamePaused) return;

        this.handleInput();
        
        const collidables = [...this.platforms, ...this.blocks, this.groundPlatform];
        this.player.update(collidables);

        this.enemies.forEach(enemy => enemy.update());

        // Câmera segue o jogador
        const cameraLead = this.canvas.width / 2.5;
        this.cameraX = this.player.x - cameraLead;
        if (this.cameraX < 0) this.cameraX = 0;
        
        this.checkCollisions();

        if (this.player.getLives() <= 0) this.endGame(false);
    }

    private checkCollisions(): void {
        // Colisão com inimigos
        this.enemies.forEach((enemy, index) => {
            if (this.player.isCollidingWith(enemy)) {
                if (this.player.velY > 0.1 && (this.player.y + this.player.height) < (enemy.y + this.player.velY + 15)) {
                    this.enemies.splice(index, 1);
                    this.score += 100;
                    this.player.velY = -8;
                    this.ui.addEvent("Inimigo derrotado!");
                } else this.player.takeDamage();
            }
        });

        // Colisão com blocos
        this.blocks.forEach(block => {
            if (this.player.isCollidingWith(block) && block.isActive()) {
                if (this.player.velY < 0 && this.player.y > block.y) {
                    block.hit();
                    this.player.velY = 1;
                    this.spawnPowerUp(block.x, block.y - 40);
                    this.ui.addEvent("Bloco atingido!");
                }
            }
        });

        // Colisão com power-ups
        this.powerUps.forEach((powerUp, index) => {
            if (this.player.isCollidingWith(powerUp)) {
                const name = this.player.collectPowerUp(powerUp);
                this.powerUps.splice(index, 1);
                this.score += 500;
                this.ui.addToInventory(name);
            }
        });

        // Fim de fase
        if (this.player.isCollidingWith(this.goalPole)) this.endGame(true);
    }

    private spawnPowerUp(x: number, y: number): void {
        const rand = Math.random();
        let newPowerUp: PowerUp;
        if (rand < 0.33) newPowerUp = new Estrela(x, y);
        else if (rand < 0.66) newPowerUp = new Cogumelo(x, y);
        else newPowerUp = new Pena(x, y);
        this.powerUps.push(newPowerUp);
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenha o céu com efeito parallax
        if (this.skyImage.complete && this.skyImage.naturalHeight !== 0) {
            const skyWidth = this.skyImage.width;
            const skyScroll = this.cameraX * 0.5;
            const x1 = -(skyScroll % skyWidth);
            this.ctx.drawImage(this.skyImage, 0, 0, skyWidth, this.skyImage.height, x1, 0, skyWidth, this.canvas.height);
            this.ctx.drawImage(this.skyImage, 0, 0, skyWidth, this.skyImage.height, x1 + skyWidth, 0, skyWidth, this.canvas.height);
        }

        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

        // Desenha a imagem do chão
        if (this.groundImage.complete && this.groundImage.naturalHeight !== 0) {
            const groundWidth = this.groundImage.width;
            const levelWidth = this.goalPole.x + 400;
            for(let i = 0; i * groundWidth < levelWidth + this.cameraX; i++) {
                this.ctx.drawImage(this.groundImage, i * groundWidth, this.canvas.height - this.groundImage.height);
            }
        }
        
        // Desenha plataformas flutuantes
        this.platforms.forEach((p: Collidable) => {
            this.ctx.fillStyle = '#6D4C41';
            this.ctx.fillRect(p.x, p.y, p.width, p.height);
        });

        this.blocks.forEach(b => b.draw(this.ctx));
        this.enemies.forEach(e => e.draw(this.ctx));
        this.powerUps.forEach(p => p.draw(this.ctx));
        this.player.draw(this.ctx);

        // Poste de final
        this.ctx.fillStyle = '#C0C0C0';
        this.ctx.fillRect(this.goalPole.x, this.goalPole.y, this.goalPole.width, this.goalPole.height);
        
        this.ctx.restore();
        
        // Atualiza a UI que fica estática na tela
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.player.getLives());
    }

    private gameLoop(): void {
        if (!this.gamePaused) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    private endGame(win: boolean): void {
        this.gamePaused = true;
        const message = win ? "Você Venceu!" : "Game Over!";
        this.endScreen.querySelector('h2')!.textContent = message;
        (document.getElementById('final-score') as HTMLElement).textContent = this.score.toString();
        this.endScreen.style.display = 'block';
    }

    private setupRestartButton(): void {
        (document.getElementById('restart-button') as HTMLElement).addEventListener('click', () => {
            window.location.reload();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game();
});