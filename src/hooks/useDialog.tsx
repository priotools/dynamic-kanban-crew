
import { useState, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openDialog = (dialogContent: ReactNode) => {
    setContent(dialogContent);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const DialogComponent = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        {content}
      </DialogContent>
    </Dialog>
  );

  return { openDialog, closeDialog, DialogComponent };
}
