'use client';
import { Check, Info, Plus, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

import { cn } from '@/lib/utils';

import DotGraph from './dot-graph';

interface Props {
  habit: {
    occurences: string[];
    name: string;
    created_at: string;
  };
  handleHabitCheckClick: (habitName: string) => void;
  handleHabitDeleteClick: (habitName: string) => void;
}

const Habit: FC<Props> = ({
  habit,
  handleHabitCheckClick,
  handleHabitDeleteClick,
}) => {
  const [showHabitStats, setShowHabitStats] = useState(false);

  const habitIsAlreadyChecked = habit.occurences.includes(
    new Date().toISOString().split('T')[0],
  );

  const formattedDate = (occurence: string) => {
    const date = new Date(occurence);
    const formattedDate = `${date.getDate()} of ${date.toLocaleString('default', { month: 'long' })} of ${date.getFullYear()}`;

    return formattedDate;
  };

  function isWithin48Hours(created_at: string): boolean {
    const timeDifference =
      new Date().getTime() - new Date(created_at).getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    return hoursDifference <= 48;
  }

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
          <Info size={12} />
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
          {habit.occurences.length > 0 && (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full flex-row items-center justify-between">
                <p>Starting date: {formattedDate(habit.occurences[0])}</p>
                <p>{habit.occurences.length} days completed!</p>
              </div>
              <DotGraph occurences={habit.occurences} />
            </div>
          )}
          {habit.occurences.length === 0 && (
            <p>
              You haven&apos;t started your habit yet!{' '}
              <span className="font-bold">Make today count!</span>
            </p>
          )}
          {isWithin48Hours(habit.created_at) && (
            <div className="flex justify-end">
              <button
                className="cursor-pointer rounded-sm bg-red-400/10 p-1 text-red-600 transition-all hover:bg-red-400/30"
                onClick={() => handleHabitDeleteClick(habit.name)}
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Habit;
