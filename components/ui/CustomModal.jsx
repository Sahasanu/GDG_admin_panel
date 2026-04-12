import { useEffect } from "react";

const CustomModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon,
  className = "",
}) => {
  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Background */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-slate-900 border border-blue-900 rounded-2xl shadow-xl w-[90%] max-w-md p-6 text-white ${className}`}
      >
        {/* Icon */}
        {icon && (
          <div className="flex justify-center mb-4 text-blue-400 text-3xl">
            {icon}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg font-semibold text-center">{title}</h2>

        {/* Description */}
        <p className="text-sm text-slate-400 text-center mt-2">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;