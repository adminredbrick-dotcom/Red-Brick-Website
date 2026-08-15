interface PageIntroProps {
  eyebrow?: string;
  heading: string;
  lede?: string;
}

/** Standard page opening: eyebrow, h1 and an optional lede paragraph. */
export function PageIntro({ eyebrow, heading, lede }: PageIntroProps) {
  return (
    <section className="container-rb pb-10 pt-12 md:pb-14 md:pt-20">
      {eyebrow ? <p className="text-eyebrow text-brick">{eyebrow}</p> : null}
      <h1 className="text-section mt-3 max-w-3xl">{heading}</h1>
      {lede ? <p className="measure-body mt-5 text-lg text-stone md:text-xl">{lede}</p> : null}
    </section>
  );
}
