// Defina uma lista de palavras possíveis com suas respectivas dicas
var palavras = [
  { palavra: "BOLA", dica: "Objeto esférico usado em diversos esportes", qtnLetras: 4 },
  { palavra: "CARRO", dica: "Veículo de quatro rodas usado para transporte", qtnLetras: 4 },
  { palavra: "CASA", dica: "Habitação comum feita de tijolos, madeira, etc.", qtnLetras: 3 },
  { palavra: "BANANA", dica: "Fruta amarela e doce com formato alongado", qtnLetras: 3 },
  { palavra: "MESA", dica: "Móvel com tampo plano e suportes para sustentá-lo", qtnLetras: 4 },
  { palavra: "GATO", dica: "Animal doméstico de estimação com pelos macios", qtnLetras: 4 },
  { palavra: "ABACAXI", dica: "Fruta tropical com casca dura e polpa doce", qtnLetras: 5 },
];
const winSound = new Audio('media/win.wav');
const endSound = new Audio('media/end.wav');
const pointSound = new Audio('media/point.wav');


// Inicie o jogo chamando a função para reiniciá-lo
reiniciarJogo();



// Escolha uma palavra aleatória da lista e exiba sua dica na tela HTML
var indicePalavraEscolhida = Math.floor(Math.random() * palavras.length);
var palavraEscolhida = palavras[indicePalavraEscolhida].palavra;
var letrasPalavraEscolhida = palavras[indicePalavraEscolhida].qtnLetras;

document.documentElement.style.setProperty('--tamanho-palavra', palavra.length);
var dicaPalavraEscolhida = palavras[indicePalavraEscolhida].dica;
document.getElementById("dica").innerHTML = "Dica: " + dicaPalavraEscolhida;

// Defina uma função para criar uma árvore binária a partir da palavra escolhida
function criarArvore(palavra) {
  var letras = palavra.split("");
  var raiz = { letra: letras[0], esquerda: null, direita: null };
  var atual = raiz;
  for (var i = 1; i < letras.length; i++) {
      if (Math.random() < 0.5) {
          atual.esquerda = { letra: letras[i], esquerda: null, direita: null };
          atual = atual.esquerda;
      } else {
          atual.direita = { letra: letras[i], esquerda: null, direita: null };
          atual = atual.direita;
      }
  }
  return raiz;
}

// Crie a árvore binária para a palavra escolhida
var arvore = criarArvore(palavraEscolhida);

// Defina uma função para verificar se uma letra está na árvore binária
function verificarLetra(letra, no) {
  if (no === null) {
      return false;
  }
  if (no.letra === letra) {
      return true;
  }
  return verificarLetra(letra, no.esquerda) || verificarLetra(letra, no.direita);
}

// Defina uma função para atualizar a exibição da palavra
function atualizarPalavra(letrasCorretas) {
  var palavraExibicao = "";
  for (var i = 0; i < palavraEscolhida.length; i++) {
      if (letrasCorretas.indexOf(palavraEscolhida[i]) !== -1) {
          palavraExibicao += palavraEscolhida[i] + " ";
      } else {
          palavraExibicao += "_ ";
      }
  }
  document.getElementById("palavra").innerHTML = palavraExibicao
}

// Defina uma função para verificar se a palavra foi adivinhada
function verificarAdivinhacao() {
  var letra = document.getElementById("letra").value.toUpperCase();
  document.getElementById("letra").value = "";
  if (verificarLetra(letra, arvore)) {
      letrasCorretas.push(letra);
      pointSound.play();
  } else if (letra === palavraEscolhida) {
      letrasCorretas = palavraEscolhida.split("");
      winSound.play();
      alert("Parabéns, você acertou a palavra " + palavraEscolhida + "!");
      reiniciarJogo();
  }
  else {
      tentativasRestantes--;
      atualizarBoneco();
  }
  atualizarPalavra(letrasCorretas);
  atualizarTentativas();
  if (tentativasRestantes === 0) {
      endSound.play();
      alert("Fim de jogo! A palavra era " + palavraEscolhida);
      reiniciarJogo();
  } else if (letrasCorretas.length === letrasPalavraEscolhida) {
      winSound.play();
      alert("Parabéns, você acertou a palavra " + palavraEscolhida + "!");
      reiniciarJogo();
  } else {
      console.log(" ---------------------------- ")
      console.log("letrasCorretas: " +letrasCorretas)
      console.log("letrasCorretasLength: " +letrasCorretas.length)
      console.log("PalavraEscolhida: " + palavraEscolhida)
      console.log("PalavraEscolhidaLength: " + palavraEscolhida.length)
  }
}
  
  // Defina uma função para atualizar a exibição do número de tentativas restantes
function atualizarTentativas() {
  var tentativasExibicao = "Tentativas restantes: " + tentativasRestantes;
  document.getElementById("tentativas").innerHTML = tentativasExibicao;
}
  
  // Defina uma função para atualizar a exibição do boneco
function atualizarBoneco() {
  var partesBoneco = [
  "cabeca", "corpo", "braco-esquerdo", "braco-direito",
  "perna-esquerda", "perna-direita"
  ];
  var parteAtual = partesBoneco[5 - tentativasRestantes];
  document.getElementById(parteAtual).style.display = "block";
}
  
  // Defina uma função para reiniciar o jogo
function reiniciarJogo() {
  // Escolha uma nova palavra aleatória da lista e exiba sua dica na tela HTML
  indicePalavraEscolhida = Math.floor(Math.random() * palavras.length);
  palavraEscolhida = palavras[indicePalavraEscolhida].palavra;
  dicaPalavraEscolhida = palavras[indicePalavraEscolhida].dica;
  document.getElementById("dica").innerHTML = "Dica: " + dicaPalavraEscolhida;
  // Crie uma nova árvore binária para a nova palavra escolhida
  arvore = criarArvore(palavraEscolhida);

  // Reinicie as variáveis do jogo
  letrasCorretas = [];
  tentativasRestantes = 6;
  atualizarPalavra(letrasCorretas);
  atualizarTentativas();
  reiniciarBoneco();
}

// Defina uma função para reiniciar a exibição do boneco
function reiniciarBoneco() {
  var partesBoneco = [
  "cabeca", "braco-esquerdo", "braco-direito",
  "perna-esquerda", "perna-direita"
  ];
  for (var i = 0; i < partesBoneco.length; i++) {
      document.getElementById(partesBoneco[i]).style.display = "none";
  }
}
