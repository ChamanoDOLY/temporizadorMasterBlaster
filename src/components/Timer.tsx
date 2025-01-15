import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Stop } from 'lucide-react';

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

  const bgColor = variant === 'work' ? 'bg-work' : 'bg-leisure';
  const bgColorLight = variant === 'work' ? 'bg-work-light' : 'bg-leisure-light';

  return (
    <Card className={`w-full max-w-md p-6 ${disabled ? 'opacity-70' : ''}`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className={`text-4xl font-mono font-bold mb-6 ${bgColor} bg-opacity-10 rounded-lg p-4`}>
        {formatTime(time)}
      </div>
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <Button
            onClick={onStart}
            className={`${bgColor} hover:${bgColorLight}`}
            disabled={disabled}
          >
            <Play className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
        ) : (
          <Button
            onClick={onPause}
            variant="outline"
            className="border-2"
            disabled={disabled}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pausar
          </Button>
        )}
        <Button
          onClick={onStop}
          variant="outline"
          className="border-2"
          disabled={disabled || (!isRunning && time === 0)}
        >
          <Stop className="mr-2 h-4 w-4" />
          Parar
        </Button>
      </div>
    </Card>
  );
};

export default Timer;