'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { apiUrl } from '@/lib/constants';

interface FilePreviewProps {
  fileId: string;
  filename: string;
  mimetype: string;
  roomCode: string;
  onClose: () => void;
}

export default function FilePreview({ fileId, filename, mimetype, roomCode, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);
  const fileUrl = `${apiUrl}/clipboard/${roomCode}/files/${fileId}`;

  // Handle escape key to close preview
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const renderPreview = () => {
    if (mimetype.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <img
            src={fileUrl}
            alt={filename}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setLoading(false)}
          />
        </div>
      );
    } else if (mimetype === 'application/pdf') {
      return (
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-full"
          title={filename}
          onLoad={() => setLoading(false)}
        />
      );
    } else if (mimetype.startsWith('text/') || mimetype === 'application/json') {
      return <TextFilePreview fileUrl={fileUrl} setLoading={setLoading} />;
    } else if (mimetype.startsWith('video/')) {
      return (
        <video
          controls
          className="max-w-full max-h-full"
          onLoadedData={() => setLoading(false)}
        >
          <source src={fileUrl} type={mimetype} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (mimetype.startsWith('audio/')) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-surface/80 p-6 rounded-lg shadow-lg">
            <p className="text-text-primary text-lg mb-4 text-center">{filename}</p>
            <audio
              controls
              className="w-full"
              onLoadedData={() => setLoading(false)}
            >
              <source src={fileUrl} type={mimetype} />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      );
    } else {
      // For unsupported file types
      setLoading(false);
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-surface/80 p-8 rounded-lg shadow-lg text-center">
            <p className="text-text-primary text-xl mb-4">Preview not available</p>
            <p className="text-text-secondary mb-6">This file type cannot be previewed.</p>
            <a
              href={`${apiUrl}/clipboard/${roomCode}/files/${fileId}?filename=${encodeURIComponent(filename)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              download={filename}
            >
              Download File
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-hover">
          <h3 className="text-lg font-medium text-text-primary truncate max-w-[calc(100%-40px)]">
            {filename}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-hover transition-colors"
            aria-label="Close preview"
          >
            <X className="h-5 w-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surface-hover flex justify-end">
          <a
            href={`${apiUrl}/clipboard/${roomCode}/files/${fileId}?filename=${encodeURIComponent(filename)}`}
            download={filename}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

// Component to handle text file preview
function TextFilePreview({ fileUrl, setLoading }: { fileUrl: string; setLoading: (loading: boolean) => void }) {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTextContent() {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file');
      } finally {
        setLoading(false);
      }
    }

    fetchTextContent();
  }, [fileUrl, setLoading]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-error/10 text-error p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <pre className="p-4 whitespace-pre-wrap break-words text-text-primary font-mono text-sm overflow-auto h-full bg-surface/30">
      {content}
    </pre>
  );
}
