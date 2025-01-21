import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

export function NewMessageDialog() {
  return (
    <Dialog>
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
