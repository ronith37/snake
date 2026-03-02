export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(random = Math.random) {
  const mid = Math.floor(GRID_SIZE / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  const state = {
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: { x: 0, y: 0 },
    score: 0,
    gameOver: false,
    started: false,
  };
  state.food = placeFood(snake, random);
  return state;
}

export function setDirection(state, newDir) {
  if (!DIRECTIONS[newDir]) return state;
  if (OPPOSITE[state.direction] === newDir) return state;
  return { ...state, nextDirection: newDir, started: true };
}

export function tick(state, random = Math.random) {
  if (state.gameOver || !state.started) return state;

  const dir = DIRECTIONS[state.nextDirection];
  const nextHead = {
    x: state.snake[0].x + dir.x,
    y: state.snake[0].y + dir.y,
  };

  if (
    nextHead.x < 0 ||
    nextHead.x >= GRID_SIZE ||
    nextHead.y < 0 ||
    nextHead.y >= GRID_SIZE
  ) {
    return { ...state, gameOver: true };
  }

  const grows = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = grows ? state.snake : state.snake.slice(0, -1);
  if (bodyToCheck.some((cell) => cell.x === nextHead.x && cell.y === nextHead.y)) {
    return { ...state, gameOver: true };
  }

  const newSnake = [nextHead, ...state.snake];
  if (!grows) newSnake.pop();

  const newFood = grows ? placeFood(newSnake, random) : state.food;

  return {
    ...state,
    snake: newSnake,
    direction: state.nextDirection,
    food: newFood,
    score: state.score + (grows ? 1 : 0),
  };
}

export function placeFood(snake, random = Math.random) {
  const occupied = new Set(snake.map((c) => `${c.x},${c.y}`));
  const free = [];
  for (let y = 0; y < GRID_SIZE; y += 1) {
    for (let x = 0; x < GRID_SIZE; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) free.push({ x, y });
    }
  }
  if (free.length === 0) return snake[0];
  const idx = Math.floor(random() * free.length);
  return free[idx];
}
