'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconifyIcon from '@/components/wrapper/IconifyIcon';

const navItems = [
  {
    href: '/clients',
    icon: 'solar:users-group-rounded-bold',
  },
  {
    href: '/dashboards',
    icon: 'solar:home-2-bold',
  },
  {
    href: '/charge',
    icon: 'solar:card-bold',
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  return (
    <nav
      className="bottom-nav"
      style={{
        backgroundColor: '#13181dff',
        borderTop: '1px solid rgba(236, 3, 3, 1)',
      }}
    >
      {navItems.map(item => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={triggerHaptic}
            className={`bottom-nav-item ${active ? 'active' : ''}`}
          >
            <IconifyIcon icon={item.icon} width={22} height={22} />
          </Link>
        );
      })}
    </nav>
  );
}