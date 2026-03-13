import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface AddCourseDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddCourseDialog({ open: controlledOpen, onOpenChange }: AddCourseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
          <DialogDescription>
            Create a new training course
          </DialogDescription>
        </DialogHeader>
        <div className="text-center text-gray-500 py-4">
          Add course dialog component coming soon
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
