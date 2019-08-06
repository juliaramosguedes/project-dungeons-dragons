// DOM -----------------------------------------------------
const options = document.getElementById('options');
const board = document.getElementById('board');
const history = document.getElementById('history');


// HTML functions -----------------------------------------
let buffer = [];
let isPrinting = false;
let printingInterval = 0;
let btnBuffer = [];

function printBuffer() {
  if (!buffer.length || isPrinting) {
    return;
  }

  isPrinting = true;

  printingInterval = setInterval(() => {
    let currentPhrase = buffer.shift();

    // Add last letter
    history.innerHTML += currentPhrase.slice(0, 1);

    // Keep board on bottom
    board.scrollTop = board.scrollHeight;

    if (currentPhrase.length > 1) {
      buffer.unshift(currentPhrase.slice(1));
      return;
    }

    // Add break line to next phrase
    history.innerHTML += '<br>';

    // Finish printing
    clearInterval(printingInterval);
    isPrinting = false;
    
    // Do again, because we may have phrase on buffer
    printBuffer();

    // After printing all buffer
    if (!buffer.length) {
      afterPrint();
    }
    
  }, 60);
}

function print(phrase) {
  buffer.push(phrase);
  printBuffer();
}

function printAll() {
  clearInterval(printingInterval);
  isPrinting = false;

  for (let i = 0; i < buffer.length; i++) {
    history.innerHTML += buffer[i] + '<br>';
  }

  afterPrint();

  // Keep board on bottom and clear buffer
  board.scrollTop = board.scrollHeight;
  buffer = [];
}

function afterPrint() {
  displayBtn()
}

function displayBtn() {
  optionsBtn(btnBuffer[btnBuffer.length-1])
}

function optionsBtn(optionsArray) {
  options.innerHTML = '';

  optionsArray.forEach((element) => {
    let option = document.createElement('button');
    option.type = 'button';
    option.classList.add('btn', 'btn-success', 'col-10', 'col-md-2');
    option.textContent = element.text || '';
    option.onclick = () => {
      printAll();
      element.callback(option);
      options.innerHTML = '';
    };
    options.appendChild(option);
  });
}

// Game levels ----------------------------------------------
const gameDificulties = {
  easy: {
    dificulty: 'easy',
    rollCheck: 12,
    enemyhitPoints: 10,
    enemyWeapon: 'cimitarra',
    enemyDiceAttack: 6,
    habilityChances: 3,
  },
  medium: {
    dificulty: 'medium',
    rollCheck: 14,
    enemyhitPoints: 14,
    enemyWeapon: 'espada longa',
    enemyDiceAttack: 8,
    habilityChances: 2,
  },
  hard: {
    dificulty: 'hard',
    rollCheck: 16,
    enemyhitPoints: 18,
    enemyWeapon: 'machado grande',
    enemyDiceAttack: 12,
    habilityChances: 1,
  },
};

let gameDificulty = gameDificulties.easy;

function easyGame() {
  gameDificulty = gameDificulties.easy;
  print('Modo fácil escolhido.');
  begin();
}

function mediumGame() {
  gameDificulty = gameDificulties.medium;
  print('Modo médio escolhido.');
  begin();
}

function hardGame() {
  gameDificulty = gameDificulties.hard;
  print('Modo difícil escolhido.');
  begin();
}


// Game functions ------------------------------------------
function rollDice(sides) {
  const roll = Math.ceil(Math.random() * sides);
  print(`O número rolado no dado de ${sides} lados (d${sides}) foi ${roll}.`);
  return roll;
}

function d20Check(callback) {
  const roll = rollDice(20);
  const dificulty = gameDificulty.rollCheck;
  let check = roll >= dificulty;

  if (roll === 1) {
    print('Falhou miseravelmente.');
    check = 'fail';
  }

  if (roll === 20) {
    print('Uau! Um crítico. Fenomenal!');
    check = 'critical';
  }

  callback.call(null, check);
}

function habilityCheck() {
  let check = false;
  d20Check((result) => {
    // Aqui vai o que deve ser feito após o resultado
    if (result === 'fail' || !result) {
      player.habilityChances--;
      print('Não foi dessa vez.');
      btnBuffer.pop();
    } else {
      print(`${player.name} passou no teste.`);
      check = true;
      player.habilityChances = gameDificulty.habilityChances;
      btnBuffer.pop();
    }
  })
  return check;
}


// Classes --------------------------------------------------
class Character {
  constructor(name, hitPoints, diceAttack, weapon) {
    this.name = name;
    this.hitPoints = hitPoints;
    this.diceAttack = diceAttack;
    this.weapon = weapon;
    this.life = true;
    this.habilityChances = gameDificulty.habilityChances;
  }

  // playerRoll() {

  // }

  attack() {
    const check = d20Check();

    if (check === 'fail') {
      print(`${this.name} derrubou seu(sua) ${this.weapon} no chão.`);
      return false;
    }

    if (check === 'critical') {
      print(`${this.name} acertou seu inimigo com maestria.`);
      return 30;
    }

    if (check) {
      print(`${this.name} acertou o golpe de ${this.weapon}.`);
      return rollDice(this.diceAttack);
    // eslint-disable-next-line no-else-return
    } else {
      print('Não foi dessa vez.');
      return false;
    }
  }

  receiveDamage(damage) {
    if (damage) this.hitPoints -= damage;
    if (this.hitPoints < 1) this.life = false;
    this.life ? print(`${this.name} recebeu ${damage} ponto(s) de dano.`) : print(`${this.name} levou um golpe mortal.`);
    return damage;
  }

  hability() {
    let check = false;
    if (this.habilityChances > 0) {

      btnBuffer.push([
        { text: 'Rolar o dado', 
          callback: d20Check((result) => {
            // Aqui vai o que deve ser feito após o resultado
            if (result === 'fail' || !result) {
              this.habilityChances--;
              print('Não foi dessa vez.');
              btnBuffer.pop();
            } else {
              print(`${this.name} passou no teste.`);
              check = true;
              this.habilityChances = gameDificulty.habilityChances;
              btnBuffer.pop();
            }
          })
        },
      ]);
    } else {
      print(`${this.name} se esforçou muito e por fim acabou desistindo, mas voltou no dia seguinte para tentar novamente.`);
      plot.days++
      this.habilityChances = gameDificulty.habilityChances;
    }
    return check;
  }
}

let player = new Character('Ariel', 10, 8, 'rapieira');
let enemy = new Character('Sequestrador', gameDificulty.enemyhitPoints, gameDificulty.enemyDiceAttack, gameDificulty.enemyWeapon);
let daughter = new Character('Beatrice', 10, 4, 'adaga');
