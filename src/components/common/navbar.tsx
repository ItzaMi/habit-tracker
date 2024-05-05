import { User } from '@supabase/supabase-js';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  user: User | null;
}

const Navbar: FC<Props> = ({ user }) => {
  return (
    <div className="mx-auto mt-4 flex h-10 w-full max-w-[500px] flex-row items-center justify-between rounded-lg border-2 border-slate-200 px-4">
      <Link href="/" className="cursor-pointer text-xs">
        ItzaHabit
      </Link>
      {user ? (
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-xs text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/account"
            className="cursor-pointer rounded-full bg-gray-800 p-1 text-xs text-white"
          >
            <UserIcon className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <Link
          href="/login"
          className="cursor-pointer rounded-md bg-gray-800 px-2 py-1 text-xs text-white"
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default Navbar;
