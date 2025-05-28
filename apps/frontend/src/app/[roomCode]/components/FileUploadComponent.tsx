'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { apiUrl } from '@/lib/constants';

interface FileUploadProps {
  roomCode: string;
  clientId: string;
  onFileUploaded: (fileEntry: any) => void;
}

export default function FileUploadComponent({ roomCode, clientId, onFileUploaded }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const response = JSON.parse(xhr.responseText);
          onFileUploaded(response);
          setIsUploading(false);
          setUploadProgress(0);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          setError('Upload failed');
          setIsUploading(false);
        }
      };
      
      xhr.onerror = () => {
        setError('Network error occurred');
        setIsUploading(false);
      };
      
      xhr.open('POST', `${apiUrl}/clipboard/${roomCode}/files`, true);
      xhr.send(formData);
      
    } catch (err: any) {
      console.error('Error uploading file:', err);
      setError(err.message || 'An unexpected error occurred');
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-6 sm:mb-8 relative">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold text-text-primary flex items-center">
          <Upload className="h-5 w-5 mr-2 text-secondary" />
          Add File
        </h2>
      </div>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-surface-hover hover:border-primary/50 hover:bg-surface/80'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center py-3">
          <Upload className="h-8 w-8 text-primary mb-2" />
          <p className="text-text-secondary mb-1">
            {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
          </p>
          <p className="text-text-tertiary text-xs">Max size: 10MB</p>
        </div>
      </div>
      
      {isUploading && (
        <div className="mt-2">
          <div className="w-full bg-surface-hover rounded-full h-2 mt-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-text-secondary mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-error/10 border border-error/30 text-error rounded-md text-sm flex items-center">
          <X className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
