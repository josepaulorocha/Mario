import { Personagem } from "./personagem";
import { Inimigo } from "./inimigo";
import { DoublyCircularLinkedList } from "./lista-circular";
import { FilaDupla } from "./fila-dupla";
import { Pilha } from "./pilha";
import { PowerUps } from "./powerups";
import { UI } from "./ui";

// --- FUNÇÃO PARA CARREGAR ASSETS ---
async function loadAssets(): Promise<Record<string, HTMLImageElement>> {
    const assets: Record<string, string> = {
        mario: 'assets/mario.gif',
        gameOver: 'assets/game-over.png'
    };

    const loadedImages: Record<string, HTMLImageElement> = {};
    const promises = Object.entries(assets).map(([name, src]) => {
        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedImages[name] = img;
                resolve();
            };
            img.onerror = () => reject(new Error(`Falha ao carregar a imagem: ${src}`));
        });
    });

    await Promise.all(promises);
    return loadedImages;
}


// --- CLASSE PRINCIPAL DO JOGO ---
class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ui: UI;
    private assets: Record<string, HTMLImageElement>;

    // Estruturas de dados
    private historicoDeAcoes: Pilha<string>;
    private filaDeLogs: FilaDupla<string>;
    private listaDeJogadores: DoublyCircularLinkedList<Personagem>;
    private filaDeInimigos: FilaDupla<Inimigo>;
    private geradorDePowerUp: PowerUps;

    private personagemDaVez!: Personagem;
    private activeEnemies: Inimigo[] = [];
    private isGameOver: boolean = false;

    constructor(canvasId: string, loadedAssets: Record<string, HTMLImageElement>) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.ui = new UI();
        this.assets = loadedAssets;

        this.historicoDeAcoes = new Pilha<string>();
        this.filaDeLogs = new FilaDupla<string>();
        this.listaDeJogadores = new DoublyCircularLinkedList<Personagem>();
        this.filaDeInimigos = new FilaDupla<Inimigo>();
        this.geradorDePowerUp = new PowerUps();
        
        this.setup();
    }

    private setup() {
        // Cria os personagens usando a imagem já carregada
        const mario = new Personagem("Mario", this.filaDeLogs, this.historicoDeAcoes, this.assets.mario);
        
        this.listaDeJogadores.add(mario);
        
        this.personagemDaVez = this.listaDeJogadores.proximoTurno()!;

        // Cria a pool de inimigos
        [new Inimigo("Goomba"), new Inimigo("Koopa Troopa"), new Inimigo("Bowser")]
            .forEach(inimigo => this.filaDeInimigos.addBack(inimigo));

        this.log("Jogo iniciado! Pressione 'A' para Esquerda, 'D' para Direita.");
    }

    private log(message: string) {
        this.filaDeLogs.addBack(message);
        this.ui.addLogMessage(message);
    }

    private update() {
        if (this.isGameOver) return;

        this.activeEnemies.forEach(inimigo => {
            inimigo.move();
            if (this.checkCollision(this.personagemDaVez, inimigo)) {
                inimigo.atacar(this.personagemDaVez, this.filaDeLogs, this.historicoDeAcoes);
                this.processLogs();
                inimigo.x = 900 + Math.random() * 500;
            }
        });
        
        this.activeEnemies = this.activeEnemies.filter(inimigo => inimigo.x + inimigo.width > 0);

        if (Math.random() < 0.015 && this.activeEnemies.length < 3) {
            const newEnemy = this.filaDeInimigos.removeFront();
            if (newEnemy) {
                newEnemy.x = this.canvas.width;
                this.activeEnemies.push(newEnemy);
                this.filaDeInimigos.addBack(newEnemy);
                this.log(`${newEnemy.tipo} apareceu!`);
            }
        }
        
        if (this.personagemDaVez.vidas <= 0) {
            this.isGameOver = true;
            this.log(`FIM DE JOGO! ${this.personagemDaVez.nome} foi derrotado.`);
        }
    }
    
    private checkCollision(p: Personagem, e: Inimigo): boolean {
        return (
            p.x < e.x + e.width &&
            p.x + p.width > e.x &&
            p.y < e.y + e.height &&
            p.y + p.height > e.y
        );
    }

    private processLogs() {
        while(!this.filaDeLogs.isEmpty()) {
            const message = this.filaDeLogs.removeFront();
            if(message) this.ui.addLogMessage(message);
        }
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.isGameOver) {
             this.ctx.drawImage(
                this.personagemDaVez.image,
                this.personagemDaVez.x,
                this.personagemDaVez.y,
                this.personagemDaVez.width,
                this.personagemDaVez.height
            );
        }
       
        this.activeEnemies.forEach(inimigo => {
            this.ctx.fillStyle = 'saddlebrown';
            this.ctx.fillRect(inimigo.x, inimigo.y, inimigo.width, inimigo.height);
        });

        this.ui.updatePlayerStats(
            this.personagemDaVez.nome,
            this.personagemDaVez.vidas,
            this.personagemDaVez.calcularPontuacaoTotal()
        );
        this.ui.updateInventory(this.personagemDaVez.inventario);
        
        if (this.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(this.assets.gameOver, this.canvas.width / 2 - 100, this.canvas.height / 2 - 150, 200, 300);
        }
    }

    public gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    public handleInput(key: string) {
        if (this.isGameOver) return;
        const speed = 15;
        if(key === 'a' || key === 'A') {
            this.personagemDaVez.x = Math.max(0, this.personagemDaVez.x - speed);
        } else if (key === 'd' || key === 'D') {
            this.personagemDaVez.x = Math.min(this.canvas.width - this.personagemDaVez.width, this.personagemDaVez.x + speed);
        }
    }
}

// --- INICIALIZAÇÃO DO JOGO ---
window.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Carregando assets...");
        const assets = await loadAssets();
        console.log("Assets carregados. Iniciando o jogo...");
        
        const game = new Game('gameCanvas', assets);
        
        window.addEventListener('keydown', (e) => {
            game.handleInput(e.key);
        });

        game.gameLoop();
    } catch (error) {
        console.error("Não foi possível iniciar o jogo:", error);
        document.body.innerHTML = `<p style="color:red; text-align:center; margin-top: 50px;">${error}</p>`;
    }
});