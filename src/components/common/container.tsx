import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const Container: FC<Props> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'rounded-lg border-2 border-slate-200 px-4 py-2',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Container;
