export function PageContent({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) =>
        block.startsWith('## ') ? (
          <h2 key={index} className="mt-4 text-2xl font-extrabold text-brand-navy">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={index} className="whitespace-pre-line text-lg leading-relaxed text-slate-700">
            {block}
          </p>
        ),
      )}
    </div>
  );
}
