document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('player-vs-player').addEventListener('click', () => {
        window.location.href = 'game.html';
    });

    document.getElementById('player-vs-ai').addEventListener('click', () => {
        window.location.href = 'ai_game.html';
    });
});