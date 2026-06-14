import { createRequire } from "module";
import { promises as fs } from "fs";
import katex from "katex";

const require = createRequire(import.meta.url);
const katexCssPath = require.resolve("katex/dist/katex.min.css");

let cachedKatexCss: string | null = null;

async function getKatexCss() {
  if (cachedKatexCss) {
    return cachedKatexCss;
  }

  cachedKatexCss = await fs.readFile(katexCssPath, "utf8");
  return cachedKatexCss;
}

function renderFormula(source: string, displayMode: boolean) {
  return katex.renderToString(source.trim(), {
    displayMode,
    output: "htmlAndMathml",
    strict: false,
    throwOnError: false,
    trust: false
  });
}

function replaceMath(text: string) {
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_match, formula: string) => renderFormula(formula, true))
    .replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula: string) => renderFormula(formula, true))
    .replace(/\\\(([\s\S]+?)\\\)/g, (_match, formula: string) => renderFormula(formula, false))
    .replace(/(?<!\\)\$(?!\$)([^\n$]+?)(?<!\\)\$/g, (_match, formula: string) => renderFormula(formula, false));
}

function renderMathInTextNodes(html: string) {
  const parts = html.split(/(<[^>]+>)/g);
  let skippedTag: string | null = null;

  return parts.map((part) => {
    if (!part) {
      return part;
    }

    if (part.startsWith("<")) {
      const closingTag = part.match(/^<\/\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();

      if (closingTag && closingTag === skippedTag) {
        skippedTag = null;
        return part;
      }

      const openingTag = part.match(/^<\s*([a-z0-9-]+)/i)?.[1]?.toLowerCase();

      if (openingTag && ["script", "style", "pre", "code", "textarea"].includes(openingTag)) {
        skippedTag = openingTag;
      }

      return part;
    }

    if (skippedTag) {
      return part;
    }

    return replaceMath(part);
  }).join("");
}

function injectIntoHead(html: string, content: string) {
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${content}</head>`);
  }

  if (/<html[^>]*>/i.test(html)) {
    return html.replace(/<html([^>]*)>/i, `<html$1><head>${content}</head>`);
  }

  return `<!doctype html><html><head>${content}</head><body>${html}</body></html>`;
}

export async function renderHtmlMathFile(filePath: string) {
  const originalHtml = await fs.readFile(filePath, "utf8");
  const katexCss = await getKatexCss();
  const renderedHtml = renderMathInTextNodes(originalHtml);

  if (renderedHtml.includes("data-generated=\"portfolio-katex\"")) {
    await fs.writeFile(filePath, renderedHtml);
    return;
  }

  const style = `<style data-generated="portfolio-katex">${katexCss}</style>`;
  const meta = originalHtml.includes("charset=") ? "" : "<meta charset=\"utf-8\">";

  await fs.writeFile(filePath, injectIntoHead(renderedHtml, `${meta}${style}`));
}
