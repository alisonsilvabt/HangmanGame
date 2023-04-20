function styleString(str) {
    str = str.toLowerCase();
    const arrayStr = str.split('');
    arrayStr[0] = arrayStr[0].toUpperCase();
    return arrayStr.join('');
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

function criarArvore(palavra) {
    let letras = palavra.split("");
    let raiz = { letra: letras[0], esquerda: null, direita: null, altura: 1 };
    for (let i = 1; i < letras.length; i++) {
        raiz = inserirNo(raiz, letras[i]);
    }
    return raiz;
}

function inserirNo(no, letra) {
    if (no === null) {
        return { letra: letra, esquerda: null, direita: null, altura: 1 };
    }
    if (letra < no.letra) {
        no.esquerda = inserirNo(no.esquerda, letra);
    } else {
        no.direita = inserirNo(no.direita, letra);
    }
    no.altura = 1 + Math.max(getAltura(no.esquerda), getAltura(no.direita));
    let fatorBalanceamento = getFatorBalanceamento(no);
    if (fatorBalanceamento > 1) {
        if (getFatorBalanceamento(no.esquerda) < 0) {
            no.esquerda = rotacaoEsquerda(no.esquerda);
        }
        no = rotacaoDireita(no);
    } else if (fatorBalanceamento < -1) {
        if (getFatorBalanceamento(no.direita) > 0) {
            no.direita = rotacaoDireita(no.direita);
        }
        no = rotacaoEsquerda(no);
    }
    return no;
}

// função auxiliar para obter a altura de um nó
function getAltura(no) {
    if (no === null) {
        return 0;
    }
    return no.altura;
}

// função auxiliar para obter o fator de balanceamento de um nó
function getFatorBalanceamento(no) {
    if (no === null) {
        return 0;
    }
    return getAltura(no.esquerda) - getAltura(no.direita);
}

// função auxiliar para rotacionar um nó para a direita
function rotacaoDireita(no) {
    if (no === null || no.esquerda === null) {
        return no;
    }
    let novoNo = no.esquerda;
    no.esquerda = novoNo.direita;
    novoNo.direita = no;
    no.altura = 1 + Math.max(getAltura(no.esquerda), getAltura(no.direita));
    novoNo.altura = 1 + Math.max(getAltura(novoNo.esquerda), getAltura(novoNo.direita));
    // atualizar altura dos nós afetados
    if (no.esquerda !== null) {
        no.esquerda.altura = 1 + Math.max(getAltura(no.esquerda.esquerda), getAltura(no.esquerda.direita));
    }
    novoNo.altura = 1 + Math.max(getAltura(novoNo.esquerda), getAltura(novoNo.direita));
    return novoNo;
}


// função auxiliar para rotacionar um nó para a esquerda
function rotacaoEsquerda(no) {
    if (no === null || no.direita === null) {
        return no;
    }
    let novoNo = no.direita;
    no.direita = novoNo.esquerda;
    novoNo.esquerda = no;
    no.altura = 1 + Math.max(getAltura(no.esquerda), getAltura(no.direita));
    novoNo.altura = 1 + Math.max(getAltura(novoNo.esquerda), getAltura(novoNo.direita));
    // atualizar altura dos nós afetados
    if (no.direita !== null) {
        no.direita.altura = 1 + Math.max(getAltura(no.direita.esquerda), getAltura(no.direita.direita));
    }
    novoNo.altura = 1 + Math.max(getAltura(novoNo.esquerda), getAltura(novoNo.direita));
    return novoNo;
}


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

/*
// Defina uma função para criar uma árvore binária a partir da palavra escolhida
function criarArvore(palavra) {
    let letras = palavra.split("");
    let raiz = { letra: letras[0], esquerda: null, direita: null };
    let atual = raiz;
    for (let i = 1; i < letras.length; i++) {
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
}*/
