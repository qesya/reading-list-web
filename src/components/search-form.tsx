"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useMemo } from "react";

export function SearchForm() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const searchTerm = useMemo(() => searchParams.get("search") || "", [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const current = searchParams.get("search") || "";
    if (term === current) return;

    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex gap-4">
      <Input
        type="search"
        placeholder="Search books..."
        aria-label="Search books"
        defaultValue={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
