document.addEventListener("DOMContentLoaded", function() {
    const wordInput = document.getElementById("word-input");
    const startGameBtn = document.getElementById("start-game");
    const guessInput = document.getElementById("guess-input");
    const guessButton = document.getElementById("guess-button");
    const wordContainer = document.getElementById("word-container");
    const hangmanCanvas = document.getElementById("hangman-canvas");
    const winScore = document.getElementById("win-score");
    const lossScore = document.getElementById("loss-score");
    const setup = document.getElementById("setup");
    const gameContainer = document.getElementById("game-container");
    const guessFields = document.getElementById("guess-fields");
    const wrongGuessesContainer = document.getElementById("wrong-guesses-container"); // Updated

    const ctx = hangmanCanvas.getContext("2d");

    let word = "";
    let displayedWord = "";
    let guessedLetters = [];
    let wrongGuesses = 0;
    let maxWrongGuesses = 6; // Number of parts in hangman
    let winCount = 0;
    let lossCount = 0;

    startGameBtn.addEventListener("click", startGame);
    guessButton.addEventListener("click", handleGuess);

    function startGame() {
        word = wordInput.value.trim().toLowerCase();
        if (word === "") return;

        displayedWord = "_ ".repeat(word.length).trim();
        wordContainer.textContent = displayedWord;
        guessedLetters = [];
        wrongGuesses = 0;
        hangmanCanvas.width = hangmanCanvas.width; // Clear the canvas
        drawHangman(0); // Draw initial empty stage
        guessInput.value = "";
        wordInput.value = "";

        // Hide setup and show game and guess fields
        setup.style.display = "none";
        gameContainer.style.display = "flex";
        guessFields.style.display = "flex";

        // Show wrong guesses section
        wrongGuessesContainer.style.display = "block"; // Updated

        // Clear wrong guesses
        wrongGuessesContainer.querySelector("#wrong-guesses").textContent = "";

        document.removeEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyPress);
    }

    function handleKeyPress(event) {
        if (event.key.length === 1 && /^[a-z]$/.test(event.key)) {
            handleGuess();
        }
    }

    function handleGuess() {
        const letter = guessInput.value.toLowerCase();
        if (!/^[a-z]$/.test(letter) || guessedLetters.includes(letter)) return;

        guessedLetters.push(letter);
        guessInput.value = "";

        if (word.includes(letter)) {
            updateDisplayedWord(letter);
        } else {
            wrongGuesses++;
            drawHangman(wrongGuesses);
            displayWrongGuesses(letter);
        }

        checkGameStatus();
    }

    function updateDisplayedWord(letter) {
        let newDisplayedWord = "";
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                newDisplayedWord += letter + " ";
            } else {
                newDisplayedWord += displayedWord[i * 2] + " ";
            }
        }
        displayedWord = newDisplayedWord.trim();
        wordContainer.textContent = displayedWord;
    }

    function drawHangman(stage) {
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;

        switch (stage) {
            case 1:
                // Draw head
                ctx.beginPath();
                ctx.arc(150, 100, 20, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 2:
                // Draw head and body
                ctx.beginPath();
                ctx.moveTo(150, 120);
                ctx.lineTo(150, 180);
                ctx.stroke();
                break;
            case 3:
                // Draw head, body, and left arm
                ctx.beginPath();
                ctx.moveTo(150, 130);
                ctx.lineTo(130, 160);
                ctx.stroke();
                break;
            case 4:
                // Draw head, body, left arm, and right arm
                ctx.beginPath();
                ctx.moveTo(150, 130);
                ctx.lineTo(170, 160);
                ctx.stroke();
                break;
            case 5:
                // Draw head, body, left arm, right arm, and left leg
                ctx.beginPath();
                ctx.moveTo(150, 180);
                ctx.lineTo(130, 220);
                ctx.stroke();
                break;
            case 6:
                // Draw head, body, left arm, right arm, left leg, and right leg
                ctx.beginPath();
                ctx.moveTo(150, 180);
                ctx.lineTo(170, 220);
                ctx.stroke();
                break;
            default:
                // Draw initial hangman setup (no drawing needed here)
                ctx.beginPath();
                ctx.moveTo(50, 250);
                ctx.lineTo(150, 250);
                ctx.moveTo(100, 50);
                ctx.lineTo(100, 250);
                ctx.moveTo(100, 50);
                ctx.lineTo(150, 50);
                ctx.moveTo(150, 50);
                ctx.lineTo(150, 80);
                ctx.stroke();
                break;
        }
    }

    function displayWrongGuesses(letter) {
        const wrongGuessesElement = document.getElementById("wrong-guesses");
        const currentWrongGuesses = wrongGuessesElement.textContent;
        if (currentWrongGuesses === "") {
            wrongGuessesElement.textContent = letter;
        } else {
            wrongGuessesElement.textContent += `, ${letter}`;
        }
    }

    function checkGameStatus() {
        if (displayedWord.replace(/ /g, "") === word) {
            winCount++;
            winScore.textContent = winCount;
            alert("Congratulations! You won!");
            resetGame();
        } else if (wrongGuesses >= maxWrongGuesses) {
            lossCount++;
            lossScore.textContent = lossCount;
            alert(`You lost! The word was "${word}".`);
            resetGame();
        }
    }

    function resetGame() {
        word = "";
        displayedWord = "";
        guessedLetters = [];
        wrongGuesses = 0;
        wordContainer.textContent = "";
        hangmanCanvas.width = hangmanCanvas.width; // Clear the canvas
        drawHangman(0); // Draw initial empty stage
        setup.style.display = "block";
        gameContainer.style.display = "none";
        guessFields.style.display = "none";
        wrongGuessesContainer.style.display = "none"; // Hide wrong guesses
        document.removeEventListener("keydown", handleKeyPress);
    }
});
