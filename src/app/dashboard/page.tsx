import Link from 'next/link';
import { redirect } from 'next/navigation';

import Container from '@/components/common/container';
import Form from '@/components/dashboard/form';
import Habits from '@/components/dashboard/habits';
import {
  checkIfUserIsCustomer,
  getHabits,
  handleHabitOccurenceCheck,
} from '@/utils/supabase/api';
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

  // check if the user is already a customer
  let isCustomer = false;
  if (user) {
    const res = await checkIfUserIsCustomer(user.id);
    if (res !== null) {
      isCustomer = true;
    }
  }

  const canAddHabit = isCustomer || (habitsData && habitsData.length < 2);

  const habitsToDisplay =
    canAddHabit && habitsData
      ? habitsData
      : !canAddHabit
        ? habitsData.slice(0, 2)
        : [];

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      {canAddHabit && <Form action={addHabit} />}
      {!canAddHabit && (
        <Container className="flex flex-col items-start gap-1 text-sm">
          <p>
            You have reached the maximum number of habits available on the free
            tier.
          </p>
          <p>To add more habits, please upgrade your account.</p>
          <Link
            href="/dashboard/account"
            className="rounded-md bg-gray-800 px-2 py-1 text-white"
          >
            Account
          </Link>
        </Container>
      )}
      {!habitsToDisplay && (
        <Container className="text-sm">Loading...</Container>
      )}
      {habitsToDisplay && habitsToDisplay.length === 0 && (
        <Container className="text-sm">You have no habits yet.</Container>
      )}
      {habitsToDisplay && habitsToDisplay.length > 0 && (
        <Habits
          habits={habitsToDisplay}
          handleHabitCheckClick={handleHabitOccurenceCheck}
        />
      )}
    </div>
  );
};

export default Dashboard;
