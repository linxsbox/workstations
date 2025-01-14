import MarkdownIt from "markdown-it";

const mdIt = MarkdownIt({
  html: true,
  highlight: function (str, lang) {},
});

mdIt.renderer.rules.fence = function (tokens, idx, options, env, slf) {
  const token = tokens[idx];
  const content = mdIt.utils.escapeHtml(token.content);
  const lang = token.info.trim() || "plaintext";

  const codeBlockBox = `<div class="code-wrapper my-4 bg-[#2b2c2e] border border-[var(--border-secondary)] rounded-md overflow-hidden">
  <div class="code-header flex justify-between items-center px-2 py-1 border-b border-b-[var(--border-secondary)] sticky top-0">
    <div class="code-lang flex items-center gap-2">
      <span class="code-label text-base">Code Lang: </span>
      <span class="code-lang text-sm">${lang}</span>
    </div>
    <div class="code-operator flex items-center gap-2">
      <span class="code-copy md-code-copy-button text-sm cursor-pointer active:text-[var(--color-success)]">复制</span>
    </div>
  </div>

  <pre class="p-3"><code class="text-base language-${lang}">${content}</code></pre>
</div>`;

  return codeBlockBox;
};

export const renderMarkdown = async (text = "") => {
  return mdIt.render(text);
};
