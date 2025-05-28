'use client';

import { ReactNode, useRef, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  icon,
  maxWidth = 'max-w-md'
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div
        ref={modalRef}
        className={`bg-surface border border-surface-hover rounded-xl p-6 w-full ${maxWidth} mx-4 shadow-xl animate-scaleIn relative overflow-hidden`}
      >
        {/* Background elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full"></div>

        <div className="relative">
          <div className="flex items-center mb-4 justify-center">
            {icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                {icon}
              </div>
            )}
            <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
