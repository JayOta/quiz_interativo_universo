// ===== PERGUNTAS E TRADUÇÃO =====
const questionData = {
  PT: [
    {
      question: "Qual é o maior planeta do Sistema Solar?",
      options: ["Terra", "Marte", "Júpiter", "Saturno"],
      answer: "Júpiter",
    },
    {
      question: "Qual é a estrela mais próxima da Terra?",
      options: ["Sirius", "Sol", "Alpha Centauri", "Betelgeuse"],
      answer: "Sol",
    },
    {
      question: "Qual planeta é conhecido como o Planeta Vermelho?",
      options: ["Mercúrio", "Marte", "Vênus", "Netuno"],
      answer: "Marte",
    },
    {
      question: "Quantas luas tem a Terra?",
      options: ["1", "2", "3", "Nenhuma"],
      answer: "1",
    },
    {
      question: "O que é um buraco negro?",
      options: [
        "Um planeta frio",
        "Uma região do espaço com gravidade intensa",
        "Uma estrela extinta",
        "Uma nebulosa",
      ],
      answer: "Uma região do espaço com gravidade intensa",
    },
  ],
  EN: [
    {
      question: "What is the largest planet in the Solar System?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      answer: "Jupiter",
    },
    {
      question: "What is the closest star to Earth?",
      options: ["Sirius", "Sun", "Alpha Centauri", "Betelgeuse"],
      answer: "Sun",
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Mercury", "Mars", "Venus", "Neptune"],
      answer: "Mars",
    },
    {
      question: "How many moons does Earth have?",
      options: ["1", "2", "3", "None"],
      answer: "1",
    },
    {
      question: "What is a black hole?",
      options: [
        "A cold planet",
        "A region of space with intense gravity",
        "An extinct star",
        "A nebula",
      ],
      answer: "A region of space with intense gravity",
    },
  ],
};

let currentLanguage = "PT";
let questions = questionData[currentLanguage];
let currentQuestionIndex = 0;
let score = 0;
let answerSelected = false; // Novo controle de estado

// ===== ELEMENTOS DOM =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");
const translateBtn = document.getElementById("translate-btn");
const infoBtn = document.getElementById("info-btn");
const instructions = document.getElementById("instructions");
const questionNumberEl = document.getElementById("question-number");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultScreenEl = document.getElementById("result-screen");
const progressBar = document.getElementById("progress-fill");

// ===== LISTENERS =====
infoBtn.addEventListener("click", () => {
  instructions.classList.toggle("hidden");
});

translateBtn.addEventListener("click", handleTranslate);
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", handleNextQuestion);

// ===== FUNÇÕES PRINCIPAIS =====

function handleTranslate() {
  currentLanguage = currentLanguage === "PT" ? "EN" : "PT";
  questions = questionData[currentLanguage];

  // Atualiza o texto do botão de tradução
  translateBtn.textContent =
    currentLanguage === "PT" ? "Traduzir (EN)" : "Translate (PT-BR)";

  // Atualiza a tela inicial
  if (currentLanguage === "EN") {
    document.querySelector("#start-screen h1").textContent =
      "🌌 Universe Quiz 🚀";
    document.querySelector("#start-screen p").textContent =
      "Test your knowledge about outer space!";
    startBtn.textContent = "Start";
    infoBtn.textContent = "Instructions";
    instructions.innerHTML =
      '<p>✅ Choose the correct option.<br>✅ Click "Next" to proceed.<br>✅ See your astronaut ranking at the end!</p>';
  } else {
    document.querySelector("#start-screen h1").textContent =
      "🌌 Quiz do Universo 🚀";
    document.querySelector("#start-screen p").textContent =
      "Teste seus conhecimentos sobre o espaço sideral!";
    startBtn.textContent = "Iniciar";
    infoBtn.textContent = "Instruções";
    instructions.innerHTML =
      '<p>✅ Escolha a alternativa correta.<br>✅ Clique em "Próxima" para avançar.<br>✅ Ao final, veja sua patente de astronauta!</p>';
  }
}

function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  quizScreen.classList.add("fadeIn"); // Adiciona a animação de entrada

  currentQuestionIndex = 0;
  score = 0;
  resultScreenEl.classList.add("hidden");
  nextBtn.classList.add("disabled");
  nextBtn.disabled = true;
  nextBtn.textContent = currentLanguage === "PT" ? "Próxima" : "Next";

  loadQuestion();
  updateProgressBar();
}

function loadQuestion() {
  // Garante que a tela de quiz esteja visível e o resultado escondido
  questionEl.parentElement.classList.remove("hidden");
  nextBtn.classList.add("hidden");

  const q = questions[currentQuestionIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  questionNumberEl.textContent = `${
    currentLanguage === "PT" ? "Pergunta" : "Question"
  } ${currentQuestionIndex + 1}/${questions.length}`;

  q.options.forEach((option) => {
    const btn = document.createElement("div");
    btn.textContent = option;
    btn.classList.add("option");
    btn.addEventListener("click", () => handleSelectAnswer(btn, q.answer));
    optionsEl.appendChild(btn);
  });

  answerSelected = false; // Resetar o estado
  nextBtn.classList.add("disabled");
  nextBtn.disabled = true;
}

function handleSelectAnswer(selectedEl, correct) {
  if (answerSelected) return; // Impede múltiplos cliques
  answerSelected = true;

  const isCorrect = selectedEl.textContent === correct;

  if (isCorrect) {
    selectedEl.classList.add("correct");
    score++;
  } else {
    selectedEl.classList.add("wrong");
    // Destacar a resposta correta
    Array.from(optionsEl.children)
      .find((opt) => opt.textContent === correct)
      .classList.add("correct");
  }

  // Desabilitar todas as opções após a seleção
  Array.from(optionsEl.children).forEach((opt) =>
    opt.classList.add("disabled")
  );

  // Habilitar o botão Próxima após o feedback
  nextBtn.classList.remove("hidden");
  nextBtn.classList.remove("disabled");
  nextBtn.disabled = false;
}

function handleNextQuestion() {
  currentQuestionIndex++;
  updateProgressBar();

  if (currentQuestionIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function updateProgressBar() {
  const progress = (currentQuestionIndex / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

// ===== TELA DE RESULTADO E ANIMAÇÃO FINAL =====

function showResult() {
  // Esconde os elementos do quiz e mostra a tela de resultado
  questionEl.parentElement.classList.add("hidden");
  nextBtn.classList.add("hidden");
  resultScreenEl.classList.remove("hidden");

  // Atualiza a barra para 100%
  progressBar.style.width = "100%";

  const percent = (score / questions.length) * 100;
  let message = "";
  let emoji = "";

  const messages = {
    100: {
      PT: "🚀 Comandante Estelar! Perfeito!",
      EN: "🚀 Star Commander! Perfect!",
    },
    70: {
      PT: "🌌 Astronauta Veterano! Ótimo conhecimento.",
      EN: "🌌 Veteran Astronaut! Great knowledge.",
    },
    40: {
      PT: "✨ Cadete Espacial. Você está no caminho certo.",
      EN: "✨ Space Cadet. You're on the right track.",
    },
    0: {
      PT: "🌑 Explorador Iniciante. Hora de olhar para as estrelas!",
      EN: "🌑 Beginner Explorer. Time to look at the stars!",
    },
  };

  if (percent === 100) {
    message = messages[100][currentLanguage];
    emoji = "🥇";
  } else if (percent >= 70) {
    message = messages[70][currentLanguage];
    emoji = "🌟";
  } else if (percent >= 40) {
    message = messages[40][currentLanguage];
    emoji = "🔭";
  } else {
    message = messages[0][currentLanguage];
    emoji = "😥";
  }

  const restartText =
    currentLanguage === "PT" ? "Jogar Novamente" : "Play Again";
  const scoreText =
    currentLanguage === "PT"
      ? `Você acertou ${score} de ${questions.length} perguntas.`
      : `You got ${score} out of ${questions.length} questions correct.`;

  resultScreenEl.innerHTML = `
        <p>${scoreText}</p>
        <p class="result-message">${message}</p>
        <span class="result-emoji">${emoji}</span>
        <div class="restart-btn-group">
            <button onclick="restartQuiz()" class="btn primary">${restartText}</button>
        </div>
    `;

  // Animação de background (foguete com CSS)
  createRocketAnimation();
}

function restartQuiz() {
  // Simplesmente volta para a tela inicial
  quizScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  resultScreenEl.innerHTML = "";

  // Remove qualquer foguete que possa estar voando
  document.querySelectorAll(".rocket").forEach((r) => r.remove());
}

function createRocketAnimation() {
  const rocket = document.createElement("div");
  rocket.textContent = "🚀";
  rocket.className = "rocket";

  // Posiciona o foguete no centro da tela de quiz
  const rect = quizScreen.getBoundingClientRect();
  rocket.style.position = "fixed";
  rocket.style.left = `${rect.left + rect.width / 2}px`;
  rocket.style.top = `${rect.top + rect.height - 50}px`;

  // Adiciona o foguete ao corpo e permite que o CSS cuide da animação de voo
  document.body.appendChild(rocket);

  // Remove o foguete após a animação
  setTimeout(() => {
    if (rocket.parentElement) {
      rocket.parentElement.removeChild(rocket);
    }
  }, 2000);
}

// ===== ANIMAÇÕES DE FUNDO (Estrelas e Meteoros) =====

// Adiciona as estrelas fixas ao fundo
for (let i = 0; i < 200; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.width = 1 + Math.random() * 2 + "px";
  star.style.height = 1 + Math.random() * 2 + "px";
  star.style.animationDuration = 3 + Math.random() * 5 + "s";
  document.getElementById("star-background").appendChild(star);
}

// Adiciona meteoros (estrelas cadentes)
setInterval(() => {
  const meteor = document.createElement("div");
  meteor.className = "meteor";
  meteor.style.left = Math.random() * window.innerWidth + "px";
  meteor.style.top = `${-50 - Math.random() * 100}px`;
  meteor.style.animationDuration = 2 + Math.random() * 3 + "s";
  document.body.appendChild(meteor);
  setTimeout(() => document.body.removeChild(meteor), 5000);
}, 1500);
