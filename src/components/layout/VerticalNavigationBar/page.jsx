'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import AppMenu from './components/AppMenu';
import { getMenuItems } from '@/helpers/Manu';
import SimplebarReactClient from '@/components/wrapper/SimplebarReactClient';
import LogoBox from '@/components/wrapper/LogoBox';

const VerticalNavigationBar = () => {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === 'ADMIN';

  const menuItems = getMenuItems({ isAdmin });

  return (
    <div className="app-sidebar">
      <LogoBox />

      <SimplebarReactClient className="scrollbar" data-simplebar>
        <AppMenu menuItems={menuItems} />
      </SimplebarReactClient>
    </div>
  );
};

export default VerticalNavigationBar;