import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface AddInspectionDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddInspectionDialog({ open: controlledOpen, onOpenChange }: AddInspectionDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inspection</DialogTitle>
          <DialogDescription>
            Create a new quality inspection report
          </DialogDescription>
        </DialogHeader>
        <div className="text-center text-gray-500 py-4">
          Add inspection dialog component coming soon
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Inspection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
