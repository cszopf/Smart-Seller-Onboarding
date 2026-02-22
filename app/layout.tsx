import type {Metadata} from 'next';
import './globals.css';
import { montserrat, nunitoSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'World Class Title | Smart Onboarding',
  description: 'Secure agent verification and seller flow handoff.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${nunitoSans.variable}`}>
      <body suppressHydrationWarning className="font-nunito antialiased bg-[#F8FAFC] text-[#1E293B]">{children}</body>
    </html>
  );
}
