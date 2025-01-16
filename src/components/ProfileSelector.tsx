import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, UserMinus, Clock } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileSelectorProps {
  selectedProfile: string | null;
  onProfileSelect: (id: string) => void;
}

const ProfileSelector = ({ selectedProfile, onProfileSelect }: ProfileSelectorProps) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simple_profiles')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddProfile = async () => {
    if (!newProfileName.trim()) {
      toast.error('Por favor, insira um nome para o perfil');
      return;
    }

    const { data, error } = await supabase
      .from('simple_profiles')
      .insert([{ name: newProfileName.trim() }])
      .select()
      .single();

    if (error) {
      toast.error('Erro ao criar perfil');
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['profiles'] });
    setNewProfileName('');
    setIsDialogOpen(false);
    toast.success('Perfil criado com sucesso!');
  };

  const handleDeleteProfile = async (profileId: string) => {
    const { error } = await supabase
      .from('simple_profiles')
      .delete()
      .eq('id', profileId);

    if (error) {
      toast.error('Erro ao excluir perfil');
      return;
    }

    if (selectedProfile === profileId) {
      onProfileSelect('');
    }

    queryClient.invalidateQueries({ queryKey: ['profiles'] });
    toast.success('Perfil excluído com sucesso!');
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedProfile || ''} 
        onValueChange={onProfileSelect}
      >
        <SelectTrigger className="w-[220px] bg-white">
          <Clock className="mr-2 h-4 w-4 text-purple-500" />
          <SelectValue placeholder="Selecione seu perfil" />
        </SelectTrigger>
        <SelectContent>
          {profiles?.map((profile) => (
            <div key={profile.id} className="flex items-center justify-between p-1">
              <SelectItem 
                value={profile.id}
                className="flex-1 hover:bg-purple-50"
              >
                {profile.name}
              </SelectItem>
              {profiles.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2 hover:bg-red-100 hover:text-red-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteProfile(profile.id);
                  }}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="hover:bg-purple-50 hover:text-purple-500"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                placeholder="Nome do perfil"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </div>
            <Button onClick={handleAddProfile} className="w-full">
              Adicionar Perfil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSelector;