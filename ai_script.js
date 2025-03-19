document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message-text');
    const restartButton = document.getElementById('restart-button');
    const winMessage = document.getElementById('win-message');
    const winText = document.getElementById('win-text');
    const closeModal = document.querySelector('.close');
    const fruitChoiceModal = document.getElementById('fruit-choice');
    const chooseBananaButton = document.getElementById('choose-banana');
    const chooseStrawberryButton = document.getElementById('choose-strawberry');

    let playerFruit = null;
    let aiFruit = null;
    let currentPlayer = null;
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let movesCount = 0;
    let lastDisplayedLine = null;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const allLines = [
        "Как банально 😔",
        "Ты прилип как бананный лист 🍌",
        "Держи банан шире 💪",
        "Не сыпь мне соль на банану 😠",
        "Что-то ты сегодня не berry good 🍓"
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

    function displayRandomLine() {
        if (!gameActive) return;

        let randomLine;
        let availableLines = allLines.slice();

        if (lastDisplayedLine) {
            availableLines = availableLines.filter(line => line !== lastDisplayedLine);
        }

        if (availableLines.length === 0) {
            availableLines = allLines.slice();
        }

        randomLine = availableLines[Math.floor(Math.random() * availableLines.length)];

        const lineElement = document.createElement('div');
        lineElement.classList.add('floating-line');
        lineElement.textContent = randomLine;

        const boardRect = board.getBoundingClientRect();
        const randomLeft = boardRect.right + 10; // Только справа
        const randomTop = boardRect.top + Math.random() * boardRect.height - 20;

        lineElement.style.top = randomTop + 'px';
        lineElement.style.left = randomLeft + 'px';

        document.body.appendChild(lineElement);
        lastDisplayedLine = randomLine;

        setTimeout(() => {
            lineElement.remove();
        }, 3000);
    }

     function endGame(winner) {
        gameActive = false;
        showWinMessage(winner);
    }

    function handleCellClick(event) {
        if (!gameActive) return;

        const cell = event.target;
        const index = parseInt(cell.dataset.index);

        if (gameBoard[index] === '' && currentPlayer === playerFruit) {
            gameBoard[index] = playerFruit;
            cell.textContent = playerFruit;
            cell.classList.add(playerFruit === '🍌' ? 'banana' : 'strawberry');

            let winner = checkWin();
            if (winner) {
                endGame(winner);
                return;
            }

            if (checkDraw()) {
                endGame(null);
                return;
            }

            movesCount++;

            if (movesCount % 2 === 0) {
                displayRandomLine();
            }

            currentPlayer = aiFruit;
            setTimeout(aiMove, 500);
        }
    }

    function aiMove() {
        if (!gameActive) return;

        // 1. Check if AI can win
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = aiFruit;
                if (checkWin() === aiFruit) {
                    const cell = document.querySelector(`.cell[data-index="${i}"]`);
                    cell.textContent = aiFruit;
                    cell.classList.add(aiFruit === '🍌' ? 'banana' : 'strawberry');
                    endGame(aiFruit);
                     if (movesCount % 2 === 0) {
                        displayRandomLine();
                    }
                    return;
                }
                gameBoard[i] = '';
            }
        }

        // 2. Check if player can win and block
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                gameBoard[i] = playerFruit;
                if (checkWin() === playerFruit) {
                    gameBoard[i] = aiFruit;
                    const cell = document.querySelector(`.cell[data-index="${i}"]`);
                    cell.textContent = aiFruit;
                    cell.classList.add(aiFruit === '🍌' ? 'banana' : 'strawberry');
                      if (movesCount % 2 === 0) {
                        displayRandomLine();
                     }
                    currentPlayer = playerFruit;
                    return;
                }
                gameBoard[i] = '';
            }
        }

        // 3. Make a random move
        let availableMoves = [];
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                availableMoves.push(i);
            }
        }

        if (availableMoves.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableMoves.length);
            const aiMove = availableMoves[randomIndex];
            gameBoard[aiMove] = aiFruit;
            const cell = document.querySelector(`.cell[data-index="${aiMove}"]`);
            cell.textContent = aiFruit;
            cell.classList.add(aiFruit === '🍌' ? 'banana' : 'strawberry');

             let winner = checkWin();
             if (winner){
               endGame(winner);
               return;
             }
            if (checkDraw()) {
                endGame(null);
                return;
            }

            movesCount++;

            if (movesCount % 2 === 0) {
                 displayRandomLine();
            }

            currentPlayer = playerFruit;
        }
    }

    function restartGame() {
        hideWinMessage();
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        movesCount = 0;
        lastDisplayedLine = null;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('banana', 'strawberry');
        });

        currentPlayer = playerFruit;
        message.textContent = `Ваш ход (${playerFruit})`;
        if (playerFruit === '🍓') {
            setTimeout(aiMove, 500);
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);

    closeModal.addEventListener('click', hideWinMessage);

    window.addEventListener('click', (event) => {
        if (event.target == winMessage) {
            hideWinMessage();
        }
    });

    function chooseFruit(fruit) {
        playerFruit = fruit;
        aiFruit = (fruit === '🍌') ? '🍓' : '🍌';
        fruitChoiceModal.style.display = "none";

        restartGame();
    }

    chooseBananaButton.addEventListener('click', () => chooseFruit('🍌'));
    chooseStrawberryButton.addEventListener('click', () => chooseFruit('🍓'));

    fruitChoiceModal.style.display = "block";

   function initializeGame() {
        fruitChoiceModal.style.display = "block";
    }

    initializeGame();
});