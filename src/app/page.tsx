import Link from 'next/link';

import Hero from '@/components/homepage/hero';
import Illustration from '@/components/homepage/illustration';
import Info from '@/components/homepage/info';

const Page = () => {
  return (
    <div>
      <Hero />
      <Info />
    </div>
  );
};

export default Page;
