// HTML functions

const history = document.getElementById('history');
const options = document.getElementById('options');
const board = document.getElementById('board');
const buffer = [];
let isPrinting = false;

function printBuffer() {
  if (!buffer.length || isPrinting) {
    return;
  }

  isPrinting = true;

  const currentPhrase = buffer.shift();
  let i = 0;
  const intervalId = setInterval(() => {
    history.innerHTML += currentPhrase[i];
    i++;

    if (i <= currentPhrase.length - 1) {
      return;
    }

    history.innerHTML += '<br>';
    clearInterval(intervalId);
    isPrinting = false;
    // updateScroll();
    printBuffer();    
  }, 100);
}

function print(phrase) {
  buffer.push(phrase);
  printBuffer();
}

// print('essa é uma mensagem teste.');
// print('essa mensagem deveria ser printada na linha debaixo.');

function optionsBtn(optionsArray) {
  options.innerHTML = '';

  optionsArray.forEach((element) => {
    let option = document.createElement('button');
    option.type = 'button';
    option.classList.add('btn', 'btn-success', 'col-12', 'col-md-2');
    option.textContent = element.text || '';
    option.onclick = () => {
      element.callback(option);
      // option.setAttribute("disabled", "disabled");
      // options.innerHTML = '';
    }; 

    options.appendChild(option);
  });
} 


// Game functions

let days = 0;

const gameDificulties = [
  {
  dificulty: 'easy',
  rollCheck: 12,
  enemyLife: 10,
  enemyWeapon: 'cimitarra',
  enemyDiceAttack: 6,
  habilityChances: 3,
  },
  {
    dificulty: 'medium',
    rollCheck: 14,
    enemyLife: 14,
    enemyWeapon: 'espada longa',
    enemyDiceAttack: 8,
    habilityChances: 2,
  },
  {
  dificulty: 'hard',
  rollCheck: 16,
  enemyLife: 18,
  enemyWeapon: 'machado grande',
  enemyDiceAttack: 12,
  habilityChances: 1,
  },
]

let gameDificulty = {
  dificulty: 'easy',
  rollCheck: 12,
  enemyLife: 10,
  enemyWeapon: 'cimitarra',
  enemyDiceAttack: 6,
  habilityChances: 3,
  }

function rollDice(sides) {
  const roll = Math.ceil(Math.random() * sides);
  print(`O número rolado no dado de ${sides} lados (d${sides}) foi ${roll}.`);
  return roll;
}

function d20Check() {
  const roll = rollDice(20)
  const dificulty = gameDificulty.rollCheck
  const check = roll >= dificulty 

  // roll === 1 ? print('Você falhou miseravelmente.') : roll === 20 ? print('Uau! Um crítico. Você foi fenomenal!') : check ? print('Você passou no teste.') : print('Não foi dessa vez.')

  if (roll === 1) {
    print('Falhou miseravelmente.')
    return 'fail'
  } 
  
  if (roll === 20) {
    print('Uau! Um crítico. Fenomenal!')
    return 'critical'
  }   
  // else {
  //   check ? print('Acertou.') : print('Não foi dessa vez.')
  // }
   
  return check
}

// console.log(d20Check())


// Classes

class Character {
  constructor(name, health, diceAttack, weapon) {
    this.name = name;
    this.health = health;
    this.diceAttack = diceAttack;
    this.weapon = weapon;
    this.life = true;
    this.habilityChances = gameDificulty.habilityChances;
    this.currentLocation = 'casa do prefeito';
  }

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

    if (check === true) {
      print(`${this.name} acertou o golpe com ${this.weapon}.`);
      return rollDice(this.diceAttack);
    } else {
      print('Não foi dessa vez.');
      return false;
    }
  }

  receiveDamage(damage) {
    if (damage) this.health -= damage;
    if (this.health < 1) this.life = false;
    this.life ? print(`${this.name} recebeu ${damage} ponto(s) de dano.`) : print(`${this.name} levou um golpe mortal.`);
    return damage;
  }

  hability() {
    let check = false;
    if (this.habilityChances > 0) {
      check = d20Check();
      if (check) {
        print(`${this.name} passou no teste.`);
        this.habilityChances = gameDificulty.habilityChances;
      } else {
        this.habilityChances--
        print('Não foi dessa vez.');
      }
    } else {
      print(`${this.name} se esforçou muito e por fim acabou desistindo, mas voltou no dia seguinte para tentar novamente.`);
      this.habilityChances = gameDificulty.habilityChances;
    }

    return check;
  }
}

const player = new Character('Julia', 10, 8, 'rapieira')
const enemy = new Character('Sequestrador', gameDificulty.enemyLife, gameDificulty.enemyDiceAttack, gameDificulty.enemyWeapon)
// player.attack();
// player.hability()
// console.log(player.habilityChances)

let scrolled = false;
function updateScroll(){
    if(!scrolled){
        board.scrollTop = board.scrollHeight;
        scrolled = false;
    }
}

setInterval(updateScroll, 100);

// board.onscroll = function() {
//   scrolled=true;
// };
