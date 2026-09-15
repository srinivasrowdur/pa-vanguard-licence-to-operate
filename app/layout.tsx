import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'PA × Vanguard | Licence to Operate',
  icons: { icon: '/favicon.svg' },
  description:
    'Your learning pathway and practical delivery playbook for PA teams working with Vanguard.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
