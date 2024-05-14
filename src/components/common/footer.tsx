import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mx-auto my-4 flex h-10 w-full max-w-[500px] flex-row items-center justify-between rounded-lg border-2 border-slate-200 px-4">
      <Link href="/" className="cursor-pointer text-xs">
        ItzaHabit
      </Link>
      <p className="text-xs text-black/60">
        Built by{' '}
        <Link className="underline" href="https://twitter.com/HeyItzaMi">
          Rui Sousa
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
