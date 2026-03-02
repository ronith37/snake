import {
  GRID_SIZE,
  createInitialState,
  setDirection,
  tick,
} from './snakeLogic.js';

const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartEl = document.getElementById('restart');
const controlsEl = document.querySelector('.controls');

const TICK_MS = 130;
let state = createInitialState();
let timerId = null;

boardEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

function toKey(cell) {
  return `${cell.x},${cell.y}`;
}

function render() {
  const snakeSet = new Set(state.snake.map(toKey));
  const foodKey = toKey(state.food);
  const fragments = [];

  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`;
      let cls = 'cell';
      if (snakeSet.has(key)) cls += ' snake';
      else if (key === foodKey) cls += ' food';
      fragments.push(`<div class="${cls}"></div>`);
    }
  }

  boardEl.innerHTML = fragments.join('');
  scoreEl.textContent = String(state.score);

  if (state.gameOver) {
    statusEl.textContent = 'Game over. Press Restart to play again.';
  } else if (!state.started) {
    statusEl.textContent = 'Use arrow keys or WASD to start.';
  } else {
    statusEl.textContent = '';
  }
}

function applyDirection(dir) {
  state = setDirection(state, dir);
  render();
}

function startLoop() {
  if (timerId !== null) return;
  timerId = window.setInterval(() => {
    state = tick(state);
    render();
    if (state.gameOver) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }, TICK_MS);
}

function restart() {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  state = createInitialState();
  render();
}

window.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    w: 'up',
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right',
  };

  const dir = keyMap[event.key];
  if (!dir) return;
  event.preventDefault();

  applyDirection(dir);
  if (!state.gameOver) startLoop();
});

controlsEl?.addEventListener('click', (event) => {
  const btn = event.target.closest('button[data-dir]');
  if (!btn) return;
  const dir = btn.getAttribute('data-dir');
  if (!dir) return;
  applyDirection(dir);
  if (!state.gameOver) startLoop();
});

restartEl.addEventListener('click', restart);

render();
