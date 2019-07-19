function print(phrase) {
  let i = 0;
  document.getElementById('text').innerHTML = ''
  const intervalId = setInterval(() => {
    document.getElementById('text').innerHTML += phrase[i]
    i++;
    if (i > phrase.length - 1) {
      document.getElementById('text').innerHTML += '<br>'
      clearInterval(intervalId);
    }
  }, 100);
 }

print('essa é uma mensagem teste.');
// print('esse é um segundo paragrafo.');

document.getElementById('first-option').onclick = () => {
  print('você clicou na primeira opção.');
}
