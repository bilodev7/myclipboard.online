/**
 * Utility functions for file handling
 */

/**
 * Check if a file can be previewed based on its MIME type
 */
export function isPreviewable(mimetype: string): boolean {
  // Image files
  if (mimetype.startsWith('image/')) {
    return true;
  }
  
  // PDF files
  if (mimetype === 'application/pdf') {
    return true;
  }
  
  // Text files
  if (
    mimetype.startsWith('text/') || 
    mimetype === 'application/json' ||
    mimetype === 'application/javascript' ||
    mimetype === 'application/typescript' ||
    mimetype === 'application/xml'
  ) {
    return true;
  }
  
  // Video files
  if (mimetype.startsWith('video/')) {
    return true;
  }
  
  // Audio files
  if (mimetype.startsWith('audio/')) {
    return true;
  }
  
  // All other file types are not previewable
  return false;
}

/**
 * Format file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / 1048576).toFixed(1) + ' MB';
}
