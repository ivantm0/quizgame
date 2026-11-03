<script module lang="ts">
  const KEYWORDS = new Set(
    'const let var function return if else for while async await new typeof type interface extends class import export from as keyof in of true false null undefined'.split(' '),
  );
  const TOKEN = /(\/\/.*$)|('(?:\\.|[^'])*'|"(?:\\.|[^"])*"|`(?:\\.|[^`])*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/gm;

  /** Resaltado mínimo: trocea el texto en fragmentos con clase; nunca se inserta como HTML */
  export function tokenize(code: string) {
    const out: { text: string; kind: string }[] = [];
    let last = 0;
    for (const m of code.matchAll(TOKEN)) {
      if (m.index > last) out.push({ text: code.slice(last, m.index), kind: '' });
      const kind = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'num' : KEYWORDS.has(m[4]) ? 'kw' : code[m.index + m[0].length] === '(' ? 'fn' : '';
      out.push({ text: m[0], kind });
      last = m.index + m[0].length;
    }
    if (last < code.length) out.push({ text: code.slice(last), kind: '' });
    return out;
  }
</script>

<script lang="ts">
  let { code }: { code: string } = $props();
  const tokens = $derived(tokenize(code));
</script>

<pre class="code"><code>{#each tokens as t, i (i)}{#if t.kind}<span class={t.kind}>{t.text}</span>{:else}{t.text}{/if}{/each}</code></pre>

<style>
  .code {
    margin: 0;
    padding: 16px 18px;
    overflow-x: auto;
    border: 2px solid var(--ink);
    border-radius: 14px;
    background: var(--code-bg);
    color: #e9e6ff;
    font-family: var(--mono);
    font-size: 15px;
    line-height: 1.6;
    tab-size: 2;
  }
  .kw { color: #c4b5ff; }
  .str { color: #ffd23f; }
  .num { color: #ff9d7a; }
  .fn { color: #7ee2b8; }
  .com { color: #8b88a6; font-style: italic; }
</style>
