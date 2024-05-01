import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  user: User | null;
}

const Navbar: FC<Props> = ({ user }) => {
  return (
    <div className="mx-auto mt-4 flex h-10 w-full max-w-[500px] flex-row items-center justify-between rounded-lg border-2 border-slate-200 px-4">
      <Link href="/dashboard" className="cursor-pointer text-xs">
        ItzaHabit
      </Link>
      <Link href="dashboard/account" className="cursor-pointer text-xs">
        {user?.email}
      </Link>
    </div>
  );
};

export default Navbar;
