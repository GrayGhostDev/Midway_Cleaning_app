import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function AddInspectionDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Inspection</Dialog.Title>
          <Dialog.Description>
            Create a new quality inspection report
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          Add inspection dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Save Inspection</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
