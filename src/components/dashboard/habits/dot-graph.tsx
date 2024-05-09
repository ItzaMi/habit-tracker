import { FC } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  occurences: string[];
}

const DotGraph: FC<Props> = ({ occurences }) => {
  const startDate = new Date(occurences[0]);
  const today = new Date();
  const totalDays =
    Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    ) + 1;
  const occurenceDates = occurences.map((occurence) =>
    new Date(occurence).toDateString(),
  );

  const days = Array.from({ length: totalDays }, (_, i) =>
    new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toDateString(),
  );

  return (
    <div className="flex w-full flex-wrap gap-0.5">
      {days.map((day, index) => (
        <div
          key={index}
          className={cn(
            'h-2 w-2',
            occurenceDates.includes(day) ? 'bg-gray-900' : 'bg-gray-400',
          )}
        />
      ))}
    </div>
  );
};

export default DotGraph;
