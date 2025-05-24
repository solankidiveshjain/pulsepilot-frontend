export interface FilterCounts {
  platforms: Record<string, number>;
  emotions: Record<string, number>;
  sentiments: Record<string, number>;
  categories: Record<string, number>;
  status: Record<string, number>;
}

export async function fetchFilterCounts(): Promise<FilterCounts> {
  const res = await fetch('/api/comments/filters/counts');
  if (!res.ok) {
    throw new Error('Failed to fetch filter counts');
  }
  return res.json();
}
