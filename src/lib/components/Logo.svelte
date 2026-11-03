<script lang="ts">
  let { size = 34 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
  <path d="M10 8h44a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H28l-12 10v-10h-6a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6z" fill="#5b3df5" stroke="#1c1a2e" stroke-width="4" stroke-linejoin="round" />
  <path d="M25 22a7 7 0 1 1 10 6.3c-2 1-3 2.2-3 4.2v1" fill="none" stroke="#ffd23f" stroke-width="5" stroke-linecap="round" />
  <circle cx="32" cy="40.5" r="3" fill="#ffd23f" />
</svg>
