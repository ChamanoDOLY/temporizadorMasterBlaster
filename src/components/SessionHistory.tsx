import React from 'react';
import { Card } from '@/components/ui/card';

interface HistoryEntry {
  type: 'work' | 'leisure';
  duration: number;
  timestamp: Date;
}

interface SessionHistoryProps {
  entries: HistoryEntry[];
}

const SessionHistory = ({ entries }: SessionHistoryProps) => {
  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="w-full max-w-4xl p-6">
      <h2 className="text-xl font-bold mb-4">Histórico da Sessão</h2>
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              entry.type === 'work' ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {entry.type === 'work' ? 'Trabalho' : 'Lazer'}
              </span>
              <span className="text-sm text-gray-600">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Duração: {formatTime(entry.duration)}
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <p className="text-center text-gray-500">Nenhum registro ainda</p>
        )}
      </div>
    </Card>
  );
};

export default SessionHistory;