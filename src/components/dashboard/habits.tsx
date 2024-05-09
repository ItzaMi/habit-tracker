import { FC } from 'react';

import Habit from './habits/habit';

interface Props {
  habits: any;
  handleHabitCheckClick: (habitName: string) => void;
}

const Habits: FC<Props> = ({ habits, handleHabitCheckClick }) => {
  return (
    <ul className="flex flex-col gap-2">
      {habits.map((habit: any) => {
        return (
          <li key={habit.name}>
            <Habit
              habit={habit}
              handleHabitCheckClick={handleHabitCheckClick}
            />
          </li>
        );
      })}
    </ul>
  );
};

export default Habits;
