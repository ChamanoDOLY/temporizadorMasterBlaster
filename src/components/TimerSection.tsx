import React from 'react';
import Timer from './Timer';

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
      <Timer
        title="Cronômetro de Trabalho"
        time={workTime}
        isRunning={isWorkRunning}
        variant="work"
        onStart={onWorkStart}
        onPause={onWorkPause}
        onStop={onWorkStop}
        disabled={isLeisureRunning}
      />

      <Timer
        title="Cronômetro de Lazer"
        time={leisureTime}
        isRunning={isLeisureRunning}
        variant="leisure"
        onStart={onLeisureStart}
        onPause={onLeisurePause}
        onStop={onLeisureStop}
        disabled={isWorkRunning || leisureTime === 0}
      />
    </div>
  );
};

export default TimerSection;