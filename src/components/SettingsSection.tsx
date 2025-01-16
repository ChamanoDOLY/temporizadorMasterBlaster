import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bell, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsSectionProps {
  selectedProfile: string | null;
}

const SettingsSection = ({ selectedProfile }: SettingsSectionProps) => {
  const [notifications, setNotifications] = React.useState(true);
  const [sound, setSound] = React.useState(true);
  const [workLeisureRatio, setWorkLeisureRatio] = React.useState(50);

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Configurações</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações</Label>
              <div className="text-sm text-gray-500">
                Receber alertas de início/fim dos timers
              </div>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sons</Label>
              <div className="text-sm text-gray-500">
                Ativar sons de notificação
              </div>
            </div>
            <Switch
              checked={sound}
              onCheckedChange={setSound}
            />
          </div>

          <div className="space-y-2">
            <Label>Proporção Trabalho/Lazer</Label>
            <div className="text-sm text-gray-500 mb-4">
              Ajuste a proporção de tempo de lazer ganho
            </div>
            <Slider
              value={[workLeisureRatio]}
              onValueChange={(value) => setWorkLeisureRatio(value[0])}
              max={100}
              step={10}
            />
            <div className="text-sm text-center mt-2">
              {workLeisureRatio}% trabalho / {100 - workLeisureRatio}% lazer
            </div>
          </div>

          <Button 
            onClick={handleSaveSettings}
            className="w-full"
            disabled={!selectedProfile}
          >
            Salvar Configurações
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsSection;