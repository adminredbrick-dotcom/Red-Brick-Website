import styles from "./street-line.module.css";

/**
 * Candidate 02 — a terrace roofline drawn as one continuous stroke.
 * Purely decorative (aria-hidden); it marks the chapter change from the
 * house story to the practical, local half of the page.
 */
export function StreetLine({ className }: { className?: string }) {
  const classes = [styles.street, className].filter(Boolean).join(" ");
  // A row of terraced houses: pitched roofs, a chimney on every other ridge.
  const d = [
    "M0 72",
    "H40 L88 24 L100 24 V14 H112 V24 L136 48",
    "L184 24 L232 60",
    "L280 24 L292 24 V12 H304 V24 L328 48",
    "L376 24 L424 60",
    "L472 24 L484 24 V14 H496 V24 L520 48",
    "L568 24 L616 60",
    "L664 24 L676 24 V12 H688 V24 L712 48",
    "L760 24 L808 60",
    "L856 24 L868 24 V14 H880 V24 L904 48",
    "L952 24 L1000 60",
    "L1048 24 L1060 24 V12 H1072 V24 L1096 48",
    "L1144 24 L1192 72",
    "H1200",
  ].join(" ");

  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={classes}
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
