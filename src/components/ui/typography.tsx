export function TypographyH1({ text }: { text: string }) {
  return <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance m-auto">{text}</h1>;
}

export function TypographyH2({ text }: { text: string }) {
  return <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">{text}</h2>;
}

export function TypographyH3({ text }: { text: string }) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{text}</h3>;
}

export function TypographyH4({ text }: { text: string }) {
  return <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{text}</h4>;
}

export function TypographyP({ text, align = 'text-center' }: { text: string; align?: 'text-center' | 'text-left' }) {
  return (
    <p className={`leading-7 ${align} [&:not(:first-child)]:mt-6 max-w-md w-full break-words whitespace-normal`}>
      {text}
    </p>
  );
}
