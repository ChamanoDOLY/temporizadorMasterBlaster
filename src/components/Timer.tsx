import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Timer as TimerIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

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

  const progressValue = (time % 3600) / 36;

  return (
    <Card className={`p-8 space-y-6 ${
      variant === 'work' 
        ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
        : 'bg-gradient-to-r from-green-50 to-green-100'
    }`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <TimerIcon className={`h-6 w-6 ${
          variant === 'work' ? 'text-blue-500' : 'text-green-500'
        }`} />
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>

      <div className="text-6xl font-mono font-bold text-center tracking-wider">
        {formatTime(time)}
      </div>

      <Progress 
        value={progressValue} 
        className={`h-2 ${
          variant === 'work' 
            ? 'bg-blue-100 [&>div]:bg-blue-500' 
            : 'bg-green-100 [&>div]:bg-green-500'
        }`}
      />

      <div className="flex justify-center pt-2">
        {!isRunning ? (
          <Button
            onClick={onStart}
            className={`w-full transition-all text-lg py-6 ${
              variant === 'work'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-500 hover:bg-green-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled}
          >
            <Play className="mr-2 h-5 w-5" />
            {variant === 'work' ? 'Iniciar Trabalho' : 'Iniciar Pausa'}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button
              onClick={onPause}
              variant="outline"
              className={`flex-1 border-2 py-6 text-lg ${
                variant === 'work' 
                  ? 'border-blue-200 hover:bg-blue-50' 
                  : 'border-green-200 hover:bg-green-50'
              }`}
              disabled={disabled}
            >
              <Pause className="mr-2 h-5 w-5" />
              Pausar
            </Button>
            <Button
              onClick={onStop}
              variant="outline"
              className={`flex-1 border-2 py-6 text-lg ${
                variant === 'work' 
                  ? 'border-blue-200 hover:bg-blue-50' 
                  : 'border-green-200 hover:bg-green-50'
              }`}
              disabled={disabled}
            >
              <Square className="mr-2 h-5 w-5" />
              Parar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Timer;