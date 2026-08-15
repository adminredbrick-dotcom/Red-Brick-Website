import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { routes } from "@/config/site";

interface PropertyBreadcrumbProps {
  current: string;
}

export function PropertyBreadcrumb({ current }: PropertyBreadcrumbProps) {
  const crumbs = [
    { href: routes.home.path, label: routes.home.label },
    { href: routes.properties.path, label: routes.properties.label },
  ];

  return (
    <nav aria-label="Breadcrumb" className="text-base">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-stone">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <Link
              href={crumb.href}
              className="inline-flex min-h-11 items-center rounded-sm font-bold text-brick underline-offset-4 hover:underline"
            >
              {crumb.label}
            </Link>
            <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
          </li>
        ))}
        <li aria-current="page" className="inline-flex min-h-11 items-center break-words">
          {current}
        </li>
      </ol>
    </nav>
  );
}
