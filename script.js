let players = {};
let indexPlayer = -1;

document.addEventListener("DOMContentLoaded", function () {
  let modal = document.getElementById("modal");
  let button = modal.querySelector("button");
  let input = modal.querySelector("input");

  button.addEventListener("click", function () {
    let value = input.value.toUpperCase();
    players[value] = { score: 0 };
    modal.style.display = "none";
    gerarListaJogadores();
    //document.getElementById("quem-joga").innerHTML = "Jogador: " + Object.keys(players)[indexPlayer];
  });

  // modal.style.display = 'block'; // Exibe o modal
});

function iniciarJogo() {
  const initialScreen = document.getElementById("initial-screen");
  initialScreen.style.display = "none";
  let modal = document.getElementById("modal");
  modal.style.display = "block";
}

// Defina uma lista de palavras possíveis com suas respectivas dicas
const palavras = [
  {
    palavra: "BOLA",
    dica: "Objeto esférico usado em diversos esportes",
    qtnLetras: 4,
  },
  {
    palavra: "CARRO",
    dica: "Veículo de quatro rodas usado para transporte",
    qtnLetras: 4,
  },
  {
    palavra: "CASA",
    dica: "Habitação comum feita de tijolos, madeira, etc.",
    qtnLetras: 3,
  },
  {
    palavra: "BANANA",
    dica: "Fruta amarela e doce com formato alongado",
    qtnLetras: 3,
  },
  {
    palavra: "MESA",
    dica: "Móvel com tampo plano e suportes para sustentá-lo",
    qtnLetras: 4,
  },
  {
    palavra: "GATO",
    dica: "Animal doméstico de estimação com pelos macios",
    qtnLetras: 4,
  },
  {
    palavra: "ABACAXI",
    dica: "Fruta tropical com casca dura e polpa doce",
    qtnLetras: 5,
  },
];

function gerarListaJogadores() {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ""; // remove todos os elementos filhos da div "jogadores"
  for (let i = 0; i < Object.keys(players).length; i++) {


    const player = Object.keys(players)[i];
    const scorePlayer = players[player].score ? players[player].score : 0;
    jogador.textContent = styleString(player) + ": " + scorePlayer + " pontos";
    const newPlayer = `
    <tr>
      <td>${styleString(player)}</td>
      <td>${scorePlayer}</td>
    </tr>`;
    
    tableBody.innerHTML += newPlayer;
  }
  const lengthPlayers = Object.keys(players).length;
  if (lengthPlayers > 0) {
    if (indexPlayer === lengthPlayers - 1) indexPlayer = 0;
    else indexPlayer++;
  } else {
    indexPlayer = 0;
  }
  const quemJoga = Object.keys(players)[indexPlayer];

  document.getElementById("quem-joga").innerHTML =
    `Vez do <span>${styleString(quemJoga)}</span>`;
}

function clearField(id) {
  document.getElementById(id).value = "";
}

function setPalavra() {
  let palavra = document.getElementById("novaPalavra").value;
  clearField("novaPalavra");
  let dica = document.getElementById("novaDica").value;
  clearField("novaDica");
  let qtnLetras = obterNumeroDeLetrasUnicas(palavra);
  let palavraObj = {
    palavra: palavra.toUpperCase(),
    dica: dica,
    qtnLetras: qtnLetras,
  };
  palavras.push(palavraObj);
  reiniciarJogo(palavraObj);
}

const winSound = new Audio("media/win.wav");
const endSound = new Audio("media/end.wav");
const pointSound = new Audio("media/point.wav");

// Inicie o jogo chamando a função para reiniciá-lo
reiniciarJogo(null, true);

// Escolha uma palavra aleatória da lista e exiba sua dica na tela HTML
var indicePalavraEscolhida = Math.floor(Math.random() * palavras.length);
var palavraEscolhida = palavras[indicePalavraEscolhida].palavra;
//let letrasPalavraEscolhida = palavras[indicePalavraEscolhida].qtnLetras;

document.documentElement.style.setProperty("--tamanho-palavra", palavra.length);
var dicaPalavraEscolhida = palavras[indicePalavraEscolhida].dica;
document.getElementById("dica").innerHTML = "Dica: " + dicaPalavraEscolhida;

// Crie a árvore binária para a palavra escolhida
var arvore = criarArvore(palavraEscolhida);

// Defina uma função para atualizar a exibição da palavra
function atualizarPalavra(letras) {
  let palavraExibicao = "";
  for (let i = 0; i < palavraEscolhida.length; i++) {
    if (letras.indexOf(palavraEscolhida[i]) !== -1) {
      palavraExibicao += palavraEscolhida[i] + " ";
    } else {
      palavraExibicao += "_ ";
    }
  }
  document.getElementById("palavra").innerHTML = palavraExibicao;
  return palavraExibicao.replace(/\s+/g, "").trim();
}

// Defina uma função para verificar se a palavra foi adivinhada
function verificarAdivinhacao() {
  let letra = document.getElementById("letra").value.toUpperCase();
  clearField("letra");
  const quemJoga = Object.keys(players)[indexPlayer];
  if (verificarLetra(letra, arvore)) {
    pointSound.play();
    letrasCorretas.push(letra);
  } else if (letra === palavraEscolhida) {
    letrasCorretas = palavraEscolhida.split("");
    winSound.play();
    alert("Parabéns, você acertou a palavra " + palavraEscolhida + "!");
    players[quemJoga].score++;
    reiniciarJogo();
  } else {
    tentativasRestantes--;
    atualizarBoneco();
  }
  const atualizar = atualizarPalavra(letrasCorretas).toString();
  if (atualizar == palavraEscolhida) {
    winSound.play();
    alert("Parabéns, você acertou a palavra " + palavraEscolhida + "!");
    players[quemJoga].score++;
    reiniciarJogo();
  }
  atualizarTentativas();
  if (tentativasRestantes === 0) {
    endSound.play();
    alert("Fim de jogo! A palavra era " + palavraEscolhida);
    reiniciarJogo();
  }
}

// Defina uma função para atualizar a exibição do número de tentativas restantes
function atualizarTentativas() {
  document.getElementById("tentativas").innerHTML =
    "Tentativas restantes: " + tentativasRestantes;
}

// Defina uma função para atualizar a exibição do boneco
function atualizarBoneco() {
  let partesBoneco = [
    "cabeca",
    "corpo",
    "braco-esquerdo",
    "braco-direito",
    "perna-esquerda",
    "perna-direita",
  ];
  let parteAtual = partesBoneco[5 - tentativasRestantes];
  document.getElementById(parteAtual).style.display = "block";
}

// Defina uma função para reiniciar o jogo
function reiniciarJogo(palavraPersonalizada = null, first = false) {
  if (!first) gerarListaJogadores();
  // Escolha uma nova palavra aleatória da lista e exiba sua dica na tela HTML
  if (palavraPersonalizada) {
    palavraEscolhida = palavraPersonalizada.palavra;
    dicaPalavraEscolhida = palavraPersonalizada.dica;
  } else {
    indicePalavraEscolhida = Math.floor(
      Math.random() * Object.keys(palavras).length
    );
    palavraEscolhida = palavras[indicePalavraEscolhida].palavra;
    dicaPalavraEscolhida = palavras[indicePalavraEscolhida].dica;
  }
  document.getElementById("dica").innerHTML = "Dica: " + dicaPalavraEscolhida;

  // Crie uma árvore binária para a nova palavra escolhida
  arvore = criarArvore(palavraEscolhida);

  // Reinicie as variáveis do jogo
  letrasCorretas = [];
  tentativasRestantes = 6;
  atualizarPalavra(letrasCorretas);
  atualizarTentativas();
  reiniciarBoneco();
}

function updateJogadores() {
  clearField("erro");
  const jogador = document.getElementById("jogador").value.toUpperCase();
  clearField("jogador");
  // Faz as alterações desejadas no objeto JavaScript
  if (players[jogador]) {
    document.getElementById("erro").innerHTML = "Jogador Já existe";
    //new Promise((res) => setTimeout(res, 5000));
    //clearField('erro');
    return;
  } else if (Object.keys(players).length >= 5) {
    document.getElementById("erro").innerHTML = "Limite de jogadores atingido";
    //new Promise((res) => setTimeout(res, 5000));
    //clearField('erro');
    return;
  }
  players[jogador] = { score: 0 };
  gerarListaJogadores();
}

// Defina uma função para reiniciar a exibição do boneco
function reiniciarBoneco() {
  let partesBoneco = [
    "cabeca",
    "corpo",
    "braco-esquerdo",
    "braco-direito",
    "perna-esquerda",
    "perna-direita",
  ];
  for (let i = 0; i < partesBoneco.length; i++) {
    document.getElementById(partesBoneco[i]).style.display = "none";
  }
}
