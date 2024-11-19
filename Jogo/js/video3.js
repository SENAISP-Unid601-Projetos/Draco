const video = document.getElementById('meuVideo');

// Função para entrar em tela cheia
function enterFullScreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) { // Firefox
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) { // Chrome, Safari e Opera
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { // IE/Edge
        video.msRequestFullscreen();
    }
}

// Inicia o vídeo automaticamente ao carregar a página
window.onload = function() {
    video.play(); // Inicia o vídeo automaticamente
    video.addEventListener('playing', function() {
        enterFullScreen(); // Entra em tela cheia quando o vídeo começa a tocar
    });
};

// Adiciona um evento que escuta quando o vídeo termina
video.addEventListener('ended', function() {
    // Redireciona para fase1.html
    window.location.href = 'fase3.html'; // Coloque o caminho correto para a nova página
});