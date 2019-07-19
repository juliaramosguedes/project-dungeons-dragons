const text = document.getElementById('text');

function print(phrase) {
  let i = 0;
  text.innerHTML = '';
  const intervalId = setInterval(() => {
    text.innerHTML += phrase[i];
    i++;
    if (i > phrase.length - 1) {
      text.innerHTML += '<br>';
      clearInterval(intervalId);
    }
  }, 100);
}

// print('essa é uma mensagem teste.');
// print('esse é um segundo paragrafo.');

document.getElementById('first-option').onclick = () => {
  print('você clicou na primeira opção.');
};

function rollDice(sides) {
  const roll = Math.ceil(Math.random() * sides);
  print(`O número rolado no dado de ${sides} lados (d${sides}) foi ${roll}.`);
  return roll;
}

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
