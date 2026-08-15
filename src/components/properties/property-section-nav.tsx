export const PROPERTY_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "costs", label: "Costs" },
  { id: "location", label: "Location" },
  { id: "enquire", label: "Enquire" },
] as const;

export type PropertySectionId = (typeof PROPERTY_SECTIONS)[number]["id"];

/** In-page anchor navigation for the detail page (document order = nav order). */
export function PropertySectionNav() {
  return (
    <nav aria-label="On this page">
      <ul className="flex flex-wrap gap-2">
        {PROPERTY_SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="inline-flex min-h-11 items-center rounded-md bg-white px-4 font-bold text-ink shadow-soft hover:bg-sand"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
