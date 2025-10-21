/**
 * Image compression utilities
 * Compress images client-side before upload to reduce bandwidth and storage
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, where 1 is highest quality
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  format: 'image/jpeg',
};

/**
 * Compress an image file
 * Returns a new File object with compressed image
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = opts.maxWidth!;
        const maxHeight = opts.maxHeight!;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name, {
              type: opts.format!,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          opts.format,
          opts.quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Get compression stats (before/after comparison)
 */
export function getCompressionStats(originalFile: File, compressedFile: File) {
  const originalSize = originalFile.size;
  const compressedSize = compressedFile.size;
  const savedBytes = originalSize - compressedSize;
  const savedPercentage = ((savedBytes / originalSize) * 100).toFixed(1);

  return {
    originalSize,
    compressedSize,
    savedBytes,
    savedPercentage: parseFloat(savedPercentage),
    ratio: (compressedSize / originalSize).toFixed(2),
  };
}

/**
 * Compress image with automatic quality adjustment
 * Keeps reducing quality until file size is below target
 */
export async function compressImageToSize(
  file: File,
  targetSizeKB: number,
  options: CompressionOptions = {}
): Promise<File> {
  const targetBytes = targetSizeKB * 1024;
  let quality = options.quality || 0.9;
  let compressedFile = file;

  // Try up to 5 times with decreasing quality
  for (let i = 0; i < 5; i++) {
    compressedFile = await compressImage(file, {
      ...options,
      quality,
    });

    if (compressedFile.size <= targetBytes) {
      break;
    }

    // Reduce quality for next attempt
    quality -= 0.1;

    // Don't go below 0.5 quality
    if (quality < 0.5) {
      break;
    }
  }

  return compressedFile;
}

/**
 * Check if image needs compression
 */
export function shouldCompressImage(file: File, maxSizeKB: number = 500): boolean {
  return file.size > maxSizeKB * 1024;
}

/**
 * Smart compression - only compress if needed
 */
export async function smartCompressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<{ file: File; compressed: boolean; stats?: ReturnType<typeof getCompressionStats> }> {
  // Check if compression is needed
  if (!shouldCompressImage(file, 500)) {
    return { file, compressed: false };
  }

  // Compress the image
  const compressedFile = await compressImage(file, options);

  // Only use compressed version if it's actually smaller
  if (compressedFile.size < file.size) {
    const stats = getCompressionStats(file, compressedFile);
    return { file: compressedFile, compressed: true, stats };
  }

  return { file, compressed: false };
}
