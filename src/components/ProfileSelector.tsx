import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSelectorProps {
  selectedProfile: string | null;
  onProfileSelect: (id: string) => void;
}

const ProfileSelector = ({ selectedProfile, onProfileSelect }: ProfileSelectorProps) => {
  const { data: profiles } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('simple_profiles')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  return (
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
  );
};

export default ProfileSelector;