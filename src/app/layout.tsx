import type { Metadata } from 'next';
// eslint-disable-next-line import/order
import { Inter } from 'next/font/google';

import './globals.css';
import Script from 'next/script';

import Footer from '@/components/common/footer';
import Navbar from '@/components/common/navbar';
import { cn } from '@/lib/utils';
import { createClient } from '@/utils/supabase/server';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ItzaHabit | Create habits that run on autopilot',
  description:
    'The goal is to help you create routines that run on autopilot, no effort required. Once your habits are part of who you are, say goodbye to the tracker. Ready to make lasting changes?',
  openGraph: {
    images: [
      {
        url: 'https://itzahabit.itzami.com/opengraph-image.png',
        width: 1440,
        height: 756,
      },
    ],
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="90cc1651-5338-4a4b-9fe3-148beeb060e7"
      />
      <body className={cn('px-4', inter.className)}>
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
