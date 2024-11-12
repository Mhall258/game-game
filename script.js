// script.js

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-button");
const progressBarFill = document.querySelector('.progress-bar-fill');

async function fetchQuestions() {
    const url = 'https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple';
    try {
        const response = await fetch(url);
        const data = await response.json();
        questions = data.results.map((question) => {
            const formattedQuestion = {
                question: question.question,
                answers: [...question.incorrect_answers.map(answer => ({ text: answer, correct: false }))]
            };
            formattedQuestion.answers.push({ text: question.correct_answer, correct: true });
            formattedQuestion.answers = formattedQuestion.answers.sort(() => Math.random() - 0.5);
            return formattedQuestion;
        });
        startGame();
    } catch (error) {
        console.error("Failed to fetch questions:", error);
        questionElement.innerText = "Could not load questions. Please try again later.";
    }
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerText = "Next";
    nextButton.style.display = "none";
    progressBarFill.style.width = '0%';
    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtonsElement.appendChild(button);
    });
    updateProgressBar();
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) score++;
    Array.from(answerButtonsElement.children).forEach(button => {
        button.classList.add(button.dataset.correct === "true" ? "correct" : "wrong");
    });
    nextButton.style.display = "block";
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

function showScore() {
    resetState();
    questionElement.innerText = `Your score: ${score} out of ${questions.length}`;
    nextButton.innerText = "Restart";
    nextButton.style.display = "block";
    nextButton.onclick = () => fetchQuestions();
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBarFill.style.width = `${progressPercentage}%`;
}

fetchQuestions();
