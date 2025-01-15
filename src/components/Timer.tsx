import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface TimerProps {
  title: string;
  time: number;
  isRunning: boolean;
  variant: 'work' | 'leisure';
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  disabled?: boolean;
}

const Timer = ({
  title,
  time,
  isRunning,
  variant,
  onStart,
  onPause,
  onStop,
  disabled = false,
}: TimerProps) => {
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const buttonClass = variant === 'work' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">{title}</h2>
      <div className="text-4xl font-mono font-bold text-center">
        {formatTime(time)}
      </div>
      <div className="flex justify-center">
        {!isRunning ? (
          <Button
            onClick={onStart}
            className={`w-full ${buttonClass}`}
            disabled={disabled}
          >
            <Play className="mr-2 h-4 w-4" />
            {variant === 'work' ? 'Start Work' : 'Start Break'}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              onClick={onPause}
              variant="outline"
              className="flex-1"
              disabled={disabled}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button
              onClick={onStop}
              variant="outline"
              className="flex-1"
              disabled={disabled}
            >
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timer;