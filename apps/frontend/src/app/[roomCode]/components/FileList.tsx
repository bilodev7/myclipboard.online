'use client';

import { useState, useEffect } from 'react';
import { FileIcon, Image, FileText, Download, Trash2, Eye, AlertCircle } from 'lucide-react';
import { apiUrl } from '@/lib/constants';
import FilePreview from './FilePreview';
import { isPreviewable, formatFileSize } from '@/lib/utils/fileUtils';

interface FileEntry {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
  createdBy: string;
}

interface FileListProps {
  files: FileEntry[];
  onDeleteFile: (fileId: string) => void;
  roomCode: string;
}

export default function FileList({ files, onDeleteFile, roomCode }: FileListProps) {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<FileEntry | null>(null);
  
  // Clear preview if the previewed file is deleted
  useEffect(() => {
    if (previewFile && !files.some(file => file.id === previewFile.id)) {
      setPreviewFile(null);
    }
  }, [files, previewFile]);

  if (files.length === 0) {
    return null;
  }

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (mimetype.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Check if a file is previewable
  const canPreview = (file: FileEntry) => {
    return isPreviewable(file.mimetype);
  };

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sticky top-0 bg-background/90 backdrop-blur-sm py-2 z-10">
        <div className="flex-1"></div>
        <div className="flex items-center gap-2">
        </div>
      </div>

      {previewFile && (
        <FilePreview
          fileId={previewFile.id}
          filename={previewFile.filename}
          mimetype={previewFile.mimetype}
          roomCode={roomCode}
          onClose={() => setPreviewFile(null)}
        />
      )}

      <div className="space-y-2">
        {files.length === 0 ? (
          <div className="border border-dashed border-surface-hover rounded-lg flex flex-col items-center justify-center py-12 mt-4">
            <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mb-4">
              <FileIcon className="h-8 w-8 text-text-secondary/50" />
            </div>
            <p className="text-text-secondary mb-2">No files yet</p>
            <p className="text-text-secondary/70 text-sm">Upload your first file using the form above</p>
          </div>
        ) : (
          files.map((file) => (
            <div
            key={file.id}
            className={`flex items-center p-3 bg-surface/80 rounded-lg border border-surface-hover hover:border-primary/30 transition-colors relative ${canPreview(file) ? 'cursor-pointer' : ''}`}
            onClick={() => canPreview(file) ? setPreviewFile(file) : null}
          >
            <div className="mr-3">
              {getFileIcon(file.mimetype)}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-text-primary font-medium truncate">{file.filename}</p>
              <p className="text-text-tertiary text-xs">
                {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              {canPreview(file) ? (
                <button
                  onClick={() => setPreviewFile(file)}
                  className="p-1.5 text-text-secondary hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
              ) : (
                <span
                  className="p-1.5 text-text-tertiary cursor-not-allowed flex items-center"
                  title="Preview not available for this file type"
                >
                  <AlertCircle className="h-4 w-4" />
                </span>
              )}
              <a
                onClick={(e) => e.stopPropagation()}
                href={`${apiUrl}/clipboard/${roomCode}/files/${file.id}`}
                download={file.filename}
                className="p-1.5 text-text-secondary hover:text-primary rounded-md hover:bg-primary/10 transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </a>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingFile(file.id)
                }}
                className="p-1.5 text-text-secondary hover:text-error rounded-md hover:bg-error/10 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Delete confirmation */}
            {deletingFile === file.id && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                <div className="bg-surface p-4 rounded-lg shadow-lg max-w-xs w-full">
                  <h4 className="text-text-primary font-medium mb-2">Delete file?</h4>
                  <p className="text-text-secondary text-sm mb-4">This action cannot be undone.</p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setDeletingFile(null)}
                      className="px-3 py-1.5 text-text-secondary hover:text-text-primary bg-surface-hover rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // If this file is being previewed, close the preview first
                        if (previewFile && previewFile.id === file.id) {
                          setPreviewFile(null);
                        }
                        // Then delete the file
                        onDeleteFile(file.id);
                        setDeletingFile(null);
                      }}
                      className="px-3 py-1.5 text-white bg-error hover:bg-error/90 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          ))
        )}
      </div>
    </div>
  );
}
