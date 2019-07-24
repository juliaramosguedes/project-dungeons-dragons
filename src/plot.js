// Game controller -----------------------------------------
const plot = {
  days: 0,
  clues: {
    tavernMan: false,
    mayor: false,
  },
  surrender: false,
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
  if (!player.life || !daughter.life) {
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
  // plot.scapeBattle = true;
  print('Você usa ação ardilosa para desengajar e dispara para bem longe. Depois um tempo correndo, você encontra um arbusto para se esconder.');

  if (days > 0) daughter.life = false;

  optionsBtn([
    { text: 'Esperar', callback: wait },
    { text: 'Voltar', callback: comeBack },
  ]);
}

function surrender() {
  print(`${player.name}: Aonde está a garota? Vamos! Me leve até ela.`);
  print(`${enemy.name}: Ela está trancada lá no fundo. A chave está no meu bolso.`);
  print(`${player.name}: Ela está viva? Por que você fez isso? Só por dinheiro?`)
  print(`${enemy.name}: Ela está bem. Eu não faria mal a ela. O plano era mantê-la aqui até receber o resgate.`);
  plot.surrender = true;

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
    // places.dungeon.openGate = true;
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
  daughter.life = false;
  print('Você espera por aproximadamente meia hora e ao longe avista o que parece ser o sequestrador correndo para dentro da mata fechada.');

  optionsBtn([
    { text: 'Voltar', callback: comeBack },
  ]);
}

function rescue() {
  print('Ao vasculhar a caverna, no final dela você encontra uma cela.');
  if (plot.surrender) {
    print('Você abre a cela com a chave que estava com o sequestrador e encontra uma garota de longos cabelos pretos e pele branca como a lua. Você a reconhece de um quadro na casa do prefeito. É a Beatrice.');
    mayorsHouse();
  } else {
    print('Está trancada. Você chama por Beatrice.');
    print('Beatrice: Socorro! Por favor, me salva.');
    print('Ariel: Aguenta só mais um pouco, Beatrice. Eu vou te tirar daí.');
    print('Você não poupa esforços e tempo, até finalmente destrancar a porta. Você encontra uma garota de longos cabelos pretos e pele branca como a lua. Você a reconhece de um quadro na casa do prefeito. É a Beatrice.');
    mayorsHouse();
  }
}

function comeBack() {
  print('Ao voltar para a caverna, você a vasculha inteira até encontrar uma cela entre aberta. Há uma poça de sangue vindo por debaixo da porta.');
  print('Você abre a porta, iluminando o seu interior e encontra uma garota de longos cabelos pretos e pele branca como a lua. Você a reconhece de um quadro na casa do prefeito. É a Beatrice.');

  if (daughter.life) {
    print('Ela está se esvaindo em sangue. Você rapidamente verifica sua pulsação e constata: ela está viva. Ufa!');
    print('Você rasga um pedaço de sua camiseta e a pressiona contra o pescoço de Beatrice, tentando estancar seu sangue. Com a outra mão, abre seu kit de medicina e procura por ervas que possam ajudar na cicatrização.');
    const check = player.hability();

    if (check) {
      print('Está dando certo. O fluxo de sangue diminuiu. Você conversa com Beatrice e tenta a manter acordada. Habilmente, você identifica as ervas e faz todo o procedimento para fechar o ferimento. Após um tempo, Beatrice recobra a consciência.');
      
      optionsBtn([
        { text: 'Casa do prefeito', callback: mayorsHouse },
      ]);
      
    } else {
      daughter.life = false;
      print('O sangue continua jorrando do pescoço de Beatrice. Você fica cada vez mais nervosa, incapaz de identificar as ervas corretas. Beatrice já perdeu muito sangue. Ela está inconsciente e pálida.');
      print('Você faz tudo que pode para evitar que Beatrice morra, mas seus esforços foram em vão. Ao checar o pulso de Beatrice percebe que ela já não está mais entre os vivos.');
      daughterDead()
    }
  } else {
    print('Mas ela está completamente envolta em sangue. Ao verificar sua pulsação, você constata que ela já não está mais entre os vivos. Se você tivesse voltado antes... A culpa começa a te consumir.');
    daughterDead()
  }
}

function daughterDead() {
  print('O sequestrador fugiu. A Beatrice está morta. Só te resta voltar à casa do prefeito para entregar o corpo de sua filha, para que ele possa ser apropriadamente velado.');
  print('Não foi dessa vez.');
  gameOver();
}

function interrogate() {
  print(`${player.name}: Me conta mais sobre esse plano. E pense muito bem antes de mentir. Por quê você a sequestrou? Fale por bem ou por mal.`);
  print(`Você pega uma adaga, segura a mão do sequestrador e ameaça enfiar a ponta da adaga embaixo da unha de um dos dedos dele.`);

  const check = player.hability();

  if (check) {
    plot.clues.tavernMan = true;
    print(`${enemy.name}: O plano não é meu. Eu só estou seguindo ordens, eu juro. Ele disse que não teríamos problemas. Não era pra você encontrar esse local.`)
    print(`${player.name}: Ele quem? Quem foi que te contratou? Qual era o plano?`)
    print(`${enemy.name}: Eloir, o taverneiro. Foi tudo ideia dele. Era pra eu sequestrar a garota, mantê-la aqui até a eleição passar, receber a recompensa e devolver ela viva. Eu não ia fazer mal à ela. Por favor, eu te contei tudo que sei. Não me machuque.`)
  } else {
    print(`Não precisa disso! Por favor. Eu fiz por dinheiro. Só isso. Não me machuque.`)
  }

  optionsBtn([
    { text: 'Resgatar a garota', callback: rescue },
  ]);
}

function mayorsHouse() {
  print('Você volta à cidade e leva Beatrice de volta à sua casa. Ela finalmente está segura.')
  print('O prefeito te recebe. Primeiro, perplexo, depois feliz. Ele corre até Beatrice e a abraça.')
  print('Prefeito: Minha filha, você está bem??? Graças à Deus! Rezei tanto pra te que você voltasse. Ariel, não tenho como te agradecer. Vamos, entrem, por favor.')
  print('Você e o prefeito conversam sobre toda a missão.')

  if (plot.clues.tavernMan) {
    print('Prefeito: O taverneiro? Eu não acredito. Por quê?! Eu nunca imaginaria. Você foi muito bem, Ariel. Muito bem! Será muito bem recompensada.')
    print('Parabéns! Você salvou Beatrice e desvendou o mistério.')
  } else {
    print('Parabéns! Você salvou Beatrice, mas tem certeza que você desvendou o sequestro?')
  }

  print('GAME OVER');
  optionsBtn([
    { text: 'Jogar de novo', callback: start },
  ]);
}
