import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, Coffee } from 'lucide-react';

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
    <Card className="w-full p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Histórico da Sessão</h2>
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all hover:scale-[1.01] ${
              entry.type === 'work' 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                : 'bg-gradient-to-r from-green-50 to-green-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {entry.type === 'work' ? (
                  <Clock className="h-4 w-4 text-blue-500" />
                ) : (
                  <Coffee className="h-4 w-4 text-green-500" />
                )}
                <span className="font-medium">
                  {entry.type === 'work' ? 'Trabalho' : 'Lazer'}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {formatTimestamp(entry.timestamp)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Duração: {formatTime(entry.duration)}
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum registro ainda</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default SessionHistory;