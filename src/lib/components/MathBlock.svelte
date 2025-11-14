<script lang="ts">
  import katex from "katex";

  export let expression = "";
  export let inline = false;
  export let ariaLabel: string | undefined = undefined;

  let rendered = "";

  $: renderFormula();

  function renderFormula() {
    try {
      rendered = katex.renderToString(expression, {
        displayMode: !inline,
        output: "html",
        throwOnError: false,
        trust: true,
        strict: "ignore"
      });
    } catch (error) {
      console.error("KaTeX render error", error);
      rendered = `<span class='text-destructive'>${expression}</span>`;
    }
  }
</script>

<span
  class="text-balance text-center text-muted-foreground"
  class:inline-block={inline}
  class:block={!inline}
  role="img"
  aria-label={ariaLabel ?? expression}
>
  {@html rendered}
</span>
