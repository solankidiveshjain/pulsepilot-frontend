"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

export interface CommentsLayoutProps {
  children: ReactNode;
  sidebarContent: ReactNode;
  rightPanelContent: ReactNode;
  rightPanelVisible: boolean;
  isMobileSidebarOpen?: boolean;
  onCloseMobileSidebar?: () => void;
  onOpenMobileSidebar?: () => void;
  filters: Record<string, string[]>;
  onFilterChange: (filters: Record<string, string[]>) => void;
  metrics: CommentMetrics;
  selectedEmotions: string[];
  selectedSentiments: string[];
  selectedCategories: string[];
  selectedCommentIds: string[];
  onEmotionChange: (emotions: string[]) => void;
  onSentimentChange: (sentiments: string[]) => void;
  onCategoryChange: (categories: string[]) => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

/**
 * Layout component for the comments interface
 * Ensures proper spacing and responsive behavior
 */
export function CommentsLayout({
  children,
  sidebarContent,
  rightPanelContent,
  rightPanelVisible,
  isMobileSidebarOpen = false,
  onCloseMobileSidebar,
  onOpenMobileSidebar,
}: CommentsLayoutProps) {
  return (
    <div className="relative mx-auto h-full max-w-[1440px] px-6">
      {/* Desktop 3-column grid layout */}
      <div className="grid hidden h-full grid-cols-[280px_minmax(0,1fr)_360px] gap-6 lg:grid">
        {/* Left column - Filters */}
        <div className="border-r border-border bg-card">{sidebarContent}</div>

        {/* Main content area - Center column */}
        <main className="flex flex-col overflow-hidden bg-background">{children}</main>

        {/* Right Panel - Post details */}
        {rightPanelVisible ? (
          <aside className="hidden border-l border-border bg-card lg:block">
            <div className="h-full overflow-hidden">{rightPanelContent}</div>
          </aside>
        ) : (
          <div className="hidden lg:block"></div> // Empty column to maintain grid layout
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex h-full flex-col lg:hidden">
        <main className="flex flex-1 flex-col overflow-hidden bg-background">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileSidebar}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-border bg-card lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-border p-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={onCloseMobileSidebar}
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Right Panel */}
      <AnimatePresence>
        {rightPanelVisible && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                // Extract onClose from rightPanelContent if possible
                const panelContent = rightPanelContent as any;
                if (panelContent?.props?.onClose) {
                  panelContent.props.onClose();
                }
              }}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 block max-h-[80vh] overflow-auto rounded-t-xl border-t border-border bg-card shadow-lg lg:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {rightPanelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
