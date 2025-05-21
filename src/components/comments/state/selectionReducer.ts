export interface SelectionState {
  selectedIds: string[];
}

export type SelectionAction =
  | { type: "SELECT_COMMENT"; payload: string }
  | { type: "UNSELECT_COMMENT"; payload: string }
  | { type: "TOGGLE_COMMENT"; payload: string }
  | { type: "SELECT_MULTIPLE"; payload: string[] }
  | { type: "CLEAR_SELECTION" };

export const initialSelectionState: SelectionState = {
  selectedIds: [],
};

export function selectionReducer(state: SelectionState, action: SelectionAction): SelectionState {
  switch (action.type) {
    case "SELECT_COMMENT":
      // Only add if not already selected
      if (state.selectedIds.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        selectedIds: [...state.selectedIds, action.payload],
      };

    case "UNSELECT_COMMENT":
      return {
        ...state,
        selectedIds: state.selectedIds.filter((id) => id !== action.payload),
      };

    case "TOGGLE_COMMENT":
      return state.selectedIds.includes(action.payload)
        ? selectionReducer(state, { type: "UNSELECT_COMMENT", payload: action.payload })
        : selectionReducer(state, { type: "SELECT_COMMENT", payload: action.payload });

    case "SELECT_MULTIPLE":
      // Only add IDs that aren't already selected
      const newIds = action.payload.filter((id) => !state.selectedIds.includes(id));
      if (newIds.length === 0) {
        return state;
      }
      return {
        ...state,
        selectedIds: [...state.selectedIds, ...newIds],
      };

    case "CLEAR_SELECTION":
      return initialSelectionState;

    default:
      return state;
  }
}
