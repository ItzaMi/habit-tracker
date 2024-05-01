import { createClient } from '@/utils/supabase/server';

export default async function Account() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-slate-200 px-4 py-2 text-sm">
      <p>Hey, {user.email}!</p>
      <p>
        Having problems with something? Email us as{' '}
        <a href="mailto:something@something.com" className="underline">
          something@something.com
        </a>
      </p>
    </div>
  );
}
