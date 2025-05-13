import toast from 'react-hot-toast';

/**
 * Utility functions for displaying toast notifications
 */

/**
 * Shows a success toast notification
 *
 * @param message The message to display
 * @param options Optional configuration options
 */
export const showSuccessToast = (message: string, options?: { duration?: number }) => {
  toast.success(message, {
    duration: options?.duration || 4000,
    style: {
      background: 'var(--success)',
      color: 'white',
    },
  });
};

/**
 * Shows an error toast notification
 *
 * @param message The message to display
 * @param options Optional configuration options
 */
export const showErrorToast = (message: string, options?: { duration?: number }) => {
  toast.error(message, {
    duration: options?.duration || 5000,
    style: {
      background: 'var(--danger)',
      color: 'white',
    },
  });
};

/**
 * Shows a warning toast notification
 *
 * @param message The message to display
 * @param options Optional configuration options
 */
export const showWarningToast = (
  message: string,
  options?: { duration?: number; icon?: string }
) => {
  toast(message, {
    duration: options?.duration || 4500,
    icon: options?.icon || '⚠️',
    style: {
      background: 'var(--warning)',
      color: 'white',
    },
  });
};

/**
 * Shows an info toast notification
 *
 * @param message The message to display
 * @param options Optional configuration options
 */
export const showInfoToast = (message: string, options?: { duration?: number; icon?: string }) => {
  toast(message, {
    duration: options?.duration || 4000,
    icon: options?.icon || 'ℹ️',
    style: {
      background: 'var(--info)',
      color: 'white',
    },
  });
};

/**
 * Shows a toast notification for future date TRM requests
 */
export const showFutureDateTRMWarning = () => {
  showWarningToast('Cannot fetch TRM for future dates. Please enter value manually.', {
    duration: 5000,
  });
};

/**
 * Shows a toast notification for TRM fetch errors
 */
export const showTRMFetchError = () => {
  showErrorToast('Failed to fetch TRM. Please enter value manually.', {
    duration: 5000,
  });
};
