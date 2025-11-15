<script lang="ts">
  // Basic configuration for the footer
  export let licenseHref: string = '/LICENSE.txt';
  export let author: string = 'Juan Camilo Grisales Arias';
</script>

<footer aria-label="Footer" class="w-full bg-transparent text-muted-foreground">
  <div class="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-center sm:justify-between gap-3">

    <div class="text-xs sm:text-sm text-center text-muted-foreground">
      <span class="mr-2">© 2025</span>
      <span class="hidden sm:inline">· </span>
      <span class="mr-1">Desarrollado por</span>
      <a href="https://github.com/JuanCamiloGrA/" class="font-medium hover:underline" aria-label="Author profile">{author}</a>
    </div>
  </div>
</footer>
