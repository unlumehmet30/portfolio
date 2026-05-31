export function MarkdownContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-5 text-base leading-8 text-muted-foreground">
      {blocks.map((block) => {
        if (block.startsWith("# ")) {
          return (
            <h1 key={block} className="text-3xl font-semibold text-foreground">
              {block.replace("# ", "")}
            </h1>
          );
        }

        if (block.startsWith("## ")) {
          return (
            <h2 key={block} className="text-2xl font-semibold text-foreground">
              {block.replace("## ", "")}
            </h2>
          );
        }

        return <p key={block}>{block}</p>;
      })}
    </div>
  );
}
