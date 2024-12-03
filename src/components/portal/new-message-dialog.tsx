import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function NewMessageDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>New Message</Dialog.Title>
          <Dialog.Description>
            Create a new message
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          New message dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Send</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
