import Container from '@/components/common/container';
import Checkout from '@/components/dashboard/account/checkout';
import Info from '@/components/dashboard/account/info';
import { createClient } from '@/utils/supabase/server';

import { handleLogout } from './actions';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-4 flex flex-col gap-4 text-sm">
      <Info user={user} />
      <Checkout />
      <Container className="flex items-center justify-between text-sm">
        <p>Logout from your account.</p>
        <form>
          <button
            formAction={handleLogout}
            className="rounded-md bg-gray-800 px-2 py-1 text-white"
          >
            Logout
          </button>
        </form>
      </Container>
    </div>
  );
}
