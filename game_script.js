document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message-text');
    const restartButton = document.getElementById('restart-button');
    const winMessage = document.getElementById('win-message');
    const winText = document.getElementById('win-text');
    const closeModal = document.querySelector('.close');

    let currentPlayer = '🍌';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function checkWin() {
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
                return gameBoard[a];
            }
        }
        return null;
    }

    function checkDraw() {
        return !gameBoard.includes('');
    }

    function showWinMessage(winner) {
        winText.textContent = winner ? `Победитель: ${winner}` : 'Ничья!';
        winMessage.style.display = "block";
    }

    function hideWinMessage() {
        winMessage.style.display = "none";
    }

    function handleCellClick(event) {
        const cell = event.target;
        const index = parseInt(cell.dataset.index);

        if (gameBoard[index] === '' && gameActive) {
            gameBoard[index] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer === '🍌' ? 'banana' : 'strawberry');

            const winner = checkWin();
            if (winner) {
                gameActive = false;
                showWinMessage(winner);
                return;
            }

            if (checkDraw()) {
                gameActive = false;
                showWinMessage(null); // null indicates a draw
                return;
            }

            currentPlayer = currentPlayer === '🍌' ? '🍓' : '🍌';
            message.textContent = `Ход: ${currentPlayer} (${currentPlayer === '🍌' ? 'Банан' : 'Клубника'})`;
        }
    }

    function restartGame() {
        hideWinMessage();
        currentPlayer = '🍌';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        message.textContent = `Ход: 🍌 (Банан)`;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('banana', 'strawberry');
        });
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);

    closeModal.addEventListener('click', hideWinMessage);

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target == winMessage) {
            hideWinMessage();
        }
    });

    restartGame();
});