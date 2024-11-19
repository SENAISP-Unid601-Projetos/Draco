let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let img = new Image();
img.src = './IMG/SLA.png';
img.onload = function() {
    init();
};

var imgGameOver = new Image();
imgGameOver.src = './IMG/gameover1.png'; // Certifique-se de que a imagem "game_over.png" está disponível

var imgportal = new Image();
imgportal.src = './IMG/portal.png';

var imgColetavel = new Image();
imgColetavel.src = './IMG/moeda.png'; // Certifique-se de que a imagem do coletável está disponível

const somColetavel = new Audio('./toque/coletavel.mp3');
somColetavel.volume = 0.2;

// Ajuste as dimensões dos frames conforme necessário
let frameX = 0; // Posição atual do frame no spritesheet
let frameY = 0; // 0 para parado, 1 para direita, 2 para esquerda, 3 para pulo
let frameCount = 6; // Número total de frames por direção
let spriteWidth = 90; // Largura de cada frame
let spriteHeight = 90; // Altura de cada frame
let currentX = 25; // Posição atual do sprite no canvas
let currentY = 150; // Posição atual do sprite no canvas
let speed = 3; // Velocidade de movimento
let jumpSpeed = 16; // Velocidade do pulo
let gravity = 0.4; // Gravidade
let velocityY = 0; // Velocidade vertical
let isJumping = false; // Flag para indicar se o personagem está pulando
let movingRight = false; // Direção do movimento
let movingLeft = false; // Direção do movimento
let vida = 150;

let frameInterval = 10; // Atualize o frame a cada 10 frames
let frameCounter = 0; // Contador de frames

// Propriedades do portal
let portalX = 1350; // Nova posição X do portal
let portalY = 440; // Nova posição Y do portal
let portalWidth = 100; // Nova largura do portal
let portalHeight = 200; // Nova altura do portal

// Propriedades das plataformas
let platformX = 400; // Posição X da plataforma
let platformY = 460; // Posição Y da plataforma
let platformWidth = 190; // Largura da plataforma
let platformHeight = 20; // Altura da plataforma

// Propriedades da segunda plataforma
let platform2X = 670; // Posição X da nova plataforma
let platform2Y = 303; // Posição Y da nova plataforma
let platform2Width = 360; // Largura da nova plataforma
let platform2Height = 20; // Altura da nova plataforma

// Propriedades da terceira plataforma
let platform3X = 1150; // Posição X da terceira plataforma
let platform3Y = 450; // Posição Y da terceira plataforma
let platform3Width = 90; // Largura da terceira plataforma
let platform3Height = 20;

// Propriedades da quarta plataforma
let platform4X = 1150; // Posição X da quarta plataforma
let platform4Y = 650; // Posição Y da quarta plataforma
let platform4Width = 400; // Largura da quarta plataforma
let platform4Height = 20; // Altura da quarta plataforma

// Propriedades da quinta plataforma
let platform5X = 25; // Posição X da quinta plataforma
let platform5Y = 630; // Posição Y da quinta plataforma
let platform5Width = 340; // Largura da quinta plataforma
let platform5Height = 20; // Altura da quinta plataforma

let framenx = 1;
let frameny = 0;
let enemyX = 900; // Posição X do inimigo
let enemyY = 250; // Posição Y do inimigo
let enemyWidth = 100; // Largura do inimigo
let enemyHeight = 190; // Altura do inimigo
let enemySpeed = 1.5; // Velocidade do inimigo
let movingEnemyRight = true; // Direção do movimento do inimigo
var coluna = 5;

let collectibleX = 300; // Posição X do quadrado coletável
let collectibleY = 150; // Posição Y do quadrado coletável
let collectibleSize = 30; // Tamanho do quadrado coletável
let collected = false; // Flag para verificar se o quadrado foi coletado

var imginimigo = new Image();
imginimigo.src = './IMG/SLIME.png'; // Certifique-se de que a imagem do inimigo está disponível

let gameOver = false;


function drawCollectible() {
    if (!collected) { // Verifica se o quadrado ainda não foi coletado
        const scaledSize = collectibleSize; // Tamanho do coletável
        ctx.drawImage(imgColetavel, collectibleX, collectibleY, scaledSize, scaledSize); // Desenha a imagem do coletável
    }
}

function restartGame() {
    gameOver = false; // Reseta o estado do jogo
    vida = 150; // Reseta a vida
    currentX = 25; // Reseta a posição X do jogador
    currentY = 150; // Reseta a posição Y do jogador
    velocityY = 0; // Reseta a velocidade vertical
    isJumping = false; // Reseta o estado de pulo
    movingRight = false; // Reseta a direção do movimento
    movingLeft = false; // Reseta a direção do movimento
    enemyX = 900; // Reseta a posição do inimigo
    enemyY = 250; // Reseta a posição Y do inimigo
    coluna = 5; // Reseta a coluna do inimigo
    collected = false; // Reseta a coleta da moeda
    const position = getRandomPosition();
    collectibleX = position.x;
    collectibleY = position.y;

    document.getElementById('restartButton').style.display = 'none'; // Esconde o botão de reiniciar
    animate(); // Reinicia a animação
}
function drawGameOver() {
    const scaleFactor = 3; // Fator de escala para aumentar a imagem
    const scaledWidth = imgGameOver.width * scaleFactor; // Largura escalada
    const scaledHeight = imgGameOver.height * scaleFactor; // Altura escalada
    ctx.drawImage(imgGameOver, 
                  canvas.width / 2 - scaledWidth / 2, 
                  canvas.height / 2 - scaledHeight / 2, 
                  scaledWidth, 
                  scaledHeight); // Desenha a imagem com a nova escala
    document.getElementById('restartButton').style.display = 'block'; // Mostra o botão de reiniciar
}
document.getElementById('restartButton').addEventListener('click', restartGame); // Adiciona evento de clique ao botão


function drawEnemy() {
    const columnIndex = Math.floor(coluna); // Índice da coluna atual
    const cutWidth = 2226/6 ; // Largura de cada coluna no spritesheet
    const cutHeight = 274; // Altura da imagem do inimigo

    // Ajuste os fatores de escala para diminuir o tamanho da imagem
    const scaleFactor = 0.2; // Fator de escala para diminuir o tamanho
    const scaledWidth = cutWidth * scaleFactor; // Nova largura na tela
    const scaledHeight = cutHeight * scaleFactor; // Nova altura na tela

    ctx.drawImage(imginimigo, 
                  columnIndex * cutWidth, 0, cutWidth, cutHeight, // Corte da imagem
                  enemyX, enemyY, scaledWidth, scaledHeight); // Posição e tamanho na tela

    // Atualiza a coluna para o próximo frame
    coluna = (coluna + 0.2) %6; // Cicla pelas colunas
}


function drawHealthBar() {
    // Desenhar fundo da barra de vida
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 300, 20); // Posição (10, 10), largura 200, altura 20

    // Desenhar a parte da vida
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, (vida / 100) * 200, 20); // A largura da parte verde depende da vida restante
}


// Limite de altura para Game Over
const gameOverHeight = 900; // Altura em que o jogo termina

let platforms = [
    { x: platformX, y: platformY, width: platformWidth, height: platformHeight },
    { x: platform2X, y: platform2Y, width: platform2Width, height: platform2Height },
    { x: platform3X, y: platform3Y, width: platform3Width, height: platform3Height },
    { x: platform4X, y: platform4Y, width: platform4Width, height: platform4Height },
    { x: platform5X, y: platform5Y, width: platform5Width, height: platform5Height },
];

function getRandomPosition() {
    // Escolhe uma plataforma aleatória
    const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

    // Gera uma posição aleatória em cima da plataforma
    const randomX = randomPlatform.x + Math.random() * (randomPlatform.width - collectibleSize);
    const randomY = randomPlatform.y - collectibleSize; // Coloca a moeda acima da plataforma

    return { x: randomX, y: randomY };
}

function init() {
    const position = getRandomPosition();
    collectibleX = position.x;
    collectibleY = position.y;

    animate();
}

function drawFrame(frameX, frameY, canvasX, canvasY, scaledWidth, scaledHeight) {
    ctx.drawImage(img,
        frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

function drawPortal() {
    ctx.drawImage(imgportal, portalX, portalY, portalWidth, portalHeight); // Desenha a imagem do portal
}

function drawPlatform() {
    ctx.fillStyle = 'rgba(0,0, 0, 0)'
    ctx.fillRect(platformX, platformY, platformWidth, platformHeight); // Desenha a plataforma
}

function drawPlatform2() {
    ctx.fillRect(platform2X, platform2Y, platform2Width, platform2Height); // Desenha a segunda plataforma
}

function drawPlatform3() {
    ctx.fillRect(platform3X, platform3Y, platform3Width, platform3Height); // Desenha a terceira plataforma
}

function drawPlatform4() {
    ctx.fillRect(platform4X, platform4Y, platform4Width, platform4Height); // Desenha a quarta plataforma
}

function drawPlatform5() {
    ctx.fillRect(platform5X, platform5Y, platform5Width, platform5Height); // Desenha a quinta plataforma
}


const minEnemyX = 50; // Limite mínimo para o inimigo
const maxEnemyX = 500; // Limite máximo para o inimigo

function updateCollectible() {
    if (!collected) { // Verifica se o quadrado ainda não foi coletado
        // Verifica colisão com o jogador
        if (currentX < collectibleX + collectibleSize &&
            currentX + spriteWidth > collectibleX &&
            currentY < collectibleY + collectibleSize &&
            currentY + spriteHeight > collectibleY) {
            collected = true; // Marca o quadrado como coletado
            console.log("Coletável pego!"); // Log para verificar se a coleta foi registrada
            somColetavel.play(); // Toca o som do coletável
            vida += 0; // Opcional: aumenta a vida do jogador ao coletar
        }
    }
}

function drawPortal() {
    // Verifica se o coletável foi coletado
    if (collected) {
        ctx.drawImage(imgportal, portalX, portalY, portalWidth, portalHeight); // Desenha a imagem do portal
    }
}


function updateEnemy() {
    if (gameOver) return;

    // Verifica se o jogador está acima de y = 400
    if (currentY > 200) {
        // Calcular a distância entre o segundo inimigo e o jogador
        let distanceX = currentX - enemyX;

        // Define um limite de distância para a perseguição
        const chaseDistance = 200; // Ajuste este valor conforme necessário

        // Move o segundo inimigo em direção ao jogador se estiver dentro da distância de perseguição
        if (Math.abs(distanceX) < chaseDistance) {
            if (distanceX > 0) {
                enemyX += enemySpeed; // Move o inimigo para a direita
            } else {
                enemyX -= enemySpeed; // Move o inimigo para a esquerda
            }
        }

        // Adiciona um buffer para a colisão
        const collisionBuffer = 10; // Ajuste este valor conforme necessário

        // Verifica colisão com o jogador
if (currentX + collisionBuffer < enemyX + enemyWidth &&
    currentX + spriteWidth - collisionBuffer > enemyX &&
    currentY + collisionBuffer < enemyY + enemyHeight &&
    currentY + spriteHeight - collisionBuffer > enemyY) {
    console.log("Colisão detectada!");
    vida -= 0.5; // Reduz a vida em 0.5 ao colidir com o segundo inimigo
    console.log("Vida atual: " + vida); // Log da vida atual

    if (vida <= 0) {
        vida = 0; // Se a vida chegar a 0, o jogo termina
        gameOver = true; // Define o estado do jogo como Game Over
        drawGameOver(); // Se a vida chegar a 0, mostra a tela de Game Over
    }
}
    }
    
}
  //ctx.fillStyle = 'rgba(255,0,0,0.5)';
 // ctx.fillRect(enemyX,enemyY, canvas.width - enemyWidth* 14, canvas.height - enemyHeight *3.5)


function animate() {
    if (gameOver){

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    drawGameOver();
    return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualiza a posição do sprite se estiver se movendo
    if (movingRight) {
        currentX += speed;
    }
    if (movingLeft) {
        currentX -= speed;
    }

    // Atualiza a posição vertical do sprite
    if (isJumping) {
        velocityY += gravity; // Aplica gravidade
    } else {
        velocityY += gravity; // Aplica gravidade quando não está pulando
    }

    currentY += velocityY // Atualiza a posição vertical

    // Verifica colisão com plataformas
    if (currentY + spriteHeight > platformY && currentY + spriteHeight < platformY + platformHeight &&
        currentX + spriteWidth > platformX && currentX < platformX + platformWidth) {
        currentY = platformY - spriteHeight; // Coloca o sprite em cima da plataforma
        isJumping = false; // O personagem não está mais pulando
        velocityY = 0; // Reseta a velocidade vertical
    } else if (currentY + spriteHeight > platform2Y && currentY + spriteHeight < platform2Y + platform2Height &&
        currentX + spriteWidth > platform2X && currentX < platform2X + platform2Width) {
        currentY = platform2Y - spriteHeight; // Coloca o sprite em cima da segunda plataforma
        isJumping = false; // O personagem não está mais pulando
        velocityY = 0; // Reseta a velocidade vertical
    } else if (currentY + spriteHeight > platform3Y && currentY + spriteHeight < platform3Y + platform3Height &&
        currentX + spriteWidth > platform3X && currentX < platform3X + platform3Width) {
        currentY = platform3Y - spriteHeight; // Coloca o sprite em cima da terceira plataforma
        isJumping = false; // O personagem não está mais pulando
        velocityY = 0; // Reseta a velocidade vertical
    } else if (currentY + spriteHeight > platform4Y && currentY + spriteHeight < platform4Y + platform4Height &&
        currentX + spriteWidth > platform4X && currentX < platform4X + platform4Width) {
        currentY = platform4Y - spriteHeight; // Coloca o sprite em cima da quarta plataforma
        isJumping = false; // O personagem não está mais pulando
        velocityY = 0; // Reseta a velocidade vertical
    } else if (currentY + spriteHeight > platform5Y && currentY + spriteHeight < platform5Y + platform5Height &&
        currentX + spriteWidth > platform5X && currentX < platform5X + platform5Width) {
        currentY = platform5Y - spriteHeight; // Coloca o sprite em cima da quinta plataforma
        isJumping = false; // O personagem não está mais pulando
        velocityY = 0; // Reseta a velocidade vertical
    }

    // Verifica se o personagem caiu abaixo da altura de Game Over
    if (currentY > gameOverHeight) {
        drawGameOver();
        gameOver = true; // Define o estado do jogo como Game Over
        document.getElementById('restartButton').style.display = 'block'; // Mostra o botão de reiniciar
        return; // Para o jogo
    }
    // Atualiza o frame
    if (isJumping) {
        frameY = 3.5; // Linha para pulo
        frameX = 0;
    } else if (movingRight || movingLeft) {
        frameCounter++;
        if (frameCounter >= frameInterval) {
            frameX = (frameX + 1) % frameCount; // Cicla pelos frames se estiver se movendo
            frameCounter = 0; // Reseta o contador
        }
        frameY = movingRight ? 1 : 2; // Linha para a direção em que está se movendo
    } else {
        frameX = 0; // Se não estiver se movendo, usa o primeiro frame
        frameY = 0; // Linha para o estado parado
    }

    // Desenha o sprite
    drawFrame(frameX, frameY, currentX, currentY, spriteWidth, spriteHeight);

    // Desenha as plataformas e o portal
    drawPlatform();
    drawPlatform2();
    drawPlatform3();
    drawPlatform4();
    drawPlatform5();
    drawPortal();
    drawEnemy();
    updateCollectible();
    drawCollectible()
    updateEnemy();
    drawHealthBar();

    // Verifica colisão com o portal
    if (collected && // Verifica se o coletável foi coletado
        currentX < portalX + portalWidth &&
        currentX + spriteWidth > portalX &&
        currentY < portalY + portalHeight &&
        currentY + spriteHeight > portalY) {
        window.location.href = 'video2.html'; // Redireciona para a próxima fase
    }

    // Atualiza o loop de animação
    requestAnimationFrame(animate);
}

document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowRight':
            movingRight = true;
            break;
        case 'ArrowLeft':
            movingLeft = true;
            break;
        case 'ArrowUp':
            if (!isJumping) {
                isJumping = true;
                velocityY = -jumpSpeed; // Inicia o pulo
            }
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch (event.key) {
        case 'ArrowRight':
            movingRight = false;
            break;
        case 'ArrowLeft':
            movingLeft = false;
            break;
    }
});