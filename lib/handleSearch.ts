"use client";

import { ReadonlyURLSearchParams } from "next/navigation";

export function handleSearchBooks(
  value: string,
  searchParams: ReadonlyURLSearchParams,
  router: ReturnType<typeof import("next/navigation").useRouter>,
  pathname: string
) {
  const sp = new URLSearchParams(searchParams);

  if (value.trim() === "") {
    sp.delete("search");
  } else {
    sp.delete("category");
    sp.delete("tipo");
    sp.set("search", value);
  }

  router.push(`${pathname}?${sp.toString()}`, { scroll: false });
}
