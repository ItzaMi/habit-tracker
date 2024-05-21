import { FC } from 'react';

import Habit from './habits/habit';

interface Props {
  habits: any;
  handleHabitCheckClick: (habitName: string) => void;
  handleHabitDeleteClick: (habitName: string) => void;
}

const Habits: FC<Props> = ({
  habits,
  handleHabitCheckClick,
  handleHabitDeleteClick,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold">Your habits</p>
      <ul className="flex flex-col gap-2">
        {habits.map((habit: any) => {
          return (
            <li key={habit.name}>
              <Habit
                habit={habit}
                handleHabitCheckClick={handleHabitCheckClick}
                handleHabitDeleteClick={handleHabitDeleteClick}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Habits;
