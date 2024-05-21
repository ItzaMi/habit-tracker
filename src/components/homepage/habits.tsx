'use client';

import { useState } from 'react';

import Habit from '../dashboard/habits/habit';

const Habits = () => {
  function generateDates(
    startDate: string | number | Date,
    interval: number,
    endDate: string | number | Date = new Date(),
  ) {
    const dates = [];
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    while (startDate < endDate) {
      const formattedDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
      dates.push(formattedDate);
      startDate.setDate(startDate.getDate() + interval);
    }

    return dates;
  }

  const [habit1Occurences, setHabit1Occurences] = useState(
    generateDates('2024-03-20', 3),
  );
  const [habit2Occurences, setHabit2Occurences] = useState(
    generateDates('2024-01-01', 1),
  );
  const [habit3Occurences, setHabit3Occurences] = useState(
    generateDates('2024-02-05', 7, '2024-03-20'),
  );

  return (
    <div className="mt-10 flex w-full max-w-[400px] flex-col gap-2 lg:mt-20">
      <Habit
        habit={{
          occurences: habit1Occurences,
          name: 'Walking 10K steps 🚶',
          created_at: '2024-04-11T21:54:31.269Z',
        }}
        handleHabitCheckClick={() =>
          setHabit1Occurences([
            ...habit1Occurences,
            new Date().toISOString().split('T')[0],
          ])
        }
        handleHabitDeleteClick={() => {}}
      />
      <Habit
        habit={{
          occurences: habit2Occurences,
          name: 'Read 15 minutes 📚',
          created_at: '2024-04-11T21:54:31.269Z',
        }}
        handleHabitCheckClick={() =>
          setHabit2Occurences([
            ...habit2Occurences,
            new Date().toISOString().split('T')[0],
          ])
        }
        handleHabitDeleteClick={() => {}}
      />
      <Habit
        habit={{
          occurences: habit3Occurences,
          name: 'Clean the house 🧹',
          created_at: '2024-04-11T21:54:31.269Z',
        }}
        handleHabitCheckClick={() =>
          setHabit3Occurences([
            ...habit3Occurences,
            new Date().toISOString().split('T')[0],
          ])
        }
        handleHabitDeleteClick={() => {}}
      />
    </div>
  );
};

export default Habits;
