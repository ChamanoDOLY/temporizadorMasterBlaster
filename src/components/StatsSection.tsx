import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StatsSectionProps {
  selectedProfile: string | null;
}

const StatsSection = ({ selectedProfile }: StatsSectionProps) => {
  const { data: timeRecords } = useQuery({
    queryKey: ['timeRecords', selectedProfile],
    queryFn: async () => {
      if (!selectedProfile) return [];
      
      const { data, error } = await supabase
        .from('time_records')
        .select('*')
        .eq('profile_id', selectedProfile)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!selectedProfile
  });

  const chartData = React.useMemo(() => {
    if (!timeRecords) return [];

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayRecords = timeRecords.filter(record => 
        record.created_at.split('T')[0] === date
      );

      const workTime = dayRecords
        .filter(record => record.type === 'work')
        .reduce((acc, record) => acc + record.duration, 0) / 3600;

      const leisureTime = dayRecords
        .filter(record => record.type === 'leisure')
        .reduce((acc, record) => acc + record.duration, 0) / 3600;

      return {
        date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        work: Number(workTime.toFixed(2)),
        leisure: Number(leisureTime.toFixed(2))
      };
    });
  }, [timeRecords]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Últimos 7 dias</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="work" name="Trabalho" fill="#3b82f6" />
              <Bar dataKey="leisure" name="Lazer" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default StatsSection;