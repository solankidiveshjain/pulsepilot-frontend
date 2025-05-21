import { CommentPlatform } from "@/lib/types/comments";

export interface FiltersState {
  platform?: CommentPlatform[];
  flagged?: boolean;
  unread?: boolean;
  requiresAttention?: boolean;
  archived?: boolean;
  search?: string;
  emotions?: string[];
  sentiments?: string[];
  categories?: string[];
}

export type FilterAction =
  | { type: "SET_PLATFORM"; payload: CommentPlatform[] }
  | {
      type: "TOGGLE_FLAG";
      payload: keyof Pick<FiltersState, "flagged" | "unread" | "requiresAttention" | "archived">;
    }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_EMOTIONS"; payload: string[] }
  | { type: "SET_SENTIMENTS"; payload: string[] }
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "CLEAR_ALL" };

export const initialFiltersState: FiltersState = {};

export function filtersReducer(state: FiltersState, action: FilterAction): FiltersState {
  switch (action.type) {
    case "SET_PLATFORM":
      return { ...state, platform: action.payload.length > 0 ? action.payload : undefined };

    case "TOGGLE_FLAG": {
      const key = action.payload;
      // Toggle the flag value
      return { ...state, [key]: !state[key] };
    }

    case "SET_SEARCH":
      return { ...state, search: action.payload || undefined };

    case "SET_EMOTIONS":
      return { ...state, emotions: action.payload.length > 0 ? action.payload : undefined };

    case "SET_SENTIMENTS":
      return { ...state, sentiments: action.payload.length > 0 ? action.payload : undefined };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload.length > 0 ? action.payload : undefined };

    case "CLEAR_ALL":
      return initialFiltersState;

    default:
      return state;
  }
}
