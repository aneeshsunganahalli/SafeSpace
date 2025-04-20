interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-500/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn">
        <h3 className="text-lg font-semibold text-[#3C3C3C] mb-4">Confirm Delete</h3>
        <p className="text-sm text-[#3C3C3C] mb-6">Are you sure you want to delete this journal entry? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="py-2 px-4 text-sm bg-gray-200 text-[#3C3C3C] rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 text-sm bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}