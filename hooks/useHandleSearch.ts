"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { handleSearchBooks } from "@/lib/handleSearch";

export const useHandleSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const searchBooks = (value: string) => {
    handleSearchBooks(value, searchParams, router, pathname);
  };

  return searchBooks;
};
