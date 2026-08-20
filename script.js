// ===== TELEGRAM УВЕДОМЛЕНИЯ =====
const TG_TOKEN = "8749136533:AAEtOd33O0cyZ8_buAf3z8g0f1gLKcKi1cY";
const TG_CHAT_ID = "8492178931";

function notifyTelegram(text) {
  const url =
    `https://api.telegram.org/bot${TG_TOKEN}/sendMessage` +
    `?chat_id=${TG_CHAT_ID}` +
    `&text=${encodeURIComponent(text)}`;

  fetch(url).catch(() => {});
}

// Уведомление о заходе на сайт
notifyTelegram(
  `🌐 Новый визит на сайт\nВремя: ${new Date().toLocaleString("ru-RU")}`
);

// ===== Общие =====
document.getElementById("year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


// ===== КАЛЬКУЛЯТОР =====
const display = document.getElementById("calc-display");

let calcValue = "0";
let firstNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = calcValue;
}

function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "−") return a - b;
  if (op === "×") return a * b;
  if (op === "÷") {
    return b === 0 ? "Ошибка" : a / b;
  }
}

document.querySelectorAll("[data-calc]").forEach(button => {
  button.addEventListener("click", () => {

    const type = button.dataset.calc;
    const value = button.textContent;

    if (type === "number") {

      if (calcValue === "Ошибка" || shouldResetDisplay) {
        calcValue = value;
        shouldResetDisplay = false;
      } else {
        calcValue = calcValue === "0"
          ? value
          : calcValue + value;
      }

      updateDisplay();
    }

    if (type === "decimal") {

      if (shouldResetDisplay || calcValue === "Ошибка") {
        calcValue = "0.";
        shouldResetDisplay = false;
      } else if (!calcValue.includes(".")) {
        calcValue += ".";
      }

      updateDisplay();
    }

    if (type === "operator") {

      const number = parseFloat(calcValue);

      if (Number.isNaN(number)) return;

      if (
        firstNumber !== null &&
        currentOperator &&
        !shouldResetDisplay
      ) {
        const result = calculate(
          firstNumber,
          number,
          currentOperator
        );

        calcValue = String(result);

        firstNumber =
          result === "Ошибка"
            ? null
            : result;
      } else {
        firstNumber = number;
      }

      currentOperator = value;
      shouldResetDisplay = true;

      updateDisplay();
    }

    if (type === "equal") {

      if (
        firstNumber === null ||
        !currentOperator
      ) return;

      const result = calculate(
        firstNumber,
        parseFloat(calcValue),
        currentOperator
      );

      calcValue = String(result);

      firstNumber = null;
      currentOperator = null;
      shouldResetDisplay = true;

      updateDisplay();
    }

    if (type === "clear") {

      calcValue = "0";
      firstNumber = null;
      currentOperator = null;
      shouldResetDisplay = false;

      updateDisplay();
    }

    if (type === "back") {

      if (calcValue.length > 1) {
        calcValue = calcValue.slice(0, -1);
      } else {
        calcValue = "0";
      }

      updateDisplay();
    }
  });
});


// ===== КРЕСТИКИ-НОЛИКИ =====
const cells = [
  ...document.querySelectorAll("#ttt-board button")
];

const tttStatus =
  document.getElementById("ttt-status");

const tttReset =
  document.getElementById("ttt-reset");

let board = Array(9).fill("");
let player = "X";
let gameOver = false;

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

function checkWinner() {

  return wins.find(([a, b, c]) =>

    board[a] &&
    board[a] === board[b] &&
    board[a] === board[c]

  );
}

function renderTtt() {

  cells.forEach((cell, i) => {

    cell.textContent = board[i];

    cell.className =
      board[i].toLowerCase();
  });
}

cells.forEach((cell, index) => {

  cell.addEventListener("click", () => {

    if (gameOver || board[index]) return;

    board[index] = player;

    renderTtt();

    const winningLine =
      checkWinner();

    if (winningLine) {

      gameOver = true;

      tttStatus.textContent =
        `Победил: ${player} 🎉`;

      winningLine.forEach(i => {

        cells[i].style.boxShadow =
          "0 0 0 2px rgba(124,92,255,.7)";

      });

      notifyTelegram(
        `🎮 Крестики-нолики: победил ${player}`
      );

      return;
    }

    if (board.every(Boolean)) {

      gameOver = true;

      tttStatus.textContent =
        "Ничья 🤝";

      notifyTelegram(
        "🎮 Крестики-нолики: ничья"
      );

      return;
    }

    player =
      player === "X"
        ? "O"
        : "X";

    tttStatus.textContent =
      `Ход: ${player}`;
  });

});

tttReset.addEventListener("click", () => {

  board = Array(9).fill("");
  player = "X";
  gameOver = false;

  cells.forEach(cell => {
    cell.style.boxShadow = "";
  });

  tttStatus.textContent = "Ход: X";

  renderTtt();
});


// ===== ГЕНЕРАТОР ЦВЕТА =====
const colorPreview =
  document.getElementById("color-preview");

const colorCode =
  document.getElementById("color-code");

const newColor =
  document.getElementById("new-color");

function randomColor() {

  const chars =
    "0123456789ABCDEF";

  let color = "#";

  for (let i = 0; i < 6; i++) {

    color += chars[
      Math.floor(
        Math.random() * 16
      )
    ];

  }

  return color;
}

newColor.addEventListener("click", () => {

  const color = randomColor();

  colorPreview.style.background =
    color;

  colorCode.textContent =
    color;

  colorPreview.textContent =
    color;
});


// ===== TODO LIST =====
const todoInput =
  document.getElementById("todo-input");

const todoAdd =
  document.getElementById("todo-add");

const todoList =
  document.getElementById("todo-list");

const todoCount =
  document.getElementById("todo-count");

let todos = [];

function renderTodos() {

  todoList.innerHTML = "";

  todos.forEach((todo, index) => {

    const li =
      document.createElement("li");

    if (todo.done) {
      li.classList.add("done");
    }

    const text =
      document.createElement("span");

    text.textContent =
      todo.text;

    text.style.cursor =
      "pointer";

    text.addEventListener("click", () => {

      todos[index].done =
        !todos[index].done;

      renderTodos();
    });

    const remove =
      document.createElement("button");

    remove.textContent = "✕";

    remove.addEventListener("click", () => {

      todos.splice(index, 1);

      renderTodos();
    });

    li.append(text, remove);

    todoList.appendChild(li);
  });

  todoCount.textContent =
    `Задач: ${todos.length}`;
}

function addTodo() {

  const text =
    todoInput.value.trim();

  if (!text) return;

  todos.push({
    text: text,
    done: false
  });

  todoInput.value = "";

  renderTodos();

  notifyTelegram(
    `📝 Новая задача в тудушке:\n«${text}»`
  );
}

todoAdd.addEventListener(
  "click",
  addTodo
);

todoInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      addTodo();
    }

  }
);


// ===== СЕКУНДОМЕР =====
const swTime =
  document.getElementById(
    "stopwatch-time"
  );

const swStart =
  document.getElementById(
    "sw-start"
  );

const swPause =
  document.getElementById(
    "sw-pause"
  );

const swReset =
  document.getElementById(
    "sw-reset"
  );

let swSeconds = 0;
let swTimer = null;

function formatTime(totalSeconds) {

  const hours =
    String(
      Math.floor(
        totalSeconds / 3600
      )
    ).padStart(2, "0");

  const minutes =
    String(
      Math.floor(
        (totalSeconds % 3600) / 60
      )
    ).padStart(2, "0");

  const seconds =
    String(
      totalSeconds % 60
    ).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function renderStopwatch() {

  swTime.textContent =
    formatTime(swSeconds);
}

swStart.addEventListener("click", () => {

  if (swTimer) return;

  swTimer = setInterval(() => {

    swSeconds++;

    renderStopwatch();

  }, 1000);
});

swPause.addEventListener("click", () => {

  clearInterval(swTimer);

  swTimer = null;
});

swReset.addEventListener("click", () => {

  clearInterval(swTimer);

  swTimer = null;

  swSeconds = 0;

  renderStopwatch();
});


// ===== СЧЁТЧИК =====
const counterValue =
  document.getElementById(
    "counter-value"
  );

let count = 0;

function renderCounter() {

  counterValue.textContent =
    count;
}

document
  .getElementById("counter-plus")
  .addEventListener("click", () => {

    count++;

    renderCounter();
  });

document
  .getElementById("counter-minus")
  .addEventListener("click", () => {

    count--;

    renderCounter();
  });

document
  .getElementById("counter-reset")
  .addEventListener("click", () => {

    count = 0;

    renderCounter();
  });


// ===== ЗВУКИ И АНИМАЦИЯ =====
document.body.classList.add(
  "page-enter"
);

let audioContext;

function uiBeep(
  frequency = 520,
  duration = 0.045
) {

  try {

    audioContext ||=
      new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value =
      frequency;

    gain.gain.setValueAtTime(
      0.035,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime +
      duration
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime +
      duration
    );

  } catch (_) {}
}

document.addEventListener(
  "click",
  event => {

    const target =
      event.target.closest(
        "button, .btn, a"
      );

    if (!target) return;

    const x =
      `${(event.clientX /
        window.innerWidth) * 100}%`;

    const y =
      `${(event.clientY /
        window.innerHeight) * 100}%`;

    document.body.style.setProperty(
      "--x",
      x
    );

    document.body.style.setProperty(
      "--y",
      y
    );

    document.body.classList.remove(
      "click-flash"
    );

    void document.body.offsetWidth;

    document.body.classList.add(
      "click-flash"
    );

    uiBeep(
      target.classList.contains(
        "primary"
      )
        ? 660
        : 500
    );
  }
);


// ===== ПЛЕЙЛИСТ =====
const playlist = [
  { title: "Joji — Back Home", file: "back-home.mp3" },
  { title: "Pixelated — Kissed", file: "kissed.mp3" },
  { title: "YUNGBLUD — Dancing In The Dark", file: "dancing-in-the-dark.mp3" },
  { title: "Gimme Love", file: "gimme-love.mp3" }
];

let trackIndex = 0;

const musicAudio =
  document.getElementById(
    "music-audio"
  );

const musicSource =
  document.getElementById(
    "music-source"
  );

const musicTitle =
  document.getElementById(
    "music-title"
  );

const musicNote =
  document.getElementById(
    "music-note"
  );

const musicPlay =
  document.getElementById(
    "music-play"
  );

const musicProgress =
  document.getElementById(
    "music-progress"
  );

const musicPrev =
  document.getElementById(
    "music-prev"
  );

const musicNext =
  document.getElementById(
    "music-next"
  );

if (musicAudio && musicPlay) {

  function loadTrack(index, autoplay) {

    const track = playlist[index];

    musicSource.src = track.file;

    musicTitle.textContent =
      track.title;

    musicNote.innerHTML =
      `Добавь файл <b>${track.file}</b> в эту папку, чтобы воспроизводить трек.`;

    musicAudio.load();

    musicProgress.style.width =
      "0%";

    musicPlay.textContent =
      "▶";

    if (autoplay) {

      musicAudio
        .play()
        .then(() => {

          musicPlay.textContent =
            "Ⅱ";

        })
        .catch(() => {

          musicPlay.textContent =
            "▶";

        });
    }
  }

  musicPlay.addEventListener(
    "click",
    () => {

      if (musicAudio.paused) {

        musicAudio
          .play()
          .then(() => {

            musicPlay.textContent =
              "Ⅱ";

          })
          .catch(() => {

            musicPlay.textContent =
              "▶";

            alert(
              `Добавь файл ${playlist[trackIndex].file} в папку сайта, чтобы включить музыку.`
            );

          });

      } else {

        musicAudio.pause();

        musicPlay.textContent =
          "▶";
      }

    }
  );

  musicAudio.addEventListener(
    "timeupdate",
    () => {

      if (!musicAudio.duration)
        return;

      musicProgress.style.width =
        `${(
          musicAudio.currentTime /
          musicAudio.duration
        ) * 100}%`;
    }
  );

  musicAudio.addEventListener(
    "ended",
    () => {

      trackIndex =
        (trackIndex + 1) %
        playlist.length;

      loadTrack(trackIndex, true);
    }
  );

  musicPrev.addEventListener(
    "click",
    () => {

      const wasPlaying =
        !musicAudio.paused;

      trackIndex =
        (trackIndex - 1 + playlist.length) %
        playlist.length;

      loadTrack(trackIndex, wasPlaying);
    }
  );

  musicNext.addEventListener(
    "click",
    () => {

      const wasPlaying =
        !musicAudio.paused;

      trackIndex =
        (trackIndex + 1) %
        playlist.length;

      loadTrack(trackIndex, wasPlaying);
    }
  );
}
