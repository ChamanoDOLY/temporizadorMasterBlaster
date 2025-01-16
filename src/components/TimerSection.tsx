import React from 'react';
import Timer from './Timer';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TimerSectionProps {
  workTime: number;
  leisureTime: number;
  isWorkRunning: boolean;
  isLeisureRunning: boolean;
  onWorkStart: () => void;
  onWorkPause: () => void;
  onWorkStop: () => void;
  onLeisureStart: () => void;
  onLeisurePause: () => void;
  onLeisureStop: () => void;
}

const TimerSection = ({
  workTime,
  leisureTime,
  isWorkRunning,
  isLeisureRunning,
  onWorkStart,
  onWorkPause,
  onWorkStop,
  onLeisureStart,
  onLeisurePause,
  onLeisureStop,
}: TimerSectionProps) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Timer
          title="Work Timer"
          time={workTime}
          isRunning={isWorkRunning}
          variant="work"
          onStart={onWorkStart}
          onPause={onWorkPause}
          onStop={onWorkStop}
          disabled={isLeisureRunning}
        />

        <Timer
          title="Leisure Timer"
          time={leisureTime}
          isRunning={isLeisureRunning}
          variant="leisure"
          onStart={onLeisureStart}
          onPause={onLeisurePause}
          onStop={onLeisureStop}
          disabled={isWorkRunning || leisureTime === 0}
        />
      </div>

      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold mb-4">Leisure Balance</h3>
        <Progress 
          value={(leisureTime / (workTime || 1)) * 100} 
          className="h-3 mb-2"
        />
        <p className="text-2xl font-bold text-purple-600">
          {Math.floor(leisureTime / 3600)}h {Math.floor((leisureTime % 3600) / 60)}m
        </p>
      </Card>
    </div>
  );
};

export default TimerSection;