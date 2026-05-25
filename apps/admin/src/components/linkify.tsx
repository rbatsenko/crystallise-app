const URL_REGEX =
  /(https?:\/\/[^\s<>]+[^\s<>.,:;'"!?\)\]])|(www\.[^\s<>]+[^\s<>.,:;'"!?\)\]])/g;

export function Linkify({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(URL_REGEX);

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const raw = match[0];
    const href = raw.startsWith("www.") ? `https://${raw}` : raw;
    nodes.push(
      <a
        key={`${match.index}-${raw}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[color:var(--color-accent)] underline underline-offset-2 hover:opacity-80 break-words"
      >
        {raw}
      </a>,
    );
    last = match.index + raw.length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return <>{nodes}</>;
}
