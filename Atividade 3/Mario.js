var Personagem = /** @class */ (function () {
    function Personagem(nome) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
    }
    Personagem.prototype.printPular = function () {
        console.log("".concat(this.nome, " pulou!"));
    };
    return Personagem;
}());
var Inimigo = /** @class */ (function () {
    function Inimigo(tipo) {
        this.tipo = tipo;
    }
    Inimigo.prototype.atacar = function (personagem) {
        if (personagem.vidas >= 0) {
            personagem.vidas -= 1;
            console.log("".concat(this.tipo, " atacou ").concat(personagem.nome));
            console.log("".concat(personagem.nome, " agora tem ").concat(personagem.vidas, " vidas"));
        }
    };
    return Inimigo;
}());
var PowerUps = /** @class */ (function () {
    function PowerUps() {
        this.tipo = "Desconhecido";
    }
    PowerUps.prototype.gerarPowerUp = function () {
        var numero = Math.floor(Math.random() * 3); // 0, 1 ou 2
        if (numero === 0) {
            this.tipo = "Cogumelo";
        }
        else if (numero === 1) {
            this.tipo = "Flor de fogo";
        }
        else {
            this.tipo = "Estrela";
        }
        console.log("$voc\u00EA ganhou um Power Up: ".concat(this.tipo));
    };
    return PowerUps;
}());
var VIDA_MAXIMA = 3;
var MARIO = new Personagem("Mario");
var BOWSER = new Inimigo("Bowser");
var POWERUP = new PowerUps();
MARIO.printPular();
BOWSER.atacar(MARIO);
