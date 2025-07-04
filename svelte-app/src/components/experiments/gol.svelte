<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { browser } from '$app/environment';
  import Divider from '$components/divider.svelte';
  import Tooltip from '$components/tooltips/tooltip.svelte';
  import { t } from '$lib/i18n';

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
    <h3 class="font-display pb-2 text-2xl font-bold">{$t('Game of life')}</h3>
    <p>{$t("Conway's Game of Life starting with an R-pentomino pattern.")}</p>
    <Divider></Divider>
  </header>

  <Tooltip content={running ? 'Pause' : 'Resume'}>
    <button
      class="focus-outline hover:text-orange-light/90 focus-visible:text-orange-light/90 absolute top-4 right-4 rounded-lg p-2 font-mono text-sm transition-colors hover:bg-violet-100/80 focus-visible:bg-violet-100/80 dark:hover:bg-violet-700/80 dark:focus-visible:bg-violet-700/80"
      on:click={running ? stopGame : startGame}
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="size-5"
      >
        {#if running}
          <path
            fill-rule="evenodd"
            d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
            clip-rule="evenodd"
          />
        {:else}
          <path
            fill-rule="evenodd"
            d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
            clip-rule="evenodd"
          />
        {/if}
      </svg>
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
