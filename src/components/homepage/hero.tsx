import Link from 'next/link';

import Habits from './habits';

const Hero = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-8">
          <h1 className="max-w-[500px] text-4xl font-bold tracking-tighter md:text-6xl">
            Create habits that run on autopilot
          </h1>

          <p className="text-md max-w-[500px] text-gray-600 md:text-xl">
            The goal is to help you create routines that run on autopilot, no
            effort required. Once your habits are part of who you are, say
            goodbye to the tracker. Ready to make lasting changes?
          </p>

          <Link
            href="/login"
            className="self-start rounded-md bg-gray-800 px-8 py-2 text-lg font-bold text-white"
          >
            Get started for free
          </Link>
        </div>
        <div className="flex flex-1 justify-center">
          <Habits />
        </div>
      </div>
    </section>
  );
};

export default Hero;
