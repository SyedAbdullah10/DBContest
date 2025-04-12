import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Check, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

// Define the base options for all toast notifications
const baseOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  icon: false,
};

// Base class with glassmorphism effect and elegant styling
const baseClass =
  "backdrop-blur-md text-lg font-poppins text-white px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center";

// Type-specific styles with vibrant colors
const typeStyles = {
  success: "border-green-400 bg-green-500/20",
  error: "border-red-400 bg-red-500/20",
  info: "border-blue-400 bg-blue-500/20",
  warn: "border-yellow-400 bg-yellow-500/20",
};

// Toast notification functions with custom icons
export const showEditedToast = () =>
  toast.info("Changes saved!", {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.info}`,
    icon: () => <Info className="text-blue-400 mr-2" size={20} />,
  });

export const showUpdatedToast = () =>
  toast.success("Updated successfully!", {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.success}`,
    icon: () => <Check className="text-green-400 mr-2" size={20} />,
  });

export const showDeletedToast = () =>
  toast.warn("Deleted successfully!", {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.warn}`,
    icon: () => <AlertTriangle className="text-yellow-400 mr-2" size={20} />,
  });

export const showAddedToast = () =>
  toast.success("Added successfully!", {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.success}`,
    icon: () => <Check className="text-green-400 mr-2" size={20} />,
  });

export const showErrorToast = (msg = "Something went wrong!") =>
  toast.error(msg, {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.error}`,
    icon: () => <AlertCircle className="text-red-400 mr-2" size={20} />,
  });

export const showInfoToast = (msg = "Info") =>
  toast.info(msg, {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.info}`,
    icon: () => <Info className="text-blue-400 mr-2" size={20} />,
  });

export const showTimerUpdatedToast = () =>
  toast.success("Timer updated successfully!", {
    ...baseOptions,
    className: `${baseClass} ${typeStyles.success}`,
    icon: () => <Check className="text-green-400 mr-2" size={20} />,
  });

// Example component to demonstrate all toast types
export default function ToastDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="w-full max-w-md space-y-6 bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          Toast Notification System
        </h1>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={showInfoToast}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            Info Toast
          </button>

          <button
            onClick={showUpdatedToast}
            className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
          >
            Success Toast
          </button>

          <button
            onClick={showErrorToast}
            className="px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
          >
            Error Toast
          </button>

          <button
            onClick={showDeletedToast}
            className="px-4 py-2 bg-yellow-500/20 border border-yellow-400 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
          >
            Warning Toast
          </button>

          <button
            onClick={showEditedToast}
            className="px-4 py-2 bg-blue-500/20 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
          >
            Edited Toast
          </button>

          <button
            onClick={showAddedToast}
            className="px-4 py-2 bg-green-500/20 border border-green-400 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
          >
            Added Toast
          </button>

          <button
            onClick={() => showInfoToast(`Custom message #${count + 1}`)}
            className="col-span-2 px-4 py-2 bg-purple-500/20 border border-purple-400 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
            onMouseUp={() => setCount(count + 1)}
          >
            Custom Message
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        newestOnTop
        closeButton={({ closeToast }) => (
          <button
            onClick={closeToast}
            className="text-white hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      />
    </div>
  );
}
