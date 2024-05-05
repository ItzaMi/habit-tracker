import Link from 'next/link';
import { redirect } from 'next/navigation';

import Container from '@/components/common/container';
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

  // check if the user is already a customer
  if (user) {
    const res = await checkIfUserIsCustomer(user.id);
    if (res === null) {
      return (
        <Container className="flex flex-col items-start gap-1 text-sm">
          <p>
            It seems like you have not yet subscribed to our service. Please go
            to your account page.
          </p>
          <Link
            href="/dashboard/account"
            className="rounded-md bg-gray-800 px-2 py-1 text-white"
          >
            Account
          </Link>
        </Container>
      );
    }
  }

  return (
    <div className="mx-auto flex max-w-[500px] flex-col gap-4">
      <Form action={addHabit} />
      {!habitsData && <Container className="text-sm">Loading...</Container>}
      {habitsData && habitsData.length === 0 && (
        <Container className="text-sm">You have no habits yet.</Container>
      )}
      {habitsData && habitsData.length > 0 && (
        <Habits
          habits={habitsData}
          handleHabitCheckClick={handleHabitOccurenceCheck}
        />
      )}
    </div>
  );
};

export default Dashboard;
