import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/Timer';
import SessionHistory from '@/components/SessionHistory';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
}

interface HistoryEntry {
  type: 'work' | 'leisure';
  duration: number;
  timestamp: Date;
}

const Index = () => {
  const navigate = useNavigate();
  const [workTime, setWorkTime] = useState(0);
  const [leisureTime, setLeisureTime] = useState(0);
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isLeisureRunning, setIsLeisureRunning] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  // Buscar perfis
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simple_profiles')
        .select('*');
      
      if (error) throw error;
      return data as Profile[];
    }
  });

  // Buscar histórico
  const { data: timeRecords, refetch: refetchTimeRecords } = useQuery({
    queryKey: ['timeRecords', selectedProfile],
    queryFn: async () => {
      if (!selectedProfile) return [];
      
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('profile_id', selectedProfile)
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
    },
    enabled: !!selectedProfile
  });

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
    if (!selectedProfile) {
      toast.error('Selecione um perfil primeiro');
      return;
    }

    const { error } = await supabase
      .from('time_records')
      .insert([{ 
        type, 
        duration,
        profile_id: selectedProfile 
      }]);

    if (error) {
      toast.error('Erro ao salvar registro');
      console.error('Error saving time record:', error);
      return;
    }

    refetchTimeRecords();
  };

  const handleWorkStart = () => {
    if (!selectedProfile) {
      toast.error('Selecione um perfil primeiro');
      return;
    }
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
    if (!selectedProfile) {
      toast.error('Selecione um perfil primeiro');
      return;
    }
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

  const handleLogout = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Work & Leisure Timer</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedProfile || ''} onValueChange={setSelectedProfile}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar perfil" />
              </SelectTrigger>
              <SelectContent>
                {profiles?.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="space-y-8">
            <Timer
              title="Work Timer"
              time={workTime}
              isRunning={isWorkRunning}
              variant="work"
              onStart={handleWorkStart}
              onPause={handleWorkPause}
              onStop={handleWorkStop}
              disabled={isLeisureRunning}
            />

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold mb-2">Leisure Balance</h3>
              <p className="text-2xl font-bold text-blue-600">
                {Math.floor(leisureTime / 3600)}h {Math.floor((leisureTime % 3600) / 60)}m
              </p>
            </div>
            
            <Timer
              title="Leisure Timer"
              time={leisureTime}
              isRunning={isLeisureRunning}
              variant="leisure"
              onStart={handleLeisureStart}
              onPause={handleLeisurePause}
              onStop={handleLeisureStop}
              disabled={isWorkRunning || leisureTime === 0}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <SessionHistory entries={timeRecords || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;