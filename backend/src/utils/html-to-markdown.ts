import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

type HtmlNode = {
  nodeName?: string;
  textContent?: string | null;
  parentNode?: HtmlNode | null;
  classList?: {
    contains(value: string): boolean;
  };
  getAttribute?(name: string): string | null;
  querySelector?(selector: string): HtmlNode | null;
};

function cleanFormula(value: string | null | undefined) {
  return (value ?? "")
    .replace(/^\\\(/, "")
    .replace(/\\\)$/, "")
    .replace(/^\\\[/, "")
    .replace(/\\\]$/, "")
    .replace(/\\\.\s*/g, "\\, ")
    .trim();
}

function mathMarkdown(formula: string, displayMode: boolean) {
  return displayMode ? `\n\n$$\n${formula}\n$$\n\n` : `$${formula}$`;
}

function isEscaped(value: string, index: number) {
  let slashCount = 0;

  for (let cursor = index - 1; cursor >= 0 && value[cursor] === "\\"; cursor -= 1) {
    slashCount += 1;
  }

  return slashCount % 2 === 1;
}

function escapeMathPipesInTableLine(line: string) {
  if (!line.trimStart().startsWith("|")) {
    return line;
  }

  let normalized = "";
  let inInlineMath = false;
  let inDisplayMath = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === "$" && !isEscaped(line, index)) {
      if (nextCharacter === "$") {
        inDisplayMath = !inDisplayMath;
        normalized += "$$";
        index += 1;
        continue;
      }

      inInlineMath = !inInlineMath;
      normalized += character;
      continue;
    }

    if (character === "|" && (inInlineMath || inDisplayMath) && !isEscaped(line, index)) {
      normalized += "\\vert{}";
      continue;
    }

    normalized += character;
  }

  return normalized;
}

function normalizeMarkdownMath(markdown: string) {
  return markdown
    .replace(/\\\.\s*/g, "\\, ")
    .split("\n")
    .map(escapeMathPipesInTableLine)
    .join("\n");
}

function protectRawMath(html: string) {
  const replacements: Array<{ token: string; markdown: string }> = [];
  const createToken = (markdown: string) => {
    const token = `PORTFOLIOMATH${replacements.length}TOKEN`;
    replacements.push({ token, markdown });
    return token;
  };

  const protectedHtml = html
    .replace(/\\\[([\s\S]+?)\\\]/g, (_match, formula: string) =>
      createToken(`\n\n$$\n${cleanFormula(formula)}\n$$\n\n`))
    .replace(/\$\$([\s\S]+?)\$\$/g, (_match, formula: string) =>
      createToken(`\n\n$$\n${cleanFormula(formula)}\n$$\n\n`))
    .replace(/\\\(([\s\S]+?)\\\)/g, (_match, formula: string) =>
      createToken(`$${cleanFormula(formula)}$`))
    .replace(/(?<!\\)\$(?!\$)([^\n$]+?)(?<!\\)\$/g, (_match, formula: string) =>
      createToken(`$${cleanFormula(formula)}$`));

  return { protectedHtml, replacements };
}

function isDisplayMath(node: HtmlNode) {
  const type = node.getAttribute?.("type")?.toLowerCase() ?? "";

  return type.includes("mode=display") ||
    node.classList?.contains("display") ||
    node.classList?.contains("math-display") ||
    node.parentNode?.classList?.contains("fb") ||
    node.parentNode?.classList?.contains("key-eq") ||
    node.parentNode?.classList?.contains("math-display") ||
    node.parentNode?.classList?.contains("katex-display") ||
    node.classList?.contains("katex-display") ||
    false;
}

const turndown = new TurndownService({
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  headingStyle: "atx",
  hr: "---",
  linkStyle: "inlined",
  strongDelimiter: "**"
});

turndown.use(gfm);

turndown.addRule("mathScript", {
  filter: (node: HtmlNode) => {
    const type = node.getAttribute?.("type")?.toLowerCase() ?? "";
    return node.nodeName?.toLowerCase() === "script" && type.startsWith("math/tex");
  },
  replacement: (_content: string, node: HtmlNode) => {
    const formula = cleanFormula(node.textContent);

    if (!formula) {
      return "";
    }

    return mathMarkdown(formula, isDisplayMath(node));
  }
});

turndown.addRule("katexErrorFormula", {
  filter: (node: HtmlNode) =>
    node.nodeName?.toLowerCase() === "span" &&
    (node.classList?.contains("katex-error") || false),
  replacement: (_content: string, node: HtmlNode) => {
    const formula = cleanFormula(node.textContent);

    if (!formula) {
      return "";
    }

    return mathMarkdown(formula, isDisplayMath(node));
  }
});

turndown.addRule("katexFormula", {
  filter: (node: HtmlNode) =>
    node.nodeName?.toLowerCase() === "span" &&
    (node.classList?.contains("katex") || node.classList?.contains("katex-display") || false),
  replacement: (_content: string, node: HtmlNode) => {
    const annotation = node.querySelector?.("annotation[encoding=\"application/x-tex\"]");
    const formula = cleanFormula(annotation?.textContent);

    if (!formula) {
      return "";
    }

    return mathMarkdown(formula, isDisplayMath(node));
  }
});

turndown.addRule("inlineMath", {
  filter: (node: HtmlNode) =>
    node.nodeName?.toLowerCase() === "span" &&
    (node.classList?.contains("math") || node.classList?.contains("math-inline") || false),
  replacement: (_content: string, node: HtmlNode) => {
    const formula = cleanFormula(node.textContent);

    if (!formula) {
      return "";
    }

    return mathMarkdown(formula, isDisplayMath(node));
  }
});

turndown.remove(["style", "noscript", "iframe", "object", "embed", "form", "input", "button", "svg", "canvas"]);
turndown.remove((node: HtmlNode) => {
  const type = node.getAttribute?.("type")?.toLowerCase() ?? "";
  return node.nodeName?.toLowerCase() === "script" && !type.startsWith("math/tex");
});

export function htmlToMarkdown(html: string) {
  const { protectedHtml, replacements } = protectRawMath(html);
  const markdown = replacements.reduce(
    (current, replacement) => current.split(replacement.token).join(replacement.markdown),
    turndown.turndown(protectedHtml)
  );

  return normalizeMarkdownMath(markdown)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
