import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  const toastId = toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10b981',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '12px 40px 12px 16px', // Extra padding for close button
      minWidth: '250px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#10b981',
    },
    ariaProps: {
      role: 'alert',
      'aria-live': 'polite',
    },
  });
  
  // Return an object with dismiss functionality
  return {
    id: toastId,
    dismiss: () => dismissToast(toastId)
  };
};

export const showErrorToast = (message: string) => {
  const toastId = toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#ef4444',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '12px 40px 12px 16px', // Extra padding for close button
      minWidth: '250px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#ef4444',
    },
    ariaProps: {
      role: 'alert',
      'aria-live': 'polite',
    },
  });
  
  // Return an object with dismiss functionality
  return {
    id: toastId,
    dismiss: () => dismissToast(toastId)
  };
};

export const showLoadingToast = (message: string) => {
  const toastId = toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#3b82f6',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: '500',
      borderRadius: '8px',
      padding: '12px 40px 12px 16px', // Extra padding for close button
      minWidth: '250px',
      maxWidth: '400px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    iconTheme: {
      primary: '#ffffff',
      secondary: '#3b82f6',
    },
    ariaProps: {
      role: 'status',
      'aria-live': 'polite',
    },
  });
  
  // Return an object with dismiss functionality
  return {
    id: toastId,
    dismiss: () => dismissToast(toastId)
  };
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
