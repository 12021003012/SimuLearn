"use client";

import { useMemo } from "react";
import katex from "katex";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Advanced Markdown + LaTeX renderer.
 * Supports: bold, italic, code, headings (h2/h3), lists, blockquotes,
 * and full LaTeX math via KaTeX (both $inline$ and $$block$$ delimiters).
 */
export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  return (
    <div
      className={`markdown-content text-surface-300 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderLatex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false,
      macros: {
        "\\R": "\\mathbb{R}",
        "\\N": "\\mathbb{N}",
        "\\Z": "\\mathbb{Z}",
      },
    });
  } catch {
    // Fallback: show as monospace code block
    const cleaned = tex
      .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "($1)/($2)")
      .replace(/\\text\{(.*?)\}/g, "$1")
      .replace(/\\sqrt\{(.*?)\}/g, "√($1)")
      .replace(/\\(alpha|beta|gamma|delta|theta|omega|pi|sigma|mu|lambda|epsilon|phi|psi|rho|tau|eta|nu|xi|zeta)/g, (_, g) => {
        const greek: Record<string, string> = { alpha: "α", beta: "β", gamma: "γ", delta: "δ", theta: "θ", omega: "ω", pi: "π", sigma: "σ", mu: "μ", lambda: "λ", epsilon: "ε", phi: "φ", psi: "ψ", rho: "ρ", tau: "τ", eta: "η", nu: "ν", xi: "ξ", zeta: "ζ" };
        return greek[g] || g;
      })
      .replace(/\\/g, "");
    if (displayMode) {
      return `<div class="my-4 p-3 bg-surface-200/50 rounded-lg text-center text-brand-300 font-mono overflow-x-auto text-sm">${cleaned}</div>`;
    }
    return `<span class="text-brand-300 font-mono">${cleaned}</span>`;
  }
}

function renderMarkdown(content: string): string {
  // Sanitize HTML tags (XSS prevention)
  let text = content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");

  // Process LaTeX FIRST (before other transformations that might break delimiters)
  // Block math: $$...$$
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => renderLatex(tex, true));

  // Inline math: $...$  (but not currency like $5)
  text = text.replace(/\$([^\$\n]+?)\$/g, (_match, tex) => {
    // Skip if it looks like currency (just a number)
    if (/^\d+(\.\d+)?$/.test(tex.trim())) return _match;
    return renderLatex(tex, false);
  });

  // Also handle \[ ... \] and \( ... \) delimiters
  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (_match, tex) => renderLatex(tex, true));
  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (_match, tex) => renderLatex(tex, false));

  // Handle standalone equations that aren't wrapped in $ delimiters
  // Common patterns: F = ma, E = mc^2, etc. with LaTeX commands
  text = text.replace(/(?:^|\n)([A-Z_a-z][^=\n]*?=\s*\\(?:frac|sqrt|int|sum|prod|lim)[^\n]+)/gm, (_match, eq) => {
    return "\n" + renderLatex(eq.trim(), true);
  });

  // Headings
  text = text.replace(/^#### (.*?)$/gm, '<h4 class="text-base font-semibold text-white mt-4 mb-2">$1</h4>');
  text = text.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-white mt-5 mb-2">$1</h3>');
  text = text.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>');
  text = text.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-white mt-6 mb-4">$1</h1>');

  // Bold and italic
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-white"><em>$1</em></strong>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Inline code
  text = text.replace(/`(.*?)`/g, '<code class="bg-surface-200 px-1.5 py-0.5 rounded text-brand-300 text-sm font-mono">$1</code>');

  // Blockquotes
  text = text.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-brand-500/50 pl-4 py-1 my-3 text-surface-300 italic">$1</blockquote>');

  // Unordered lists
  text = text.replace(/^[\-\*•] (.*?)$/gm, '<li class="ml-4 text-surface-300 list-disc mb-1">$1</li>');

  // Ordered lists
  text = text.replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 text-surface-300 list-decimal mb-1">$1</li>');

  // Wrap consecutive <li> in <ul> or <ol>
  text = text.replace(/((?:<li class="ml-4 text-surface-300 list-disc[^"]*">.*?<\/li>\n?)+)/g, '<ul class="my-3 space-y-1">$1</ul>');
  text = text.replace(/((?:<li class="ml-4 text-surface-300 list-decimal[^"]*">.*?<\/li>\n?)+)/g, '<ol class="my-3 space-y-1">$1</ol>');

  // Horizontal rules
  text = text.replace(/^---$/gm, '<hr class="my-6 border-surface-200"/>');

  // Paragraphs (double newlines)
  text = text.replace(/\n\n/g, '</p><p class="text-surface-300 leading-relaxed mb-3">');
  text = text.replace(/\n/g, "<br/>");

  return `<p class="text-surface-300 leading-relaxed mb-3">${text}</p>`;
}
