// Removed ky.get import to use global fetch for tests
// import { get } from "@/lib/api/apiClient";
import { useMock } from "@/lib/api/config";
import { mockComments } from "@/lib/mock-data";

export interface FilterCounts {
  platforms: Record<string, number>;
  emotions: Record<string, number>;
  sentiments: Record<string, number>;
  categories: Record<string, number>;
  status: Record<string, number>;
}

export async function fetchFilterCounts(): Promise<FilterCounts> {
  if (useMock) {
    const counts: FilterCounts = {
      platforms: {},
      emotions: {},
      sentiments: {},
      categories: {},
      status: {},
    };
    mockComments.forEach((comment) => {
      counts.platforms[comment.platform] = (counts.platforms[comment.platform] ?? 0) + 1;
      counts.emotions[comment.emotion] = (counts.emotions[comment.emotion] ?? 0) + 1;
      counts.sentiments[comment.sentiment] = (counts.sentiments[comment.sentiment] ?? 0) + 1;
      counts.categories[comment.category] = (counts.categories[comment.category] ?? 0) + 1;
      counts.status["all"] = (counts.status["all"] ?? 0) + 1;
      if (comment.flagged) {
        counts.status["flagged"] = (counts.status["flagged"] ?? 0) + 1;
      }
      if (comment.needsAttention) {
        counts.status["attention"] = (counts.status["attention"] ?? 0) + 1;
      }
      if (comment.archived) {
        counts.status["archived"] = (counts.status["archived"] ?? 0) + 1;
      }
    });
    return counts;
  }
  // Network fetch branch using global fetch to allow test stubs
  const response = await fetch("/comments/filters/counts");
  if (!response.ok) {
    console.error("Failed to fetch filter counts:", response.status);
    throw new Error(`Error fetching filter counts: ${response.status}`);
  }
  return response.json() as Promise<FilterCounts>;
}
