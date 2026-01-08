'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/auth/signup' })}
      style={{
        padding: '6px 12px',
        cursor: 'pointer',
      }}
    >
      Log out
    </button>
  );
}