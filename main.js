//correct word you can see in console;


let wordList = [
  "hello",
  "guitar",
  "oxygen",
  "mountain",
  "painting",
  "astronomy",
  "football",
  "chocolate",
  "butterfly",
  "history",
  "pizza",
  "jazz",
  "camera",
  "diamond",
  "adventure",
  "coffee",
  "dance",
  "theater",
];

let wordDisplay;
let currentLetters = 0;
let wrongCount;
const maxGues = 6;
let current;
const hangmanImage = document.querySelector(".hangman-box img");
const gameModel = document.querySelector(".game-model");
let playAgainBtn = document.querySelector(".play-again");
let restartGame = document.querySelector(".restart");
wordDisplay = document.querySelector(".word-display");
let next = document.querySelector(".play-again p");
let keyboard = document.querySelector(".keyboard");
let wrongInner = document.querySelector(".guesses-text b");
let point = document.querySelector(".point");
const restart = document.querySelector(".restart");

let resetGame = () => {
  current = [];
  wrongCount = 0;
  hangmanImage.src = `hangman-${wrongCount}.svg`;
  wrongInner.innerText = `${wrongCount} / ${maxGues}`;
  wordDisplay.innerHTML = currentWord
    .split("")
    .map(() => `<li class="letter"></li>`)
    .join("");
  gameModel.classList.remove("show");
};
// random word and explainationn API
let currentWord;
let getRandomWords = () => {
  let i = Math.floor(Math.random() * wordList.length);
  let word = wordList[i];

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        let firstEntry = data[0];
        let firstDefinition = firstEntry.meanings[0].definitions[0];
        let hint = firstDefinition.definition;
        console.log(hint);
        currentWord = word;
        console.log(`Word: ${word}`);
        document.querySelector(".hint-text b").innerText = hint;
        resetGame();
      }
    });
};

// winner / !winner

let winner = (isVictory) => {
  const modelText = isVictory ? `You found the word:` : `The correct word is:`;
  next.innerText = isVictory ? `next:` : `Play Again`;
  gameModel.querySelector("h4").innerText = `${
    isVictory ? "Congrats!" : "Game over! "
  }`;
  gameModel.querySelector("p").innerHTML = `${modelText} <b>${currentWord}</b>`;
  gameModel.classList.add("show");
};

// kayboard
for (let i = 97; i <= 122; i++) {
  let button = document.createElement("button");
  button.innerText = String.fromCharCode(i);
  keyboard.appendChild(button);
  button.addEventListener("click", (e) =>
    mainGame(e.target, String.fromCharCode(i))
  );
}

// main game

function mainGame(button, clickedLetter) {
  if (currentWord.includes(clickedLetter)) {
    currentLetters++;

    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        current.push(letter);

        wordDisplay.querySelectorAll("li")[index].innerText = letter;
        wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
      }
    });
  } else {
    wrongCount++;
    wrongInner.innerText = `${wrongCount} / ${maxGues}`;
    hangmanImage.src = `hangman-${wrongCount}.svg`;
  }

  if (current.length === currentWord.length) {
    return winner(true);
  }
  if (wrongCount === maxGues) {
    wrongCount = 0;
    return winner(false);
  }
}

// answer at once;

let answerAtOnce = document.querySelector(".wrapper");
answerAtOnce.addEventListener("keydown", function (event) {
  if (current.length <= currentWord.length / 2) {
    if (event.key === "Enter") {
      // Check if the Enter key is pressed
      let inputValue = event.target.value.trim().toLowerCase(); // Trim any leading/trailing whitespace and convert to lowercase
      if (inputValue === currentWord) {
        winner(true);
      } else {
        wrongCount++;
        wrongInner.innerText = `${wrongCount} / ${maxGues}`;
        hangmanImage.src = `hangman-${wrongCount}.svg`;
        if (wrongCount === maxGues) {
          wrongCount = 0;
          point = 0;
          winner(false);
        }
      }
      event.target.value = "";
    }
  }
});

restart.addEventListener("click", getRandomWords);
playAgainBtn.addEventListener("click", getRandomWords);
getRandomWords();
