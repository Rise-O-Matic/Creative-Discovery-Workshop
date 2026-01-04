import React from 'react';

interface TimerProps {
  remainingSeconds: number;
  isActive: boolean;
  isExpired: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  showControls?: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  isActive,
  isExpired,
  onStart,
  onPause,
  onResume,
  showControls = false,
}) => {
  const isWarning = remainingSeconds > 0 && remainingSeconds <= 60;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`text-6xl font-mono font-bold transition-colors ${
          isExpired ? 'text-red-600' : isWarning ? 'text-orange-500' : 'text-gray-800'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        {formatTime(remainingSeconds)}
      </div>

      {isExpired && (
        <div className="text-red-600 font-semibold text-lg" role="alert" aria-live="assertive">
          Time's Up!
        </div>
      )}

      {isWarning && !isExpired && (
        <div className="text-orange-500 font-medium" role="status" aria-live="polite">
          Less than 1 minute remaining
        </div>
      )}

      {showControls && (
        <div className="flex gap-2">
          {!isActive && !isExpired && onStart && (
            <button
              onClick={onStart}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              aria-label="Start timer"
            >
              Start
            </button>
          )}

          {isActive && onPause && (
            <button
              onClick={onPause}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              aria-label="Pause timer"
            >
              Pause
            </button>
          )}

          {!isActive && !isExpired && remainingSeconds > 0 && onResume && (
            <button
              onClick={onResume}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              aria-label="Resume timer"
            >
              Resume
            </button>
          )}
        </div>
      )}
    </div>
  );
};
