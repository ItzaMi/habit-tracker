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
        <a href="mailto:something@something.com" className="underline">
          something@something.com
        </a>
      </p>
    </Container>
  );
};

export default Info;
