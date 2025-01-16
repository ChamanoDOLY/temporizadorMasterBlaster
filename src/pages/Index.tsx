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
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LogOut, Clock, History } from 'lucide-react';

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

  // Fetch profiles
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

  // Fetch history
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
    setSelectedProfile(null);
    navigate('/');
  };

  // Calculate total work and leisure time
  const totalWorkTime = timeRecords?.reduce((acc, record) => 
    record.type === 'work' ? acc + record.duration : acc, 0) || 0;
  
  const totalLeisureTime = timeRecords?.reduce((acc, record) => 
    record.type === 'leisure' ? acc + record.duration : acc, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Work & Leisure Balance
            </h1>
            <div className="flex items-center gap-4">
              <Select 
                value={selectedProfile || ''} 
                onValueChange={setSelectedProfile}
              >
                <SelectTrigger className="w-[220px] bg-white">
                  <Clock className="mr-2 h-4 w-4 text-purple-500" />
                  <SelectValue placeholder="Selecione seu perfil" />
                </SelectTrigger>
                <SelectContent>
                  {profiles?.map((profile) => (
                    <SelectItem 
                      key={profile.id} 
                      value={profile.id}
                      className="hover:bg-purple-50"
                    >
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {selectedProfile ? (
            <Tabs defaultValue="timer" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="timer" className="data-[state=active]:bg-purple-100">
                  <Clock className="mr-2 h-4 w-4" />
                  Timer
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-purple-100">
                  <History className="mr-2 h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timer" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
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
              </TabsContent>
              
              <TabsContent value="history">
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
                    <h3 className="text-sm font-medium mb-2">Total Work Time</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.floor(totalWorkTime / 3600)}h {Math.floor((totalWorkTime % 3600) / 60)}m
                    </p>
                  </Card>
                  <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100">
                    <h3 className="text-sm font-medium mb-2">Total Leisure Time</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.floor(totalLeisureTime / 3600)}h {Math.floor((totalLeisureTime % 3600) / 60)}m
                    </p>
                  </Card>
                </div>
                <SessionHistory entries={timeRecords || []} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Selecione um perfil para começar a usar o timer
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;