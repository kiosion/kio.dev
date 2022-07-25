<script>
  import { menuOpen } from '@/stores/menu';
</script>

<button
class="nav-btn font-mono font-normal text-sm uppercase hover:font-bold" 
aria-label="Toggle nav"
on:click={() => menuOpen.set(!$menuOpen)}
>{$menuOpen ? 'Close' : 'Menu'}</button>
