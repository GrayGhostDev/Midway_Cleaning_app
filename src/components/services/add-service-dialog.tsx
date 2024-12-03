import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function AddServiceDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Service</Dialog.Title>
          <Dialog.Description>
            Create a new cleaning service
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          Add service dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Save Service</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
