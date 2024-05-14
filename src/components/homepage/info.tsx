import Link from 'next/link';

import Illustration from './illustration';

const Info = () => {
  return (
    <section className="w-full rounded-md bg-gray-100 py-12 md:py-24 lg:py-32">
      <div className="container mx-auto flex flex-col gap-10 lg:flex-row">
        <div className="flex flex-col gap-6">
          <h2 className="max-w-[500px] text-3xl font-bold tracking-tighter md:text-4xl">
            Your habits should become part of who you are
          </h2>
          <div className="flex max-w-[500px] flex-col gap-2 text-black/80">
            <p>
              The philosophy behind ItzaHabit is simple: once you&apos;ve
              created an habit and it becomes part of who you are, you
              won&apos;t need to track them anymore.
            </p>
            <p>
              There&apos;s a free plan available for you to try out. No credit
              card required. It offers you the ability to create up to 2 habits.
              If you need more, you can upgrade to the premium plan.
            </p>
          </div>
          <Link
            href="/login"
            className="self-start rounded-md bg-gray-800 px-8 py-2 font-bold text-white"
          >
            Start now
          </Link>
        </div>
        <div className="relative flex flex-1 items-center justify-center rounded-full">
          <Illustration />
        </div>
      </div>
    </section>
  );
};

export default Info;
