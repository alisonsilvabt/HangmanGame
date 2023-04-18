let players = {};
let indexPlayer = -1;

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('modal');
    var button = modal.querySelector('button');
    var input = modal.querySelector('input');
  
    button.addEventListener('click', function() {
      var value = input.value;
      players[value] = { score: 0 };
      modal.style.display = "none";
      gerarListaJogadores();
      //document.getElementById("quem-joga").innerHTML = "Jogador: " + Object.keys(players)[indexPlayer];
    });
  
    modal.style.display = 'block'; // Exibe o modal
});



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


function gerarListaJogadores() {
    const lista = document.getElementById("jogadores");
    lista.innerHTML = ""; // remove todos os elementos filhos da div "jogadores"
    for (let i = 0; i < Object.keys(players).length; i++) {
      const jogador = document.createElement("li");
      const player = Object.keys(players)[i];
      const scorePlayer = players[player].score ? players[player].score : 0;
      jogador.textContent = player + ": " + scorePlayer + " pontos";
      lista.appendChild(jogador);
    }
    indexPlayer = indexPlayer === Object.keys(players).length ? indexPlayer : indexPlayer+1;
    document.getElementById("quem-joga").innerHTML = "Jogador: " + Object.keys(players)[indexPlayer];
}

function obterNumeroDeLetrasUnicas(palavra) {
    const letras = palavra.split(''); // Converte a palavra para uma matriz de caracteres
    const letrasUnicas = {}; // Objeto para armazenar as letras únicas
  
    // Percorre a matriz de caracteres e adiciona cada letra única ao objeto
    letras.forEach(letra => {
      letrasUnicas[letra] = true;
    });
  
    // Retorna o número de letras únicas
    return Object.keys(letrasUnicas).length;
}

function setPalavra() {
    var palavra = document.getElementById("novaPalavra").value;
    var dica = document.getElementById("novaDica").value;
    var qtnLetras = obterNumeroDeLetrasUnicas(palavra);
    var palavraObj = { palavra: palavra.toUpperCase(), dica: dica, qtnLetras: qtnLetras };
    palavras.push(palavraObj);
    console.log(palavraObj);
    reiniciarJogo(palavraObj)
}

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
function atualizarPalavra(letras) {
    var palavraExibicao = "";
    for (var i = 0; i < palavraEscolhida.length; i++) {
        if (letras.indexOf(palavraEscolhida[i]) !== -1) {
            palavraExibicao += palavraEscolhida[i] + " ";
        } else {
            palavraExibicao += "_ ";
        }
    }
    document.getElementById("palavra").innerHTML = palavraExibicao
    return palavraExibicao.replace(/\s+/g, '').trim();
}

// Defina uma função para verificar se a palavra foi adivinhada
function verificarAdivinhacao() {
    var letra = document.getElementById("letra").value.toUpperCase();
    document.getElementById("letra").value = "";
    const quemJoga =Object.keys(players)[indexPlayer];
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
function reiniciarJogo(palavraPersonalizada = null) {
    gerarListaJogadores();
    // Escolha uma nova palavra aleatória da lista e exiba sua dica na tela HTML
    if (palavraPersonalizada) {
        palavraEscolhida = palavraPersonalizada.palavra;
        dicaPalavraEscolhida = palavraPersonalizada.dica;
    } else {
        indicePalavraEscolhida = Math.floor(Math.random() * palavras.length);
        palavraEscolhida = palavras[indicePalavraEscolhida].palavra;
        dicaPalavraEscolhida = palavras[indicePalavraEscolhida].dica;
    }
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

function updateJogadores() {
    const jogador = document.getElementById('jogador').value;
    // Faz as alterações desejadas no objeto JavaScript
    if (players[jogador]) {
        document.getElementById("erro").innerHTML = "Jogador Já existe";
    } else if (Object.keys(players).length >= 5) {
        document.getElementById("erro").innerHTML = "Limite de jogadores atingido";
    }
    players[jogador] = { score: 0 };
    gerarListaJogadores();
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
