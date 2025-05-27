'use client';

import Link from 'next/link';
import Modal from '@/components/ui/Modal';

interface LoadingStateProps {
  isLoading: boolean;
  error: string | null;
}

export default function LoadingState({ isLoading, error }: LoadingStateProps) {
  if (!isLoading && !error) return null;
  
  const loadingIcon = (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-gradient-mesh rounded-xl animate-pulse"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  );

  const errorIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
  
  return isLoading ? (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="Connecting to Clipboard"
      icon={loadingIcon}
    >
      <div className="flex flex-col items-center">
        <p className="text-text-secondary text-center">
          Establishing connection and retrieving clipboard data...
        </p>
      </div>
    </Modal>
  ) : (
    <Modal
      isOpen={true}
      onClose={() => {}}
      title="Error"
      icon={errorIcon}
    >
      <div className="flex flex-col items-center">
        <p className="text-text-secondary text-center mb-6">
          {error}
        </p>
        <Link href="/">
          <button className="btn btn-primary">
            Return to Home
          </button>
        </Link>
      </div>
    </Modal>
  );
}
