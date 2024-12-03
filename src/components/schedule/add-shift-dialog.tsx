import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
}

export function AddShiftDialog({ open, onOpenChange, selectedDate }: AddShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Shift</DialogTitle>
          <DialogDescription>
            Create a new cleaning shift
          </DialogDescription>
        </DialogHeader>
        <div className="text-center text-gray-500 py-4">
          Add shift dialog component coming soon
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
