import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

export function AddCourseDialog() {
  return (
    <Dialog>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Add Course</Dialog.Title>
          <Dialog.Description>
            Create a new training course
          </Dialog.Description>
        </Dialog.Header>
        <div className="text-center text-gray-500 py-4">
          Add course dialog component coming soon
        </div>
        <Dialog.Footer>
          <Button variant="outline">Cancel</Button>
          <Button>Save Course</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
