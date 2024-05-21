'use server';
import { User } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/utils/supabase/server';

interface Profile {
  user_id: string;
  habits: string[];
}

const addHabit = async (formData: FormData) => {
  const dataToAdd = {
    habit: formData.get('habit') as string,
  };

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profilesData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user?.id);

  if (!profilesData || profilesData.length === 0) {
    const { data, error } = await supabase.from('profiles').insert({
      user_id: user?.id,
      habits: [
        {
          name: dataToAdd.habit,
          occurences: [],
          created_at: new Date().toISOString(),
        },
      ],
    });
  } else {
    const profile = profilesData[0] as Profile;
    const { data, error } = await supabase
      .from('profiles')
      .update({
        habits: [
          ...profile.habits,
          {
            name: dataToAdd.habit,
            occurences: [],
            created_at: new Date().toISOString(),
          },
        ],
      })
      .eq('user_id', user?.id);
  }

  revalidatePath('/dashboard');
};

export { addHabit };
