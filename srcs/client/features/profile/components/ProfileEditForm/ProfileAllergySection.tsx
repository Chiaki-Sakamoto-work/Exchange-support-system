import { CircleAlert } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

const ALLERGY_OPTIONS = [
  '卵',
  '乳製品',
  '小麦',
  'そば',
  '落花生',
  'えび',
  'かに',
  'アーモンド',
  'くるみ',
];

type ProfileAllergySectionProps = {
  selectedAllergies: string[];
  onToggleAllergy: (allergy: string) => void;
};

export const ProfileAllergySection = ({
  selectedAllergies,
  onToggleAllergy,
}: ProfileAllergySectionProps) => {
  return (
    <Card className='min-h-0! shadow-none!'>
      <CardContent className='flex flex-col gap-1'>
        <span className='flex items-center gap-2'>
          <CircleAlert className='size-4' />
          <span>
            アレルギー <span className='text-xs'>(任意・複数選択可)</span>
          </span>
        </span>

        <span className='text-xs text-zinc-400'>
          該当するものをすべて選んでください
        </span>

        <div className='flex flex-wrap gap-2 py-2'>
          {ALLERGY_OPTIONS.map((allergy) => {
            const isSelected = selectedAllergies.includes(allergy);
            return (
              <Badge
                key={allergy}
                onClick={() => onToggleAllergy(allergy)}
                className={`
                  cursor-pointer
                  ${
                    isSelected
                      ? 'bg-red-50 border-red-400 text-red-600 shadow-sm scale-105'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300'
                  }`}
              >
                {allergy}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
