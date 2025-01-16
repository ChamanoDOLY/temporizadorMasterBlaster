import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Target } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  progress: number;
  reward: string;
}

interface GamificationSectionProps {
  selectedProfile: string | null;
}

const GamificationSection = ({ selectedProfile }: GamificationSectionProps) => {
  const challenges: Challenge[] = [
    {
      id: 1,
      title: "Mestre do Foco",
      description: "Complete 4 horas de trabalho em um dia",
      progress: 75,
      reward: "🏆 Troféu Dourado"
    },
    {
      id: 2,
      title: "Equilibrista",
      description: "Mantenha uma proporção trabalho/lazer ideal por 5 dias",
      progress: 40,
      reward: "🌟 Estrela de Ouro"
    },
    {
      id: 3,
      title: "Maratonista",
      description: "Use o timer por 7 dias consecutivos",
      progress: 60,
      reward: "🎯 Emblema de Consistência"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold">Desafios</h3>
        </div>

        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{challenge.title}</h4>
                  <p className="text-sm text-gray-500">{challenge.description}</p>
                </div>
                <div className="text-sm font-medium text-purple-600">
                  {challenge.reward}
                </div>
              </div>
              <Progress value={challenge.progress} className="h-2" />
              <div className="text-sm text-right text-gray-500">
                {challenge.progress}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="h-6 w-6 text-purple-500" />
          <h3 className="text-lg font-semibold">Conquistas</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-lg flex items-center justify-center ${
                i < 2 ? 'bg-purple-100' : 'bg-gray-100'
              }`}
            >
              {i < 2 ? (
                <Trophy className={`h-8 w-8 ${
                  i === 0 ? 'text-yellow-500' : 'text-purple-500'
                }`} />
              ) : (
                <div className="text-2xl opacity-30">?</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default GamificationSection;