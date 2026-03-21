import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  title?: string
  description?: string
}

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  isPending = false,
  title = 'Delete Entry',
  description = 'Are you sure you want to delete this entry? This action cannot be undone.'
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-surface border border-border text-text max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">{title}</DialogTitle>
          <DialogDescription className="text-muted">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-surface2 border border-border text-text px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-danger text-white px-4 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteDialog