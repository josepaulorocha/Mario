import { Personagem } from "./Personagem";
import { Inimigo } from "./Inimigo";
import { PowerUps } from "./PowerUps";

const MARIO = new Personagem("Mario")
const BOWSER = new Inimigo("Bowser")
const POWERUP = new PowerUps()

MARIO.printPular()
BOWSER.atacar(MARIO)