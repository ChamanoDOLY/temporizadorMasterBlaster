import React, { useState, useEffect } from 'react';
import Timer from '@/components/Timer';
import SessionHistory from '@/components/SessionHistory';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface HistoryEntry {
  type: 'work' | 'leisure';
  duration: number;
  timestamp: Date;
}

const Index = () => {
  const [workTime, setWorkTime] = useState(0);
  const [leisureTime, setLeisureTime] = useState(0);
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isLeisureRunning, setIsLeisureRunning] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const { data: timeRecords, refetch: refetchTimeRecords } = useQuery({
    queryKey: ['timeRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao carregar histórico');
        throw error;
      }

      return data.map(record => ({
        type: record.type as 'work' | 'leisure',
        duration: record.duration,
        timestamp: new Date(record.created_at)
      }));
    }
  });

  useEffect(() => {
    if (timeRecords) {
      setHistory(timeRecords);
    }
  }, [timeRecords]);

  useEffect(() => {
    let interval: number;

    if (isWorkRunning) {
      interval = window.setInterval(() => {
        setWorkTime((prev) => prev + 1);
      }, 1000);
    } else if (isLeisureRunning && leisureTime > 0) {
      interval = window.setInterval(() => {
        setLeisureTime((prev) => {
          if (prev <= 1) {
            setIsLeisureRunning(false);
            toast.info('Tempo de lazer esgotado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWorkRunning, isLeisureRunning]);

  const saveTimeRecord = async (type: 'work' | 'leisure', duration: number) => {
    const { error } = await supabase
      .from('time_records')
      .insert([{ type, duration }]);

    if (error) {
      toast.error('Erro ao salvar registro');
      console.error('Error saving time record:', error);
      return;
    }

    refetchTimeRecords();
  };

  const handleWorkStart = () => {
    setIsWorkRunning(true);
    toast.success('Cronômetro de trabalho iniciado');
  };

  const handleWorkPause = () => {
    setIsWorkRunning(false);
    toast.info('Cronômetro de trabalho pausado');
  };

  const handleWorkStop = async () => {
    setIsWorkRunning(false);
    if (workTime > 0) {
      await saveTimeRecord('work', workTime);
      setLeisureTime((prev) => prev + Math.floor(workTime / 2));
      toast.success(`+${Math.floor(workTime / 2)} segundos de lazer adicionados!`);
    }
    setWorkTime(0);
  };

  const handleLeisureStart = () => {
    if (leisureTime > 0) {
      setIsLeisureRunning(true);
      toast.success('Cronômetro de lazer iniciado');
    }
  };

  const handleLeisurePause = () => {
    setIsLeisureRunning(false);
    toast.info('Cronômetro de lazer pausado');
  };

  const handleLeisureStop = async () => {
    if (isLeisureRunning && leisureTime > 0) {
      await saveTimeRecord('leisure', leisureTime);
    }
    setIsLeisureRunning(false);
    setLeisureTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Gerenciador de Tempo Trabalho/Lazer
          </h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Sair
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Timer
            title="Tempo de Trabalho"
            time={workTime}
            isRunning={isWorkRunning}
            variant="work"
            onStart={handleWorkStart}
            onPause={handleWorkPause}
            onStop={handleWorkStop}
            disabled={isLeisureRunning}
          />
          
          <Timer
            title="Tempo de Lazer"
            time={leisureTime}
            isRunning={isLeisureRunning}
            variant="leisure"
            onStart={handleLeisureStart}
            onPause={handleLeisurePause}
            onStop={handleLeisureStop}
            disabled={isWorkRunning || leisureTime === 0}
          />
        </div>

        <SessionHistory entries={history} />
      </div>
    </div>
  );
};

export default Index;