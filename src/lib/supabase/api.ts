'use server';
import { User } from '@supabase/supabase-js';

import { createClient } from '@/utils/supabase/server';

const handleHabitOccurenceCheck = async (habitName: string) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id);

  if (!profilesData || profilesData.length === 0) {
    return;
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    const newHabits = profilesData[0].habits.map(
      (habit: { name: string; occurences: string[] }) => {
        if (habit.name !== habitName) {
          return habit;
        }

        if (habit.occurences.includes(today)) {
          return habit;
        }

        return {
          ...habit,
          occurences: [...habit.occurences, today],
        };
      },
    );

    const { error, status } = await supabase
      .from('profiles')
      .update({ habits: newHabits })
      .eq('user_id', user?.id);

    if (error && status !== 406) {
      console.log(error);
      throw error;
    }

    return newHabits;
  } catch (error) {
    console.log(error);
  }
};

const getHabits = async (user: User) => {
  const supabase = createClient();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id);

  if (!profilesData || profilesData.length === 0) {
    return [];
  }

  return profilesData[0].habits;
};

const checkIfUserIsCustomer = async (user: User) => {
  const supabase = createClient();

  const { data: customersData, error } = await supabase
    .from('customers')
    .select('*');

  console.log(customersData, error);
};

export { getHabits, handleHabitOccurenceCheck, checkIfUserIsCustomer };
