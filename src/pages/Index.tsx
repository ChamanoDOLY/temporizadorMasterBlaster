import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LogOut, Timer as TimerIcon, ChartBar, Settings, Trophy } from 'lucide-react';
import ProfileSelector from '@/components/ProfileSelector';
import TimerSection from '@/components/TimerSection';
import StatsSection from '@/components/StatsSection';
import SettingsSection from '@/components/SettingsSection';
import GamificationSection from '@/components/GamificationSection';

const Index = () => {
  const navigate = useNavigate();
  const [workTime, setWorkTime] = useState(0);
  const [leisureTime, setLeisureTime] = useState(0);
  const [isWorkRunning, setIsWorkRunning] = useState(false);
  const [isLeisureRunning, setIsLeisureRunning] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Work & Leisure Balance
            </h1>
            <div className="flex items-center gap-4">
              <ProfileSelector 
                selectedProfile={selectedProfile}
                onProfileSelect={setSelectedProfile}
              />
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
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="timer" className="data-[state=active]:bg-purple-100">
                  <TimerIcon className="mr-2 h-4 w-4" />
                  Timer
                </TabsTrigger>
                <TabsTrigger value="stats" className="data-[state=active]:bg-purple-100">
                  <ChartBar className="mr-2 h-4 w-4" />
                  Estatísticas
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-purple-100">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </TabsTrigger>
                <TabsTrigger value="gamification" className="data-[state=active]:bg-purple-100">
                  <Trophy className="mr-2 h-4 w-4" />
                  Desafios
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timer">
                <TimerSection
                  workTime={workTime}
                  leisureTime={leisureTime}
                  isWorkRunning={isWorkRunning}
                  isLeisureRunning={isLeisureRunning}
                  onWorkStart={handleWorkStart}
                  onWorkPause={handleWorkPause}
                  onWorkStop={handleWorkStop}
                  onLeisureStart={handleLeisureStart}
                  onLeisurePause={handleLeisurePause}
                  onLeisureStop={handleLeisureStop}
                />
              </TabsContent>
              
              <TabsContent value="stats">
                <StatsSection selectedProfile={selectedProfile} />
              </TabsContent>

              <TabsContent value="settings">
                <SettingsSection selectedProfile={selectedProfile} />
              </TabsContent>

              <TabsContent value="gamification">
                <GamificationSection selectedProfile={selectedProfile} />
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