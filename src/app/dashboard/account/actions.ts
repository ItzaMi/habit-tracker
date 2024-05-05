'use server';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';

const handleLogout = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.auth.signOut();
  }

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/login'), {
    status: 302,
  });
};

export { handleLogout };
