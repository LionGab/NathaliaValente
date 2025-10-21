/**
 * Mobile-specific feature utilities
 * Web Share API, Camera, Push Notifications, etc.
 */

// ============================================
// WEB SHARE API
// ============================================

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

/**
 * Check if Web Share API is supported
 */
export const canShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Check if Web Share API supports files
 */
export const canShareFiles = (): boolean => {
  return canShare() && navigator.canShare !== undefined;
};

/**
 * Share content using Web Share API
 * @param data Share data (title, text, url, files)
 * @returns Promise<void>
 */
export const shareContent = async (data: ShareData): Promise<void> => {
  if (!canShare()) {
    throw new Error('Web Share API not supported');
  }

  try {
    // Check if files are included and if file sharing is supported
    if (data.files && data.files.length > 0) {
      if (!canShareFiles()) {
        throw new Error('File sharing not supported');
      }

      // Check if the files can be shared
      if (navigator.canShare && !navigator.canShare({ files: data.files })) {
        throw new Error('These files cannot be shared');
      }
    }

    await navigator.share(data);
  } catch (error: any) {
    // User cancelled or error occurred
    if (error.name === 'AbortError') {
      console.log('Share cancelled by user');
    } else {
      console.error('Error sharing:', error);
      throw error;
    }
  }
};

/**
 * Share a post (convenience function)
 */
export const sharePost = async (postId: string, caption: string, url?: string): Promise<void> => {
  const shareData: ShareData = {
    title: 'ClubNath - Compartilhar Post',
    text: caption.slice(0, 200), // Limit text length
    url: url || `${window.location.origin}/post/${postId}`,
  };

  await shareContent(shareData);
};

// ============================================
// CAMERA CAPTURE
// ============================================

export interface CaptureOptions {
  accept?: string; // MIME type (e.g., 'image/*', 'video/*')
  capture?: 'user' | 'environment'; // Front or back camera
  multiple?: boolean;
}

/**
 * Check if camera capture is supported
 */
export const canUseCamera = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    'mediaDevices' in navigator &&
    'getUserMedia' in navigator.mediaDevices
  );
};

/**
 * Capture image from camera using input element
 * @param options Capture options
 * @returns Promise<File[]>
 */
export const captureFromCamera = (options: CaptureOptions = {}): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = options.accept || 'image/*';
    input.capture = options.capture || 'environment';
    input.multiple = options.multiple || false;

    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;

      if (files && files.length > 0) {
        resolve(Array.from(files));
      } else {
        reject(new Error('No files selected'));
      }
    };

    input.oncancel = () => {
      reject(new Error('Camera capture cancelled'));
    };

    // Trigger the file input
    input.click();
  });
};

/**
 * Capture image with preview (using getUserMedia for more control)
 */
export const captureImageWithPreview = async (): Promise<Blob> => {
  if (!canUseCamera()) {
    throw new Error('Camera not supported');
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    });

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        reject(new Error('Canvas context not supported'));
        return;
      }

      video.srcObject = stream;
      video.play();

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop());

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to capture image'));
            }
          },
          'image/jpeg',
          0.9
        );
      };

      video.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        reject(new Error('Video error'));
      };
    });
  } catch (error) {
    console.error('Camera access denied or error:', error);
    throw error;
  }
};

// ============================================
// PUSH NOTIFICATIONS
// ============================================

/**
 * Check if push notifications are supported
 */
export const canUsePushNotifications = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

/**
 * Get current notification permission status
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!canUsePushNotifications()) {
    return 'denied';
  }
  return Notification.permission;
};

/**
 * Request push notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!canUsePushNotifications()) {
    throw new Error('Push notifications not supported');
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    throw error;
  }
};

/**
 * Subscribe to push notifications
 * @param vapidPublicKey VAPID public key from server
 */
export const subscribeToPushNotifications = async (vapidPublicKey: string): Promise<PushSubscription> => {
  if (!canUsePushNotifications()) {
    throw new Error('Push notifications not supported');
  }

  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Subscribe to push manager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    throw error;
  }
};

/**
 * Unsubscribe from push notifications
 */
export const unsubscribeFromPushNotifications = async (): Promise<boolean> => {
  if (!canUsePushNotifications()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const result = await subscription.unsubscribe();
      return result;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// ============================================
// DEVICE INFO
// ============================================

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is iOS
 */
export const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

/**
 * Check if device is Android
 */
export const isAndroid = (): boolean => {
  if (typeof window === 'undefined') return false;

  return /Android/.test(navigator.userAgent);
};

/**
 * Check if app is running as PWA (standalone mode)
 */
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Check if device supports haptic feedback (vibration)
 */
export const canVibrate = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
};

/**
 * Trigger haptic feedback
 * @param pattern Vibration pattern in milliseconds
 */
export const vibrate = (pattern: number | number[]): void => {
  if (canVibrate()) {
    navigator.vibrate(pattern);
  }
};
