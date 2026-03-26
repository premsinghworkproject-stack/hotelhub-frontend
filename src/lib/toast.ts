import { toast, Id, ToastOptions } from 'react-toastify';
import { ToastPosition } from 'react-toastify';

// Common styles
const baseStyle = {
  position: 'top-right' as ToastPosition,
  style: {
    fontSize: '13px', // Slightly smaller but readable
    fontWeight: '500',
    borderRadius: '6px', // Smaller border radius
    padding: '10px 35px 10px 14px', // More compact padding
    minWidth: '200px', // Smaller min width
    maxWidth: '350px', // Smaller max width
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  closeButton: true, // Enable close button for positioning
};

// SUCCESS
export const showSuccessToast = (message: string) => {
  toast.success(message, baseStyle);
};

// ERROR
export const showErrorToast = (message: string) => {
  toast.error(message, {
    ...baseStyle,
    autoClose: 4000,
  });
};

// LOADING
export const showLoadingToast = (message: string) => {
  const toastId: Id = toast.loading(message, {
    ...baseStyle,
    autoClose: false, // loading should not auto close
  });

  return {
    id: toastId,
    success: (msg: string) =>
      toast.update(toastId, {
        render: msg,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      }),
    error: (msg: string) =>
      toast.update(toastId, {
        render: msg,
        type: 'error',
        isLoading: false,
        autoClose: 4000,
      }),
  };
};