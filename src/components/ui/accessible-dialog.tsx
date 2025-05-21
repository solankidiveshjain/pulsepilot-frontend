import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation";
import { useScreenReaderAnnouncement } from "@/hooks/use-screen-reader-announcement";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

interface AccessibleDialogProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AccessibleDialog({
  title,
  description,
  children,
  open,
  onOpenChange,
}: AccessibleDialogProps) {
  const focusTrapRef = useFocusTrap(open);
  const { announceToScreenReader, LiveRegion } = useScreenReaderAnnouncement({
    politeness: "assertive",
  });

  useKeyboardNavigation({
    onEscape: () => onOpenChange?.(false),
    enabled: open,
  });

  React.useEffect(() => {
    if (open) {
      announceToScreenReader(`${title} dialog opened. ${description || ""}`);
    }
  }, [open, title, description, announceToScreenReader]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          ref={focusTrapRef}
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
          aria-describedby={description ? "dialog-description" : undefined}
        >
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogPrimitive.Title
              id="dialog-title"
              className="text-lg font-semibold leading-none tracking-tight"
            >
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description
                id="dialog-description"
                className="text-sm text-muted-foreground"
              >
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          {children}
          <DialogPrimitive.Close className="ring-offset-background focus:ring-offset-2 absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
      <LiveRegion />
    </DialogPrimitive.Root>
  );
}
