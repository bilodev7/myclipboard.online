'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OtpInput from 'react-otp-input';
import axios from 'axios';
import { useSavedClipboards } from '../lib/hooks/useSavedClipboards';
import SavedClipboardsButton from './SavedClipboardsButton';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

export default function JoinClipboardCard() {
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clipboardExists, setClipboardExists] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const router = useRouter();
  const { addClipboard } = useSavedClipboards();

  // Validate room code format (6 alphanumeric characters, uppercase)
  const isValidRoomCode = (code: string): boolean => {
    const roomCodeRegex = /^[A-Z0-9]{4}$/;
    return roomCodeRegex.test(code);
  };

  const handleJoinClipboard = async (e?: React.FormEvent) => {
    // If called from a form submit, prevent default
    if (e) e.preventDefault();

    // Reset states
    setClipboardExists(true);

    // Validate room code is not empty
    if (!roomCode.trim()) {
      return;
    }

    // Validate room code format
    if (!isValidRoomCode(roomCode)) {
      return;
    }

    // Set loading state and check if clipboard exists
    setIsLoading(true);

    try {
      // Check if clipboard exists
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/clipboard/${roomCode}/exists`);

      if (response.data.exists) {
        // Save to recently visited clipboards
        addClipboard(roomCode);

        // Clipboard exists, navigate to it
        router.push(`/${roomCode}`);
      } else {
        // Clipboard doesn't exist
        setClipboardExists(false);
        setIsLoading(false);
      }
    } catch (error) {
      // Error checking clipboard existence
      setClipboardExists(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 md:p-8 rounded-xl border border-surface-hover bg-surface/50 backdrop-blur-sm shadow-lg hover:shadow-secondary/20 hover:border-secondary/50 transition-all duration-300 ease-out relative overflow-hidden group">
      {/* Background elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full animate-pulse-slow group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-secondary/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center mr-3">
            <LogIn className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary">Join Clipboard</h2>
        </div>

        <p className="text-text-secondary mb-6 pl-1">
          Enter a 4-character code to join an existing clipboard.
        </p>

        <form onSubmit={handleJoinClipboard} className="space-y-4">
          <div>
            <div className="mb-2">


              <OtpInput
                inputStyle={{
                  width: '50px',
                  height: '50px',
                }}
                onPaste={(e) => {
                  e.preventDefault()
                  const pastedValue = e.clipboardData?.getData('text') || '';
                  const filteredValue = pastedValue.replace(/[^a-zA-Z0-9]/g, '');
                  if (filteredValue.length === 4) {
                    setRoomCode(filteredValue);
                  }
                }}
                value={roomCode}
                onChange={(value: string) => {
                  setRoomCode(value);
                  setClipboardExists(true);
                  const isValid = value.length === 4 && isValidRoomCode(value);
                  setIsComplete(isValid)
                }}
                numInputs={4}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    className={`w-full h-full text-center text-xl sm:text-2xl font-mono font-bold
                      border-2 rounded-lg shadow-none outline-none
                      transition-colors duration-200 ease-in-out                      
                      ${roomCode.length === 4 && isComplete
                        ? 'border-green-500 text-green-500 bg-green-500/5'
                        : props.value
                          ? 'border-secondary text-text-primary bg-surface/80'
                          : 'border-surface-hover text-text-primary bg-surface/50 hover:border-primary/30'
                      }`}
                    key={index}
                  />
                )}
                inputType="text"
                shouldAutoFocus
                containerStyle="flex justify-center gap-2 sm:gap-3"
              />
            </div>
            {!clipboardExists && (
              <div className="mt-3 text-error text-sm flex items-center justify-center">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                <span>Clipboard does not exist.</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              disabled={isLoading || !isComplete}
              className="flex-1 py-3 px-4 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Joining...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Join Clipboard
                </>
              )}
            </button>

            <SavedClipboardsButton
              onSelectClipboard={(code) => {
                setRoomCode(code);
                setClipboardExists(true);
                setIsComplete(true);
                handleJoinClipboard();
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
