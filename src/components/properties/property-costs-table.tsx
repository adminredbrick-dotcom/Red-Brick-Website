import { publishedMoney, publishedText } from "@/components/properties/listing-display";
import type { PublicListing } from "@/data/contracts/listing";
import { formatRentPcm } from "@/lib/format";

interface PropertyCostsTableProps {
  listing: PublicListing;
}

/** Semantic costs table: rent, deposit, holding deposit, bills, council tax band. */
export function PropertyCostsTable({ listing }: PropertyCostsTableProps) {
  const rows: { label: string; value: string }[] = [
    { label: "Rent", value: formatRentPcm(listing.pricing.rentPcm) },
    { label: "Deposit", value: publishedMoney(listing.pricing.deposit) },
    { label: "Holding deposit", value: publishedMoney(listing.pricing.holdingDeposit) },
    { label: "Bills included", value: listing.pricing.billsIncluded ? "Yes" : "No" },
    { label: "Council tax band", value: publishedText(listing.pricing.councilTaxBand) },
  ];

  return (
    <div
      className="overflow-x-auto rounded-lg bg-white shadow-soft"
      tabIndex={0}
      role="region"
      aria-label="Costs table (scrollable)"
    >
      <table className="w-full min-w-[18rem] border-collapse text-left">
        <caption className="px-5 pb-2 pt-4 text-left text-base text-stone">
          Costs for this {listing.demoOnly ? "illustrative example" : "property"}
        </caption>
        <thead>
          <tr className="border-b border-stone-light">
            <th scope="col" className="px-5 py-3 font-bold">
              Item
            </th>
            <th scope="col" className="px-5 py-3 text-right font-bold">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-stone-light last:border-b-0">
              <th scope="row" className="px-5 py-3 font-normal text-ink">
                {row.label}
              </th>
              <td className="px-5 py-3 text-right font-bold tabular-nums">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
