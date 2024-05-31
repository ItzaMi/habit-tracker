import { User } from '@supabase/supabase-js';
import { FC } from 'react';

import Container from '@/components/common/container';

interface Props {
  user: User;
}

const Info: FC<Props> = ({ user }) => {
  return (
    <Container>
      <p>Hey, {user.email}!</p>
      <p>
        Having problems with something? Email us as{' '}
        <a href="mailto:rros00@gmail.com" className="underline">
          rros00@gmail.com
        </a>
      </p>
    </Container>
  );
};

export default Info;
