'use client';
import { FC } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  habits: any;
  handleHabitCheckClick: (habitName: string) => void;
}

const Habits: FC<Props> = ({ habits, handleHabitCheckClick }) => {
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit: any) => {
        const habitIsAlreadyChecked = habit.occurences.includes(
          new Date().toISOString().split('T')[0],
        );

        return (
          <li
            key={habit.name}
            className="flex flex-row items-center justify-between gap-1 rounded-lg border-2 border-slate-200 px-4 py-2 text-sm"
          >
            <span className="font-bold">{habit.name}</span>
            <button
              className={cn(
                'rounded-full px-4 py-1 font-bold',
                habitIsAlreadyChecked
                  ? 'cursor-not-allowed bg-green-500'
                  : 'cursor-pointer bg-slate-200',
              )}
              onClick={() => handleHabitCheckClick(habit.name)}
              disabled={habitIsAlreadyChecked}
            >
              {habitIsAlreadyChecked ? 'Done' : 'Check'}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default Habits;
