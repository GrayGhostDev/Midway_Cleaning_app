import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface NewMessageDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewMessageDialog({ open: controlledOpen, onOpenChange }: NewMessageDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Create a new message
          </DialogDescription>
        </DialogHeader>
        <div className="text-center text-gray-500 py-4">
          New message dialog component coming soon
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
