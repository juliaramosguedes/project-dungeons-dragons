const text = document.getElementById('text');
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
    text.innerHTML += currentPhrase[i];
    i++;

    if (i <= currentPhrase.length - 1) {
      return;
    }

    text.innerHTML += '<br>';
    clearInterval(intervalId);
    isPrinting = false;
    printBuffer();
  }, 100);
}

function print(phrase) {
  buffer.push(phrase);
  printBuffer();
}

// print('essa é uma mensagem teste.');
// print('essa mensagem deveria ser printada na linha debaixo.');

document.getElementById('first-option').onclick = () => {
  print('você clicou na primeira opção.');
};

function rollDice(sides) {
  const roll = Math.ceil(Math.random() * sides);
  print(`O número rolado no dado de ${sides} lados (d${sides}) foi ${roll}.`);
  return roll;
}

function optionsBtn(optionsArray) {
  document.getElementById('buttons').innerHTML = '';

  optionsArray.forEach((button) => {
    let element = document.createElement('button');
    element.type = 'button';
    element.classList.add('btn', 'btn-success', 'col-12', 'col-md-2');
    element.textContent = button.text || '';
    element.onclick = () => {
      button.callback(element);
      element.setAttribute("disabled", "disabled");
      // document.getElementById('buttons').innerHTML = '';
    }; 

    document.getElementById('buttons').appendChild(element);
  });
} 

const Actions = {
  fight: () => {
    print('Eita!');
  },
  scape: () => {
    print('Fugi');
  },
  negociate: () => {
    print('Fala ae.');
  },
};

optionsBtn([
  {
    text: 'lutar',
    callback: Actions.fight,
  },
  {
    text: 'lutar também',
    callback: Actions.fight,
  },
  {
    text: 'fugir',
    callback: Actions.scape,
  },
]);

// console.log(rollDice(6))

class Character {
  constructor(name, health, strength) {
    this.health = health;
    this.strength = strength;
    this.name = name;
    this.life = true;
  }

  attack() {
    return this.strength;
  }

  receiveDamage(damage) {
    this.health -= damage;
    if (this.health < 1) this.life = false;
    return this.health > 0 ? `${this.name} recebeu ${damage} pontos de dano.` : `${this.name} levou um golpe mortal.`;
  }
}
// const player = new Character('Julia', 10, 5)
// console.log(player.life)
// print(player.receiveDamage(15))
// console.log(player.life)
