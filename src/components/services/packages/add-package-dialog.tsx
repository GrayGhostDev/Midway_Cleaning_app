import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function AddPackageDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Service Package</Dialog.Title>
          <Dialog.Description>
            Create a new cleaning service package
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          Add package dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Save Package</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
