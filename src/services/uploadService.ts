import { EvidenceItem } from '../types';

export interface UploadProgressCallback {
  (progress: number): void;
}

export const uploadService = {
  /**
   * Simulates asynchronous file upload with realistic progress steps.
   * Can be swapped out for S3 / Firebase Storage / Cloudinary later.
   */
  async uploadFile(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<EvidenceItem> {
    // Validate file size (15MB limit)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error(`File "${file.name}" exceeds the maximum 15MB upload limit.`);
    }

    // Determine type
    let itemType: EvidenceItem['type'] = 'document';
    if (file.type.startsWith('image/')) {
      itemType = 'image';
    } else if (file.type.startsWith('video/')) {
      itemType = 'video';
    }

    // Simulate progress increments
    if (onProgress) {
      onProgress(15);
      await new Promise((r) => setTimeout(r, 120));
      onProgress(45);
      await new Promise((r) => setTimeout(r, 150));
      onProgress(85);
      await new Promise((r) => setTimeout(r, 120));
      onProgress(100);
    }

    // Realistic object URL or placeholder
    const simulatedUrl = URL.createObjectURL(file);

    return {
      id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      type: itemType,
      url: simulatedUrl,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  },
};
