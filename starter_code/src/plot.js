// Game controller -----------------------------------------
const plot = {
  days: 0,
  clues: {
    tavernMan: false,
    mayor: false,
  },
  scapeBattle: false,
} 

const places = {
  dungeon: {
    openGate: false,
    breakGate: false,
    alardKidnapper: false,
  },
}

// Game Stats ----------------------------------------------
function start() {
  player.hitPoints = 10;
  player.life = true;
  enemy.hitPoints = gameDificulty.enemyhitPoints;
  enemy.life = true;
  daughter.hitPoints = 10;
  daughter.life = true;
  buffer = [];

  history.innerHTML = '';

  print('Escolha a dificuldade do jogo.');
  optionsBtn([
    { text: 'Fácil', callback: easyGame },
    { text: 'Médio', callback: mediumGame },
    { text: 'Difícil', callback: hardGame },
  ]);

  document.body.classList.add('playing');
}

function gameOver() {
  if (!player.life) {
    print('GAME OVER');
    optionsBtn([
      { text: 'Jogar de novo', callback: start },
    ]);
  }
}

function winBattle() {
  if (!enemy.life) {
    print('Parabéns! Você venceu a batalha.');
    optionsBtn([
      { text: 'Resgatar a garota', callback: rescue },
    ]);
  }
}

// Game plot ---------------------------------------------
let initiative = [enemy, player];

function begin() {
  print('Ao analisar a área dos fundos da casa, você encontrou uma série de pegadas largas, provavelmente de um homem, em direção à floresta.')
  print('Você resolve seguir as pegadas e, após andar por 1 hora e meia floresta à dentro, as pegadas desaparecem.')
  print('Você acha isso suspeito e vasculha o entorno, até que encontra uma especie de caverna com um portão trancado com cadeado. O portão não parece estar nas melhores condições.')

  optionsBtn([
    { text: 'Abrir cadeado', callback: roguesTools },
    { text: 'Arrombar portão', callback: breakGate },
  ]);
}

function foundKidnapper() {
  print(`${enemy.name}: Quem é você? O que está fazendo aqui? Saia já daqui ou irá se arrepender!`)

  optionsBtn([
    { text: 'Lutar', callback: fight },
    { text: 'Negociar', callback: negociate },
    { text: 'Fugir', callback: scape },
  ]);
}

function scape() {
  plot.scapeBattle = true;
  daughter.life = false;
  print('Você usa ação ardilosa para desengajar e dispara para bem longe. Depois de um tempo correndo, você encontra um arbusto para se esconder.');

  optionsBtn([
    { text: 'Esperar', callback: wait },
    { text: 'Voltar', callback: comeBack },
    { text: 'Casa do prefeito', callback: mayorsHouse },
  ]);
}

function surrender() {
  print(`${player.name}: Aonde está a garota? Vamos! Me leve até ela.`);
  print(`${enemy.name}: Ela está trancada lá no fundo. A chave está no meu bolso.`);
  print(`${player.name}: Ela está viva? Por que você fez isso? Só por dinheiro?`)
  print(`${enemy.name}: Ela está bem. Eu não faria mal a ela. O plano era mantê-la aqui até receber o resgate.`);

  optionsBtn([
    { text: 'Interrogar', callback: interrogate },
    { text: 'Resgatar a garota', callback: rescue },
  ]);
}


// Game actions ---------------------------------------------

function roguesTools() {
  print('Você pega suas ferramentas de ladino e com toda a sua habilidade, tenta abrir o cadeado.');
  const check = player.hability();

  if (check) {
    places.dungeon.openGate = true;
    print('O portão foi aberto.')
    print('A caverna está escura. Você resolve entrar com cuidado para não alardar quem possa estar lá dentro.')
    stealth();
  } 
}

function breakGate() {
  print('Você dá uma distância do portão e corre com toda sua velocidade, se jogando contra o portão.');
  print('O portão caiu com o impacto, fazendo um estrondoso barulho.');
  print('Passos apressados são ouvidos. Parece estar vindo alguém. Não tem onde se esconder. Não dá tempo.');
  foundKidnapper();
}

function stealth() {
  const check = player.hability();

  if (check) {
    initiative = [player, enemy];
    print('Não dá para ver quase nada, mas você tem muita habilidade em ser furtiva e consegue adentrar na caverna sem chamar atenção.');
    print('Ao fim do túnel de entrada, você avista uma área iluminada por uma tocha e a silhueta de uma pessoa. Você entra com cuidado e dá de cara com um homem forte a encarando.');
    foundKidnapper();
  } else {
    print('Não dá para ver quase nada e, mesmo tomando cuidado, você acaba esbarrando em uns entulhos de metal no meio do túnel de entrada, ressoando o barulho para dentro da caverna.')
    print('Passos apressados são ouvidos. Parece estar vindo alguém. Não tem onde se esconder. Não dá tempo.');
    foundKidnapper();
  }
}

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

  gameOver();
  winBattle();
}

function negociate() {
  if (enemy.hitPoints > (gameDificulty.enemyhitPoints / 2)) {
    print(`${player.name}: Calma. Vamos conversar. Eu vim pela garota. Liberte-a e eu não te machucarei.`);
    print(`${enemy.name}: Garota? Não sei do que está falando. E quem você pensa que é, insolente? Você, me machucar? HAHAHAHAHA! Que piada. Você vai pagar por ter se metido no que não devia!`);
    fight();
    return;
  }

  print(`${player.name}: Pare! Você não precisa morrer. Se renda e entregue a garota.`);
  print(`${enemy.name}: Mas... Quem é você? Ah... Não vale a pena morrer por nenhum dinheiro. Espere. Eu te levo até ela.`);
  print(`${player.name}: Jogue sua arma pra cá e coloque as mãos nas costas.`)
  print('Você amarra as mãos do sequestrador.')
  print(`${enemy.name}: Arghhh...`);
  surrender();
}

function wait() {
  
}

function rescue() {
  
}

function comeBack() {
  
}

function mayorsHouse() {
  
}


