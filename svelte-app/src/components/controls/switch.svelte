<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { theme } from '$stores/theme';
  import Hoverable from '$components/hoverable.svelte';

  const dispatch = createEventDispatcher();

  export let label = '';
  export let state = false;
  export let disabled = false;

  const change = () => {
    state = !state;
    dispatch('change', { state });
  };
</script>

<Hoverable>
  <div class="mt-0.5 scale-[.8]">
    <label
      class="{$theme === 'light' ? 'is-light' : 'is-dark'} {disabled
        ? 'pointer-events-none !cursor-not-allowed opacity-60'
        : ' cursor-pointer'}"
    >
      <input
        type="checkbox"
        aria-label={label}
        checked={state}
        on:change={() => change()}
      />
      <div
        class="before:bg-gray-600 after:bg-gray-600 dark:before:bg-gray-400 dark:after:bg-gray-400"
      >
        <span
          class="text-gray-800 dark:text-gray-100 {$theme === 'light'
            ? 'light'
            : 'dark'}"
        />
      </div>
    </label>
  </div>
</Hoverable>

<style lang="scss">
  label {
    input {
      display: none;
      & + div {
        position: relative;
        &:before,
        &:after {
          --s: 1;
          content: '';
          position: absolute;
          height: 4px;
          top: 10px;
          width: 20px;
          transform: scaleX(var(--s));
          transition: transform 150ms ease;
        }
        &:before {
          --s: 0;
          left: 0;
          transform-origin: 0 50%;
          border-radius: 2px 0 0 2px;
        }
        &:after {
          left: 28px;
          transform-origin: 100% 50%;
          border-radius: 0 2px 2px 0;
        }
        span {
          padding-left: 56px;
          line-height: 20px;
          &:before {
            --x: 0;
            --s: 4px;
            content: '';
            position: absolute;
            left: 0;
            top: 2px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            transform: translateX(var(--x));
            transition: box-shadow 150ms ease, transform 150ms ease;
          }
          &.light:before {
            box-shadow: inset 0 0 0 var(--s) #1e293b;
          }
          &.dark:before {
            box-shadow: inset 0 0 0 var(--s) #f1f5f9;
          }
          &:not(:empty) {
            padding-left: 64px;
          }
        }
      }
      &:checked {
        & + div {
          &:before {
            --s: 1;
          }
          &:after {
            --s: 0;
          }
          span {
            &:before {
              --x: 28px;
              --s: 12px;
            }
          }
        }
      }
    }
  }
</style>
