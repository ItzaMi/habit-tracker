'use client';
import { Check, LineChart, Plus } from 'lucide-react';
import { FC, useState } from 'react';

import { cn } from '@/lib/utils';

import DotGraph from './dot-graph';

interface Props {
  habit: {
    occurences: string[];
    name: string;
  };
  handleHabitCheckClick: (habitName: string) => void;
}

const Habit: FC<Props> = ({ habit, handleHabitCheckClick }) => {
  const [showHabitStats, setShowHabitStats] = useState(false);

  const habitIsAlreadyChecked = habit.occurences.includes(
    new Date().toISOString().split('T')[0],
  );

  const formattedDate = (occurence: string) => {
    const date = new Date(occurence);
    const formattedDate = `${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })} of ${date.getFullYear()}`;

    return formattedDate;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex h-10 flex-row items-center justify-between gap-1 text-sm ">
        <div className="flex h-full w-full items-center rounded-lg border-2 border-slate-200 px-4">
          {habit.name}
        </div>
        <button
          onClick={() => setShowHabitStats(!showHabitStats)}
          className={cn(
            'flex h-full w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 transition-all hover:border-slate-100',
            showHabitStats ? 'bg-slate-100' : 'bg-white',
          )}
        >
          <LineChart size={12} />
        </button>
        <button
          className={cn(
            'flex h-full w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 transition-all hover:border-slate-100 disabled:pointer-events-none',
            habitIsAlreadyChecked ? 'bg-slate-200' : 'bg-white',
          )}
          onClick={() => handleHabitCheckClick(habit.name)}
          disabled={habitIsAlreadyChecked}
        >
          {habitIsAlreadyChecked ? <Check size={12} /> : <Plus size={12} />}
        </button>
      </div>
      {showHabitStats && (
        <div className="rounded-lg border-2 border-slate-200 px-4 py-2 text-xs">
          {habit.occurences.length > 0 ? (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full flex-row items-center justify-between">
                <p>Starting date: {formattedDate(habit.occurences[0])}</p>
                <p>{habit.occurences.length} days completed!</p>
              </div>
              <DotGraph occurences={habit.occurences} />
            </div>
          ) : (
            <p>
              You haven&apos;t started your habit yet!{' '}
              <span className="font-bold">Make today count!</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Habit;
