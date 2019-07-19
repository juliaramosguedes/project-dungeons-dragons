let initiative = [enemy, player]

const actions = {
    fight: () => {
        if (initiative[0].life && initiative[1].life) {

            // First attacker
            if (initiative[0].life) {
                print(`${initiative[0].name} está atacando.`)  
                const firstAttacker = initiative[0].attack()
        
                if (firstAttacker) {
                    initiative[1].receiveDamage(firstAttacker)
                }
            }

            // Second attacker
            if (initiative[1].life) {
                print(`${initiative[1].name} está atacando.`)  
                const secondAttacker = initiative[1].attack()

                if (secondAttacker) {
                    initiative[0].receiveDamage(secondAttacker)
                }
            }
        } else {
            print('A batalha terminou.')
        }
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
      callback: actions.fight,
    },
    {
      text: 'negociar',
      callback: actions.negociate,
    },
    {
      text: 'fugir',
      callback: actions.scape,
    },
  ]);

