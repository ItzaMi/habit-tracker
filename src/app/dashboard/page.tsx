import { redirect } from 'next/navigation';

import Form from '@/components/dashboard/form';
import Habits from '@/components/dashboard/habits';
import {
  checkIfUserIsCustomer,
  getHabits,
  handleHabitOccurenceCheck,
} from '@/lib/supabase/api';
import { createClient } from '@/utils/supabase/server';

import { addHabit } from './actions';

const Dashboard = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/error');
  }

  const habitsData = await getHabits(user);

  if (!habitsData || habitsData.length === 0) {
    return <div>You have no habits yet.</div>;
  }

  const checkIfCustomerIsClient = await checkIfUserIsCustomer(user);

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <Form action={addHabit} />
      <Habits
        habits={habitsData}
        handleHabitCheckClick={handleHabitOccurenceCheck}
      />
    </div>
  );
};

export default Dashboard;
