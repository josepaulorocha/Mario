"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Personagem = void 0;
var pilha_1 = require("./pilha");
var VIDA_MAXIMA = 3;
var Personagem = /** @class */ (function () {
    function Personagem(nome, log, historico) {
        this.nome = nome;
        this.vidas = VIDA_MAXIMA;
        this.isDerrotado = false; // Personagem começa ativo.
        this.inventario = new pilha_1.Pilha();
        this.pontuacoesRodadas = [];
        this.log = log;
        this.historico = historico;
    }
    Personagem.prototype.calcularPontuacaoTotal = function () {
        if (this.pontuacoesRodadas.length === 0) {
            return 0;
        }
        return this.pontuacoesRodadas.reduce(function (total, score) { return total + score; }, 0);
    };
    Personagem.prototype.coletarPowerUp = function (powerUp) {
        this.inventario.push(powerUp);
        this.pontuacoesRodadas.push(800);
        this.log.addBack("-> ".concat(this.nome, " coletou: ").concat(powerUp, " e ganhou 800 pontos!"));
        this.historico.push("".concat(this.nome, " coletou ").concat(powerUp));
    };
    Personagem.prototype.usarPowerUp = function () {
        var powerUpUsado = this.inventario.pop();
        if (powerUpUsado) {
            this.log.addBack("".concat(this.nome, " usou ").concat(powerUpUsado, "!"));
            this.historico.push("".concat(this.nome, " usou ").concat(powerUpUsado));
        }
        else {
            this.log.addBack("".concat(this.nome, " n\u00E3o tem power-ups para usar."));
        }
        return powerUpUsado;
    };
    Personagem.prototype.consumirItem = function (item) {
        var sucesso = this.inventario.removerItem(item);
        if (sucesso) {
            this.log.addBack("".concat(this.nome, " consumiu ").concat(item, " do invent\u00E1rio."));
            this.historico.push("".concat(this.nome, " consumiu ").concat(item, "."));
        }
        return sucesso;
    };
    Personagem.prototype.desviar = function () {
        var chance = Math.random();
        return chance <= 0.4;
    };
    Personagem.prototype.atacarInimigo = function (desviou) {
        var pontos = 400;
        this.log.addBack("-> ".concat(this.nome, " contra-atacou o inimigo! Ganhou 400 pontos."));
        this.historico.push("".concat(this.nome, " atacou um inimigo."));
        this.pontuacoesRodadas.push(pontos);
        return pontos;
    };
    return Personagem;
}());
exports.Personagem = Personagem;
