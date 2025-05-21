"use client";

import { CommentFilters } from "@/lib/types/comments";
import { useCallback, useState } from "react";

const DEFAULT_FILTERS: CommentFilters = {
  search: "",
  platform: "all",
  sentiment: "all",
  status: "all",
};

export function useCommentFilters() {
  const [filters, setFilters] = useState<CommentFilters>(DEFAULT_FILTERS);

  const updateFilters = useCallback((updates: Partial<CommentFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}
