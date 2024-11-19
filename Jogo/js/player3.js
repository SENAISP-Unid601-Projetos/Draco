let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let img = new Image();
img.src = './IMG/SLA.png';
img.onload = function() {
    init();
};

var imgGameOver = new Image();
imgGameOver.src = './IMG/gameover3.png'; // Certifique-se de que a imagem "game_over.png" está disponível

var imgportal = new Image();
imgportal.src = './IMG/portal.png';

var imgCollectible = new Image();
imgCollectible.src = './IMG/maça.png'; // Certifique-se de que a imagem do coletável está disponível

const somColetavel = new Audio('./toque/maça.mp3');
somColetavel.volume = 1;

// Ajuste as dimensões dos frames conforme necessário
let frameX = 0; // Posição atual do frame no spritesheet
let frameY = 0; // 0 para parado, 1 para direita, 2 para esquerda, 3 para pulo
let frameCount = 6; // Número total de frames por direção
let spriteWidth = 90; // Largura de cada frame
let spriteHeight = 90; // Altura de cada frame
let currentX = 25; // Posição atual do sprite no canvas
let currentY = 150; // Posição atual do sprite no canvas
let speed = 2; // Velocidade de movimento
let jumpSpeed = 16; // Velocidade do pulo
let gravity = 0.4; // Gravidade
let velocityY = 0; // Velocidade vertical
let isJumping = false; // Flag para indicar se o personagem está pulando
let movingRight = false; // Direção do movimento
let movingLeft = false; // Direção do movimento
let vida = 100;

let frameInterval = 10; // Atualize o frame a cada 10 frames
let frameCounter = 0; // Contador de frames

// Propriedades do portal
let portalX = 1350; // Nova posição X do portal
let portalY = 340; // Nova posição Y do portal
let portalWidth = 100; // Nova largura do portal
let portalHeight = 200;

// Propriedades das plataformas
let platformX = 580; // Posição X da plataforma
let platformY = 360; // Posição Y da plataforma
let platformWidth = 300; // Largura da plataforma
let platformHeight = 20; // Altura da plataforma

// Propriedades da segunda plataforma
let platform2X = 1050; // Posição X da nova plataforma
let platform2Y = 503; // Posição Y da nova plataforma
let platform2Width = 860; // Largura da nova plataforma
let platform2Height = 20; // Altura da nova plataforma

// Propriedades da terceira plataforma
let platform3X = 1150; // Posição X da terceira plataforma
let platform3Y = 3450; // Posição Y da terceira plataforma
let platform3Width = 90; // Largura da terceira plataforma
let platform3Height = 20;

// Propriedades da quarta plataforma
let platform4X = 1150; // Posição X da quarta plataforma
let platform4Y = 3650; // Posição Y da quarta plataforma
let platform4Width = 400; // Largura da quarta plataforma
let platform4Height = 20; // Altura da quarta plataforma

// Propriedades da quinta plataforma
let platform5X = 110; // Posição X da quinta plataforma
let platform5Y = 500; // Posição Y da quinta plataforma
let platform5Width = 400; // Largura da quinta plataforma
let platform5Height = 20; // Altura da quinta plataforma

let framenx = 0;
let frameny = 1;
let enemyX = 400; // Posição X do inimigo
let enemyY = 230; // Posição Y do inimigo
let enemyWidth = 200; // Largura do inimigo
let enemyHeight = 190; // Altura do inimigo
let enemySpeed = 2; // Velocidade do inimigo
let movingEnemyRight = true; // Direção do movimento do inimigo
var coluna = 5;

let enemy2X = 300; // Posição X do segundo inimigo
let enemy2Y = 470; // Posição Y do segundo inimigo
let enemy2Width = 100; // Largura do segundo inimigo
let enemy2Height = 100; // Altura do segundo inimigo
let enemy2Speed = 2; // Velocidade do segundo inimigo
let movingEnemy2Right = true; // Direção do movimento do segundo inimigo

let enemy3X = 1100; // Posição X do terceiro inimigo
let enemy3Y = 470; // Posição Y do terceiro inimigo
let enemy3Width = 100; // Largura do terceiro inimigo
let enemy3Height = 100; // Altura do terceiro inimigo
let enemy3Speed = 2; // Velocidade do terceiro inimigo
let movingEnemy3Right = true; // Direção do movimento do terceiro inimigo

let collectibleX = 1000; // Posição X do coletável
let collectibleY = 150; // Posição Y do coletável
let collectibleSize = 30; // Tamanho do coletável
let collected = false; // Flag para verificar se o coletável foi coletado

var imginimigo3 = new Image();
imginimigo3.src = './IMG/SLIME.png'; // Certifique-se de que a imagem do terceiro inimigo está disponível

var imginimigo2 = new Image();
imginimigo2.src ='./IMG/SLIME.png';

var imginimigo = new Image();
imginimigo.src = './IMG/Pedra.png'; // Certifique-se de que a imagem do inimigo está disponível

let gameOver = false;

function drawCollectible() {
    if (!collected) { // Verifica se o coletável ainda não foi coletado
        ctx.drawImage(imgCollectible, collectibleX, collectibleY, collectibleSize, collectibleSize); // Desenha a imagem do coletável
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
    enemyX = 400; // Reseta a posição do inimigo
    enemyY = 230; // Reseta a posição Y do inimigo
    enemy2X = 400;
    enemy2Y = 470;
    enemy3X = 1100;
    enemy3Y = 470;
    coluna = 5; // Reseta a coluna do inimigo
    collected = false;
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
    ctx.drawImage(imginimigo, 9497 / 6 * Math.floor(coluna), 0, 1496, 1496, enemyX , enemyY, enemyWidth * 0.8, enemyHeight * 0.8); // Desenha o inimigo
    if (coluna > 0) {
        coluna -= 0.2;
    } else if (coluna <= 0) {
        coluna = 5;
    }
}

function drawEnemy2() {
    const columnIndex = Math.floor(coluna); // Índice da coluna atual
    const cutWidth = 2227 / 6; // Largura de cada coluna no spritesheet
    const cutHeight = 274; // Altura da imagem do inimigo

    // Ajuste os fatores de escala para diminuir o tamanho da imagem
    const scaleFactor = 0.2; // Fator de escala para diminuir o tamanho
    const scaledWidth = cutWidth * scaleFactor; // Nova largura na tela
    const scaledHeight = cutHeight * scaleFactor; // Nova altura na tela

    ctx.drawImage(imginimigo2, 
                  columnIndex * cutWidth, 0, cutWidth, cutHeight, // Corte da imagem
                  enemy2X, enemy2Y, scaledWidth, scaledHeight); // Posição e tamanho na tela

    // Atualiza a coluna para o próximo frame
    
     // Cicla pelas colunas
}
function drawEnemy3() {
    const columnIndex = Math.floor(coluna); // Índice da coluna atual
    const cutWidth = 2227 / 6; // Largura de cada coluna no spritesheet
    const cutHeight = 274; // Altura da imagem do inimigo

    // Ajuste os fatores de escala para diminuir o tamanho da imagem
    const scaleFactor = 0.2; // Fator de escala para diminuir o tamanho
    const scaledWidth = cutWidth * scaleFactor; // Nova largura na tela
    const scaledHeight = cutHeight * scaleFactor; // Nova altura na tela

    ctx.drawImage(imginimigo3, 
                  columnIndex * cutWidth, 0, cutWidth, cutHeight, // Corte da imagem
                  enemy3X, enemy3Y, scaledWidth, scaledHeight); // Posição e tamanho na tela

    // Atualiza a coluna para o próximo frame
    
     // Cicla pelas colunas
}

function drawHealthBar() {
    // Desenhar fundo da barra de vida
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 200, 20); // Posição (10, 10), largura 200, altura 20

    // Desenhar a parte da vida
    ctx.fillStyle = 'green';
    ctx.fillRect(10, 10, (vida / 100) * 200, 20); // A largura da parte verde depende da vida restante
}



let recoveryAmount = 20; // Quantidade de vida a ser recuperada ao coletar o item

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
            vida += 20; // Opcional: aumenta a vida do jogador ao coletar
        }
    }
}

function updateEnemy() {
    
    // Calcular a distância entre o inimigo e o jogador
    let distanceX = currentX - enemyX;

    // Determinar a direção do movimento do inimigo
    if (Math.abs(distanceX) > enemySpeed) { // Se a distância for maior que a velocidade do inimigo
        if (distanceX > 0) {
            enemyX += enemySpeed; // Move o inimigo para a direita
        } else {
            enemyX -= enemySpeed; // Move o inimigo para a esquerda
        }
    } else {
        // Se o inimigo estiver perto o suficiente, mova-o diretamente para o jogador
        enemyX = currentX; // Coloca o inimigo diretamente na posição X do jogador
    }

    // Verifica colisão com o jogador
    if (currentX < enemyX + enemyWidth &&
        currentX + spriteWidth > enemyX &&
        currentY < enemyY + enemyHeight &&
        currentY + spriteHeight > enemyY) {
        vida -= 20; // Reduz a vida em 20 ao colidir com o inimigo
    
        if (vida <= 0) {
            return; // Para o jogo
        }
    }
}

function updateEnemyPosition() {
    enemy2X += enemySpeed; // Atualiza a posição do inimigo com a nova velocidade
}

// Limite de altura para Game Over
const gameOverHeight = 900; // Altura em que o jogo termina

function init() {
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0)'
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

function updateEnemy() {
    if (gameOver) return;
    // Atualiza a posição do inimigo
    if (movingEnemyRight) {
        enemyX += enemySpeed;
        if (enemyX + enemyWidth > 1059) { // Se atingir a borda direita
            movingEnemyRight = false; // Muda direção
        }
    } else {
        enemyX -= enemySpeed;
        if (enemyX < 500) { // Se atingir a borda esquerda
            movingEnemyRight = true; // Muda direção
        }
    }

    // Verifica colisão com o jogador
    if (currentX < enemyX + enemyWidth &&
        currentX + spriteWidth > enemyX &&
        currentY < enemyY + enemyHeight &&
        currentY + spriteHeight > enemyY) {
        
        // Adiciona um buffer para a colisão
        const collisionBuffer = 75; // Ajuste este valor conforme necessário
        if (currentX + spriteWidth - collisionBuffer > enemyX &&
            currentX + collisionBuffer < enemyX + enemyWidth &&
            currentY + spriteHeight - collisionBuffer > enemyY &&
            currentY + collisionBuffer < enemyY + enemyHeight) {
            
            if (vida > 0) {
                vida -= 60; // Reduz a vida em 20 ao colidir com o inimigo
            }
            if (vida <= 0) {
                vida =  0; // Se a vida chegar a 0, o jogo termina
                gameOver = true;
                drawGameOver(); // Se a vida chegar a 0, mostra a tela de Game Over
                return; // Para o jogo
            }
        }
    }
    }


function updateEnemy2() {
    if (gameOver) return;

    // Verifica se o jogador está acima de y = 400
    if (currentY > 400) {
        // Calcular a distância entre o segundo inimigo e o jogador
        let distanceX = currentX - enemy2X;

        // Define um limite de distância para a perseguição
        const chaseDistance = 200; // Ajuste este valor conforme necessário

        // Move o segundo inimigo em direção ao jogador se estiver dentro da distância de perseguição
        if (Math.abs(distanceX) < chaseDistance) {
            if (distanceX > 0) {
                enemy2X += enemy2Speed; // Move o inimigo para a direita
            } else {
                enemy2X -= enemy2Speed; // Move o inimigo para a esquerda
            }
        }

        // Adiciona um buffer para a colisão
        const collisionBuffer2 = 10; // Ajuste este valor conforme necessário

        // Verifica colisão com o jogador
if (currentX + collisionBuffer2 < enemy2X + enemy2Width &&
    currentX + spriteWidth - collisionBuffer2 > enemy2X &&
    currentY + collisionBuffer2 < enemy2Y + enemy2Height &&
    currentY + spriteHeight - collisionBuffer2 > enemy2Y) {
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

function updateEnemy3() {
    // Verifica se o jogador está acima de y = 400
    if (currentY > 400) {
        // Calcular a distância entre o segundo inimigo e o jogador
        let distanceX = currentX - enemy3X;

        // Define um limite de distância para a perseguição
        const chaseDistance = 200; // Ajuste este valor conforme necessário

        // Move o segundo inimigo em direção ao jogador se estiver dentro da distância de perseguição
        if (Math.abs(distanceX) < chaseDistance) {
            if (distanceX > 0) {
                enemy3X += enemy3Speed; // Move o inimigo para a direita
            } else {
                enemy3X -= enemy3Speed; // Move o inimigo para a esquerda
            }
        }

        // Adiciona um buffer para a colisão
        const collisionBuffer = 29; // Ajuste este valor conforme necessário

        // Verifica colisão com o jogador
if (currentX + collisionBuffer < enemy3X + enemy3Width &&
    currentX + spriteWidth - collisionBuffer > enemy3X &&
    currentY + collisionBuffer < enemy3Y + enemy3Height &&
    currentY + spriteHeight - collisionBuffer > enemy3Y) {
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
    drawEnemy2();
    drawEnemy3();
    updateEnemy();
    updateEnemy2();
    updateEnemy3();
    drawHealthBar();
    updateCollectible();
    drawCollectible();

    // Verifica colisão com o portal
    if (currentX < portalX + portalWidth &&
        currentX + spriteWidth > portalX &&
        currentY < portalY + portalHeight &&
        currentY + spriteHeight > portalY) {
        window.location.href = 'fase4.html'; // Redireciona para a próxima fase
    }

    // Atualiza o loop de animação
    requestAnimationFrame(animate);
}
function gameLoop() {
    updateEnemyPosition(); // Chama a função para atualizar a posição
    drawEnemy2(); // Desenha o inimigo na nova posição
    requestAnimationFrame(gameLoop); // Continua o loop
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