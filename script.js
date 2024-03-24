
const paragraphs = {
    easy: [
      // Easy paragraphs
      "Learning is fun! Reading books helps children expand their vocabulary and imagination...",
      "Mathematics is like a puzzle. Solving math problems exercises your brain and helps you think critically..."
    ],
    medium: [
      // Medium paragraphs
      "Science is all around us. From plants to animals, and the stars in the sky, there's so much to explore...",
      "History teaches us about the past. Studying the achievements and challenges of those who came before us helps us build a better future..."
    ],
    hard: [
      // Hard paragraphs
      "Language is an intricate tapestry woven with the threads of culture, history, and human connection. Its power transcends mere communication, acting as a bridge between individuals and civilizations, allowing the exchange of ideas and emotions that shape our shared experiences. Learning multiple languages is akin to possessing a set of keys that unlock doors to uncharted territories of understanding, propelling us into the heart of new cultures and fostering connections that span the globe....",
      "Geography is the silent storyteller of our planet, revealing tales of ancient landscapes, dynamic ecosystems, and the relentless forces that have shaped Earth's surface over eons. As we trace our fingers across maps, we embark on a journey through time and space, navigating the contours of continents and oceans, and unearthing the mysteries held within each geographic feature. Countries emerge as vibrant characters in the narrative, each with its own history, people, and traditions, contributing to the intricate mosaic of human existence...."
    ]
  };
  
  
  const typingText = document.querySelector(".typing-text p");
  const inpField = document.querySelector(".wrapper .input-field");
  const startBtn = document.querySelector(".start");
  const tryAgainBtn = document.querySelector(".play-again");
  const timeTag = document.querySelector(".time span b");
  const mistakeTag = document.querySelector(".mistake span");
  const wpmTag = document.querySelector(".wpm span");
  const cpmTag = document.querySelector(".cpm span");
  const difficultySelect = document.getElementById("difficulty");
  const scoreboard = document.querySelector(".scoreboard");
  
  let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0;
  let currentDifficulty = "easy";
  
  function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs[currentDifficulty].length);
    typingText.innerHTML = "";
    paragraphs[currentDifficulty][ranIndex].split("").forEach((char) => {
      let span = `<span>${char}</span>`;
      typingText.innerHTML += span;
    });
    const characters = typingText.querySelectorAll("span");
    characters[charIndex].classList.add("active");
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
  }
  
  function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    scoreboard.style.display = "none";
  }
  
  startBtn.addEventListener("click", () => {
    resetGame();
    inpField.focus();
  });
  
  difficultySelect.addEventListener("change", function() {
    currentDifficulty = this.value;
    resetGame();
  });
  
  function showScoreboard() {
    scoreboard.style.display = "block";
    const accuracy = ((charIndex - mistakes) / charIndex) * 100;
    const scoreHTML = `
      <p>Words Per Minute (WPM): <span>${wpmTag.innerText}</span></p>
      <p>Characters Per Minute (CPM): <span>${cpmTag.innerText}</span></p>
      <p>Mistakes: <span>${mistakeTag.innerText}</span></p>
      <p>Accuracy: <span>${accuracy.toFixed(2)}%</span></p>
    `;
    scoreboard.innerHTML = scoreHTML;
  }
  
  function showScoreboardAndLabel() {
    showScoreboard();
  
    const label = document.createElement("div");
    label.classList.add("label");
    label.innerHTML = `<p>Paragraph completed! Well done!</p>`;
    document.body.appendChild(label);
  
    setTimeout(() => {
      resetGame();
      document.body.removeChild(label);
    }, 3000); // Adjust the timeout as needed
  }
  
  function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.charAt(charIndex);
    if (charIndex < characters.length && timeLeft > 0) {
      if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
      }
      if (typedChar == null) {
        if (charIndex > 0) {
          charIndex--;
          if (characters[charIndex].classList.contains("incorrect")) {
            mistakes--;
          }
          characters[charIndex].classList.remove("correct", "incorrect");
        }
      } else {
        if (characters[charIndex].innerText == typedChar) {
          characters[charIndex].classList.add("correct");
        } else {
          mistakes++;
          characters[charIndex].classList.add("incorrect");
        }
        charIndex++;
      }
      characters.forEach(span => span.classList.remove("active"));
      characters[charIndex].classList.add("active");
  
      let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
  
      wpmTag.innerText = wpm;
      mistakeTag.innerText = mistakes;
      cpmTag.innerText = charIndex - mistakes;
  
      if (charIndex === characters.length || timeLeft === 0) {
        clearInterval(timer);
        inpField.value = "";
        showScoreboardAndLabel();
      }
    } else {
      clearInterval(timer);
      inpField.value = "";
      showScoreboard();
    }
  }
  
  function initTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timeTag.innerText = timeLeft;
      let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
      wpmTag.innerText = wpm;
    } else {
      clearInterval(timer);
      showScoreboardAndLabel();
    }
  }
  
  loadParagraph();
  inpField.addEventListener("input", initTyping);
  tryAgainBtn.addEventListener("click", resetGame);
  
  