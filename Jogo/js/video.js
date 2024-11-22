const video = document.getElementById('meuVideo');

// Função para entrar em tela cheia
function enterFullScreen() {
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.msRequestFullscreen) { //Edge
        video.msRequestFullscreen();
    }
}

// Inicia o vídeo automaticamente ao carregar a página
window.onload = function() {
    video.play().catch(function(error) {
        console.error("Erro ao tentar reproduzir o vídeo:", error);
    });
    video.addEventListener('playing', function() {
        enterFullScreen(); // Entra em tela cheia quando o vídeo começa a tocar
    });
};

// Adiciona um evento que escuta quando o vídeo termina
video.addEventListener('ended', function() {
    // Redireciona para fase1.html
    window.location.href = 'fase1.html'; // Coloque o caminho correto para a nova página
});