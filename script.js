document.addEventListener("DOMContentLoaded", () => {
  const boardSize = 8; // Tamaño del tablero
  const mineCount = 10; // Número de minas
  const board = document.getElementById("board");
  const resetButton = document.getElementById("reset");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  let cells = [];
  let mines = [];
  let timer;
  let timeElapsed = 0;
  let score = 0;

  // Crear el tablero
  function createBoard() {
    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;
    cells = [];
    mines = [];
    board.innerHTML = "";
    timeElapsed = 0;
    updateTimer();
    clearInterval(timer);
    startTimer();

    // Generar minas
    while (mines.length < mineCount) {
      const mine = Math.floor(Math.random() * boardSize * boardSize);
      if (!mines.includes(mine)) {
        mines.push(mine);
      }
    }

    // Crear celdas
    for (let i = 0; i < boardSize * boardSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", handleClick);
      cell.addEventListener("contextmenu", handleRightClick);
      board.appendChild(cell);
      cells.push(cell);
    }
  }

  // Iniciar temporizador
  function startTimer() {
    timer = setInterval(() => {
      timeElapsed++;
      updateTimer();
    }, 1000);
  }

  // Actualizar contador de tiempo
  function updateTimer() {
    timerDisplay.textContent = `Tiempo: ${timeElapsed}s`;
  }

  // Manejar clic izquierdo
  function handleClick(e) {
    const index = parseInt(e.target.dataset.index);
    const cell = cells[index];

    if (mines.includes(index)) {
      revealMines();
      setTimeout(() => alert("¡Perdiste!"), 500);
      clearInterval(timer);
    } else {
      revealCell(index);
      checkVictory();
    }
  }

  // Manejar clic derecho (para marcar banderas)
  function handleRightClick(e) {
    e.preventDefault();
    e.target.classList.toggle("flag");
  }

  // Revelar una celda
  function revealCell(index) {
    const cell = cells[index];
    if (!cell || cell.classList.contains("revealed")) return;

    cell.classList.add("revealed");
    const adjacentMines = countAdjacentMines(index);
    if (adjacentMines > 0) {
      cell.textContent = adjacentMines;
    } else {
      const neighbors = getNeighbors(index);
      neighbors.forEach(revealCell);
    }
  }

  // Contar minas adyacentes
  function countAdjacentMines(index) {
    return getNeighbors(index).filter((i) => mines.includes(i)).length;
  }

  // Obtener vecinos de una celda
  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;

    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        if (r === 0 && c === 0) continue;
        const neighborRow = row + r;
        const neighborCol = col + c;
        if (
          neighborRow >= 0 &&
          neighborRow < boardSize &&
          neighborCol >= 0 &&
          neighborCol < boardSize
        ) {
          neighbors.push(neighborRow * boardSize + neighborCol);
        }
      }
    }
    return neighbors;
  }

  // Revelar todas las minas
  function revealMines() {
    mines.forEach((index) => {
      cells[index].classList.add("mine");
    });
  }

  // Verificar si ganaste
  function checkVictory() {
    const revealedCells = cells.filter(cell => cell.classList.contains("revealed"));
    if (revealedCells.length === boardSize * boardSize - mineCount) {
      alert("¡Ganaste!");
      score++;
      updateScore();
      clearInterval(timer);
    }
  }

  // Actualizar marcador de victorias
  function updateScore() {
    scoreDisplay.textContent = `Victorias: ${score}`;
  }

  // Reiniciar juego
  resetButton.addEventListener("click", createBoard);

  createBoard();
});
