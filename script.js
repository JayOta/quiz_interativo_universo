// ===== PERGUNTAS =====
const questionsPT = [
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
];
const questionsEN = [
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
];

let questions = [...questionsPT];
let currentQuestion = 0;
let score = 0;

// ===== ELEMENTOS =====
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-container");
const startBtn = document.getElementById("start-btn");
const translateBtn = document.getElementById("translate-btn");
const infoBtn = document.getElementById("info-btn");
const instructions = document.getElementById("instructions");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const canvas = document.getElementById("final-animation");

// ===== BOTÕES =====
infoBtn.addEventListener("click", () => {
  instructions.classList.toggle("hidden");
});
translateBtn.addEventListener("click", () => {
  if (questions === questionsPT) {
    questions = [...questionsEN];
    translateBtn.textContent = "Traduzir (PT-BR)";
  } else {
    questions = [...questionsPT];
    translateBtn.textContent = "Traduzir (EN)";
  }
});
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) loadQuestion();
  else showResult();
});

// ===== FUNÇÕES =====
function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentQuestion = 0;
  score = 0;
  nextBtn.style.display = "inline-block";
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  q.options.forEach((option) => {
    const btn = document.createElement("div");
    btn.textContent = option;
    btn.classList.add("option");
    btn.addEventListener("click", () => selectAnswer(btn, q.answer));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selected, correct) {
  if (selected.textContent === correct) {
    selected.style.background = "rgba(0,255,0,0.5)";
    score++;
  } else {
    selected.style.background = "rgba(255,0,0,0.5)";
  }
  Array.from(optionsEl.children).forEach(
    (opt) => (opt.style.pointerEvents = "none")
  );
}

// ===== RESULTADO =====
function showResult() {
  questionEl.textContent = "";
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  let message = "";
  const percent = (score / questions.length) * 100;

  if (percent === 100) {
    message = "🚀 Perfeito! Você é um verdadeiro astronauta!";
    startFinalAnimation("stars");
  } else if (percent >= 70) {
    message = "🌌 Ótimo! Você entende bem sobre o Universo.";
    startFinalAnimation("glow");
  } else if (percent >= 40) {
    message = "✨ Bom! Mas ainda pode aprender mais sobre as estrelas.";
    startFinalAnimation("small-stars");
  } else {
    message = "🌑 Ops... Parece que você precisa estudar mais astronomia!";
    startFinalAnimation("moon");
  }

  resultEl.innerHTML = `
    Você acertou ${score} de ${questions.length} perguntas.<br><br>
    ${message}<br><br>
    <span class="rocket">🚀</span><br><br>
    <button onclick="restartQuiz()">Jogar Novamente</button>
  `;
}

// ===== REINICIAR QUIZ =====
function restartQuiz() {
  score = 0;
  currentQuestion = 0;
  canvas.classList.add("hidden");
  resultEl.innerHTML = "";
  startQuiz();
}

// ===== ANIMAÇÕES FINAIS COM CANVAS =====
function startFinalAnimation(type) {
  canvas.classList.remove("hidden");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (type === "stars" || type === "small-stars" || type === "glow") {
    let stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius:
          type === "small-stars" ? Math.random() * 1.5 : Math.random() * 3,
        speed: Math.random() * 2 + 0.5,
      });
    }
    function animateStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = type === "glow" ? "cyan" : "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y -= star.speed;
        if (star.y < 0) star.y = canvas.height;
      });
      requestAnimationFrame(animateStars);
    }
    animateStars();
  }

  if (type === "moon") {
    function drawMoon() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "gray";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(canvas.width / 2 + 30, canvas.height / 2, 80, 0, Math.PI * 2);
      ctx.fill();
      requestAnimationFrame(drawMoon);
    }
    drawMoon();
  }
}

// ===== ESTRELAS CADENTES ALEATÓRIAS =====
setInterval(() => {
  const meteor = document.createElement("div");
  meteor.className = "meteor";
  meteor.style.left = Math.random() * window.innerWidth + "px";
  meteor.style.top = "-50px";
  meteor.style.animationDuration = 2 + Math.random() * 3 + "s";
  document.body.appendChild(meteor);
  setTimeout(() => document.body.removeChild(meteor), 5000);
}, 1500);

// ===== ESTRELAS FIXAS =====
for (let i = 0; i < 200; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = Math.random() * window.innerHeight + "px";
  star.style.width = 1 + Math.random() * 2 + "px";
  star.style.height = 1 + Math.random() * 2 + "px";
  document.getElementById("star-background").appendChild(star);
}
