function begin() {


  
  optionsBtn([
    {
      text: 'Lutar',
      callback: fight,
    },
    {
      text: 'Negociar',
      callback: negociate,
    },
    {
      text: 'Fugir',
      callback: scape,
    },
  ]);
}
  
// Game actions ---------------------------------------------
let initiative = [enemy, player];

function fight() {
  if (initiative[0].life && initiative[1].life) {

    // First attacker
    if (initiative[0].life) {
      print(`${initiative[0].name} está atacando.`);
      const firstAttacker = initiative[0].attack();

      if (firstAttacker) {
        initiative[1].receiveDamage(firstAttacker);
      }
    }

    // Second attacker
    if (initiative[1].life) {
      print(`${initiative[1].name} está atacando.`);
      const secondAttacker = initiative[1].attack();

      if (secondAttacker) {
        initiative[0].receiveDamage(secondAttacker);
      }
    }
  } else {
    print('A batalha terminou.');
  }
}

function negociate(character) {
  if (character.hitPoints > (gameDificulty.enemyhitPoints / 2)) {
    // console.log(player.hitPoints)
    print(`${player.name}: Calma. Vamos conversar. Eu vim pela garota. Liberte-a e eu não te machucarei.`)
    print(`${enemy.name}: Quem você pensa que é, insolente? Você, me machucar? HAHAHAHAHA! Que piada. Você vai pagar por ter se metido no que não devia!`)
  }
  
  if (character.hitPoints < (gameDificulty.enemyhitPoints / 2)) {
    // console.log(enemy.hitPoints)
    print(`${player.name}: Pare! Você não precisa morrer. Se renda e entregue a garota.`)
    print(`${enemy.name}: Mas... Quem é você? Ah... Não vale a pena morrer por nenhum dinheiro. Espere. Eu te levo até ela.`)
    print(`${player.name}: Jogue sua arma pra cá e coloque as mãos nas costas.`)
    print(`${enemy.name}: Arghhh...`)
  }

  if (character.hitPoints <= 0) {
    print(`Tarde demais para negociar. Você matou o ${enemy.name}.`)
    optionsBtn([
      {
        text: 'Resgatar a garota',
        callback: rescue,
      },
      {
        text: 'Taverna',
        callback: tavern,
      },
      {
        text: 'Casa do prefeito',
        callback: mayorsHouse,
      },
    ]);
  }
}

function scape() {
  print('Você usa ação ardilosa para desengajar e dispara para bem longe. Depois de um tempo correndo, você encontra um arbusto para se esconder.');

  optionsBtn([
    {
      text: 'Esperar',
      callback: wait,
    },
    {
      text: 'Taverna',
      callback: tavern,
    },
    {
      text: 'Casa do prefeito',
      callback: mayorsHouse,
    },
  ]);
}

function rescue() {
  
}

function tavern() {
  
}

function mayorsHouse() {
  
}

function wait() {
  
}
