<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';

  import Divider from '$components/divider.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';

  const rows = 26,
    cols = 58,
    interval = 75;

  const createGrid = (rows: number, cols: number) => {
    const arr: boolean[][] = new Array(rows);

    for (let i = 0; i < rows; ++i) {
      arr[i] = new Array(cols).fill(false);
    }

    // Place RPentomino
    const centerRow = Math.floor(rows / 2),
      centerCol = Math.floor(cols / 2);

    arr[centerRow][centerCol] = true;
    arr[centerRow][centerCol + 1] = true;
    arr[centerRow][centerCol - 1] = true;
    arr[centerRow + 1][centerCol] = true;
    arr[centerRow - 1][centerCol + 1] = true;

    return arr;
  };

  let running = false,
    grid = createGrid(rows, cols),
    mouseDown = false;

  const toggleOnDrag = (row: number, col: number) => {
    if (mouseDown) {
      toggleCell(row, col);
    }
  };

  const handleMouseDown = () => {
    mouseDown = true;
  };

  const handleMouseUp = () => {
    mouseDown = false;
  };

  const toggleCell = (row: number, col: number) => {
    grid[row][col] = !grid[row][col];
  };

  const nextGeneration = () => {
    if (!running) {
      return;
    }

    const newGrid: boolean[][] = createGrid(rows, cols);

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const isAlive = grid[row][col],
          neighbours = countNeighbours(row, col);

        if (isAlive && (neighbours === 2 || neighbours === 3)) {
          newGrid[row][col] = true;
        } else if (!isAlive && neighbours === 3) {
          newGrid[row][col] = true;
        }
      }
    }

    grid = newGrid;

    setTimeout(() => window.requestAnimationFrame(nextGeneration), interval);
  };

  const countNeighbours = (row: number, col: number) => {
    let count = 0;

    for (let i = -1; i <= 1; ++i) {
      for (let j = -1; j <= 1; ++j) {
        if (i === 0 && j === 0) {
          continue;
        }

        const newRow = (row + i + rows) % rows,
          newCol = (col + j + cols) % cols;

        if (
          newRow >= 0 &&
          newRow < rows &&
          newCol >= 0 &&
          newCol < cols &&
          grid[newRow][newCol]
        ) {
          ++count;
        }
      }
    }

    return count;
  };

  const startGame = () => {
    if (!browser) {
      return;
    }

    running = true;
    nextGeneration();
  };

  const stopGame = () => {
    running = false;
  };

  onMount(() => {
    startGame();
  });

  onDestroy(() => {
    stopGame();
  });
</script>

<article
  class="relative my-6 flex h-fit w-full cursor-pointer flex-col items-start justify-center overflow-clip rounded-xl bg-violet-800/20 px-7 py-6 shadow-2xl shadow-violet-950/10 transition-all focus-within:shadow-violet-950/15 hover:shadow-violet-950/15 dark:bg-violet-900/20 dark:shadow-violet-500/5 dark:focus-within:shadow-violet-500/15 dark:hover:shadow-violet-500/15"
>
  <header class="w-full pb-2">
    <h3 class="pb-2 font-display text-2xl font-bold">Game of life</h3>
    <p>Conway's Game of Life starting with an R-pentomino pattern.</p>
    <Divider></Divider>
  </header>

  <Tooltip text={running ? 'Pause' : 'Resume'}>
    <button
      class="focus-outline absolute right-4 top-4 rounded-md p-2"
      on:click={running ? stopGame : startGame}
      type="button"
    >
      {#if running}
        <svg
          class="h-5 w-5 text-dark/90 hover:text-orange-light/90 focus-visible:text-orange-light/90 dark:text-light/90 hover:dark:text-orange-light/90 focus-visible:dark:text-orange-light/90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M10 4H5v16h5V4zm9 0h-5v16h5V4z" fill="currentColor"></path>
        </svg>
      {:else}
        <svg
          class="h-5 w-5 text-dark/90 hover:text-orange-light/90 focus-visible:text-orange-light/90 dark:text-light/90 hover:dark:text-orange-light/90 focus-visible:dark:text-orange-light/90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z" fill="currentColor"></path>
        </svg>
      {/if}
    </button>
  </Tooltip>

  <figure class="relative w-full overflow-clip rounded-md">
    <div
      class="grid w-fit gap-0.5"
      style="grid-template-columns: repeat({cols}, 12px);"
      role="none"
      on:mousedown={handleMouseDown}
      on:mouseup={handleMouseUp}
    >
      {#each grid as row, rowIndex}
        {#each row as cell, colIndex}
          <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
          <div
            class="h-3 w-3 rounded-sm shadow-lg {cell
              ? 'bg-violet-500/60 shadow-violet-500/30 dark:shadow-violet-500/10'
              : 'bg-transparent shadow-transparent'}"
            on:click={() => !running && toggleCell(rowIndex, colIndex)}
            on:mouseenter={() => toggleOnDrag(rowIndex, colIndex)}
            on:dragstart={(event) => event.preventDefault()}
          ></div>
        {/each}
      {/each}
    </div>
  </figure>
</article>
