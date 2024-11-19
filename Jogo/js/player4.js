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
let portalX = 980; // Nova posição X do portal
let portalY = 490; // Nova posição Y do portal
let portalWidth = 100; // Nova largura do portal
let portalHeight = 150; // Nova altura do portal


// Propriedades da quinta plataforma
let platform5X = 25; // Posição X da quinta plataforma
let platform5Y = 630; // Posição Y da quinta plataforma
let platform5Width = 1140; // Largura da quinta plataforma
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

let gameOver = false;


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
    ctx.fillStyle = 'rgba(0,0, 0, 0)'
    ctx.fillRect(platform5X, platform5Y, platform5Width, platform5Height); // Desenha a quinta plataforma
}


function drawPortal() {
    // Verifica se o coletável foi coletado
        ctx.drawImage(imgportal, portalX, portalY, portalWidth, portalHeight); // Desenha a imagem do portal
    }


    let speaking = false; // Flag para indicar se o personagem está falando

    function speak() {
        speaking = true; // Ativa o estado de fala
        setTimeout(() => {
            speaking = false; // Desativa o estado de fala após 2 segundos
        }, 4000); // Duração da fala em milissegundos
    }
    
    function drawSpeechBubble() {
        if (speaking) {
            ctx.fillStyle = 'white'; // Cor do balão
            ctx.beginPath(); // Inicia um novo caminho
    
            // Desenha a parte do balão
            ctx.moveTo(currentX + 10, currentY - 40); // Move para o ponto inicial
            ctx.lineTo(currentX + 150, currentY - 40); // Linha superior
            ctx.quadraticCurveTo(currentX + 160, currentY - 40, currentX + 160, currentY - 30); // Canto superior direito
            ctx.lineTo(currentX + 160, currentY); // Linha direita
            ctx.lineTo(currentX + 10, currentY); // Linha inferior
            ctx.lineTo(currentX + 10, currentY - 30); // Linha esquerda
            ctx.quadraticCurveTo(currentX, currentY - 40, currentX + 10, currentY - 40); // Canto inferior esquerdo
    
            ctx.closePath(); // Fecha o caminho
            ctx.fill(); // Preenche a forma
    
            // Desenha o texto
            ctx.fillStyle = 'black'; // Cor do texto
            ctx.fillText("finalmente em casa", currentX + 15, currentY - 20); // Texto da fala
        }
    }
    
    function animate() {
        if (gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
            drawGameOver();
            return;
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // Desenha a bolha de fala
        drawSpeechBubble();
    
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
  if (currentY + spriteHeight > platform5Y && currentY + spriteHeight < platform5Y + platform5Height &&
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
    drawPlatform5();
    drawPortal();
    drawHealthBar();

    // Verifica colisão com o portal
    if ( 
        currentX < portalX + portalWidth &&
        currentX + spriteWidth > portalX &&
        currentY < portalY + portalHeight &&
        currentY + spriteHeight > portalY) {
        window.location.href = 'video4.html'; // Redireciona para a próxima fase
    }

    // Atualiza o loop de animação
    requestAnimationFrame(animate);
}

document.addEventListener('keydown', function(event) {
    if (speaking) return; // Se o personagem está falando, não permite movimento

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
function init() {
    speak(); // Faz o personagem falar ao iniciar o jogo
    animate();
}