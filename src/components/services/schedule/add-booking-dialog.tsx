import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function AddBookingDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Booking</Dialog.Title>
          <Dialog.Description>
            Schedule a new service booking
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          Add booking dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Save Booking</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
