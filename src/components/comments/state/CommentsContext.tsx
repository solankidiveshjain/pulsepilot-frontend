"use client";

import { ReactNode, createContext, useContext, useReducer } from "react";
import { FilterAction, FiltersState, filtersReducer, initialFiltersState } from "./filtersReducer";
import {
  SelectionAction,
  SelectionState,
  initialSelectionState,
  selectionReducer,
} from "./selectionReducer";

// Create the filters context
type FiltersContextType = {
  filters: FiltersState;
  dispatchFilters: React.Dispatch<FilterAction>;
};

const FiltersContext = createContext<FiltersContextType | null>(null);

// Create the selection context
type SelectionContextType = {
  selection: SelectionState;
  dispatchSelection: React.Dispatch<SelectionAction>;
};

const SelectionContext = createContext<SelectionContextType | null>(null);

// Filters provider
export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, dispatchFilters] = useReducer(filtersReducer, initialFiltersState);

  return (
    <FiltersContext.Provider value={{ filters, dispatchFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

// Selection provider
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, dispatchSelection] = useReducer(selectionReducer, initialSelectionState);

  return (
    <SelectionContext.Provider value={{ selection, dispatchSelection }}>
      {children}
    </SelectionContext.Provider>
  );
}

// Combined provider for convenience
export function CommentsProvider({ children }: { children: ReactNode }) {
  return (
    <FiltersProvider>
      <SelectionProvider>{children}</SelectionProvider>
    </FiltersProvider>
  );
}

// Custom hooks for accessing the contexts
export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
