// Global variables for score, question count, level, etc.
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let currentAnswer = 0;
let timerInterval;
let timeLeft = 90;
let currentLevel = 1;
const maxQuestions = 20; // Maximum number of questions per level
const requiredCorrectAnswers = 15; // Minimum correct answers required to pass the level

// Function to start the game
function startGame() {
    // Reset all game variables
    score = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    currentLevel = 1;
    timeLeft = 90;
    document.getElementById("start-button").style.display = "none";
    document.getElementById("question-area").style.display = "block";
    generateQuestion();
    startTimer();
    document.getElementById("feedback").textContent = "Good luck!";
    document.getElementById("next-level").style.display = "none"; // Hide Next Level button at start
}

// Function to generate a new math question
function generateQuestion() {
    if (totalQuestions >= maxQuestions) {
        return; // End the game if max questions are reached
    }

    let num1, num2;
    const operator = Math.random() < 0.5 ? "+" : "-"; // Randomly choose between addition and subtraction

    if (currentLevel === 1) {
        // Level 1: Simple addition
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        currentAnswer = num1 + num2;
        document.getElementById("question").textContent = `What is ${num1} + ${num2}?`;
    } else if (currentLevel === 2) {
        // Level 2: Addition and subtraction with larger numbers
        num1 = Math.floor(Math.random() * 71) + 20;
        num2 = Math.floor(Math.random() * 71) + 20;

        if (operator === "+") {
            currentAnswer = num1 + num2;
            document.getElementById("question").textContent = `What is ${num1} + ${num2}?`;
        } else if (operator === "-") {
            if (num1 < num2) [num1, num2] = [num2, num1]; // Ensure num1 >= num2 for subtraction
            currentAnswer = num1 - num2;
            document.getElementById("question").textContent = `What is ${num1} - ${num2}?`;
        }
    }
}

// Function to check the user's answer
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("user-answer").value);
    if (isNaN(userAnswer)) {
        document.getElementById("feedback").textContent = "Please enter a valid number.";
        return; // Prevent further execution if input is invalid
    }

    totalQuestions++;

    if (userAnswer === currentAnswer) {
        correctAnswers++;
        document.getElementById("feedback").textContent = "Good Job! You got it right!";
    } else {
        document.getElementById("feedback").textContent = "Try Again! That’s not correct.";
    }

    // Update score display
    document.getElementById("score").textContent = `Score: ${correctAnswers}/${totalQuestions}`;

    // Check for win condition: 15 correct answers
    if (correctAnswers >= requiredCorrectAnswers) {
        endLevelWithSuccess();
        return;
    }

    // Check if the player has reached the max number of questions
    if (totalQuestions >= maxQuestions) {
        if (correctAnswers >= requiredCorrectAnswers) {
            endLevelWithSuccess();
        } else {
            endGameDueToFailure();
        }
        return;
    }

    // Generate a new question if the game is still ongoing
    document.getElementById("user-answer").value = ""; // Clear input field
    generateQuestion();
}

// Function to handle level success
function endLevelWithSuccess() {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById("question-area").style.display = "none"; // Hide question area

    if (currentLevel < 11) {
        document.getElementById("feedback").textContent = `Congratulations! You passed to Level ${currentLevel + 1}!`;
        document.getElementById("next-level").style.display = "block"; // Show Next Level button
        currentLevel++; // Increment level
    } else {
        document.getElementById("feedback").textContent = `Congratulations! You completed all levels! Final score: ${correctAnswers}/${totalQuestions}`;
        document.getElementById("start-button").style.display = "block"; // Show restart button
    }

    totalQuestions = 0; // Reset question count
    correctAnswers = 0; // Reset correct answers count
}

// Function to handle end of game due to failure to answer enough questions correctly
function endGameDueToFailure() {
    clearInterval(timerInterval); // Stop the timer
    document.getElementById("question-area").style.display = "none";
    document.getElementById("feedback").textContent = `You didn't answer enough questions correctly. Final score: ${correctAnswers}/${totalQuestions}.`;
    document.getElementById("start-button").style.display = "block"; // Show start button to restart the game
}

// Function to start the countdown timer
function startTimer() {
    timeLeft = 90; // Reset timer
    document.getElementById("timer").textContent = `Time Remaining: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Remaining: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGameDueToTime();
        }
    }, 1000);
}

// Function to handle end of game due to time running out
function endGameDueToTime() {
    document.getElementById("question-area").style.display = "none";
    document.getElementById("feedback").textContent = `Time is over! You didn't answer enough questions. Final score: ${correctAnswers}/${totalQuestions}`;
    document.getElementById("start-button").style.display = "block"; // Show start button to restart the game
}

// Function to go to the next level after the user clicks "Next Level"
function nextLevel() {
    // Hide the Next Level button and show the game area again
    document.getElementById("next-level").style.display = "none";
    document.getElementById("question-area").style.display = "block";

    document.getElementById("feedback").textContent = `Level ${currentLevel} starts now! Good luck!`;
    document.getElementById("score").textContent = `Score: ${correctAnswers}/${totalQuestions}`; // Reset score display

    generateQuestion(); // Generate a new question
    startTimer(); // Restart the timer
}