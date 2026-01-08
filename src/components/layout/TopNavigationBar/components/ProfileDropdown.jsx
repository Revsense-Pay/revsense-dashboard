'use client';

import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrapper/IconifyIcon';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'react-bootstrap';

const ProfileDropdown = () => {
  return (
    <Dropdown className="topbar-item">
      <DropdownToggle
        type="button"
        className="topbar-button content-none"
        id="page-header-user-dropdown"
      >
        <span className="d-flex align-items-center">
          <Image
            className="rounded-circle"
            width={32}
            src={avatar1}
            alt="avatar"
          />
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader>Welcome!</DropdownHeader>

        <DropdownItem href="/account">
          <IconifyIcon
            icon="solar:user-outline"
            className="align-middle me-2 fs-18"
          />
          <span className="align-middle">My Account</span>
        </DropdownItem>

        <DropdownItem href="/onboarding/pricing">
          <IconifyIcon
            icon="solar:wallet-outline"
            className="align-middle me-2 fs-18"
          />
          <span className="align-middle">Pricing</span>
        </DropdownItem>

        <DropdownItem href="/help">
          <IconifyIcon
            icon="solar:help-outline"
            className="align-middle me-2 fs-18"
          />
          <span className="align-middle">Help</span>
        </DropdownItem>

        <DropdownItem href="/auth/lock-screen">
          <IconifyIcon
            icon="solar:lock-keyhole-outline"
            className="align-middle me-2 fs-18"
          />
          <span className="align-middle">Lock screen</span>
        </DropdownItem>

        <div className="dropdown-divider my-1" />

        {/* ✅ REAL LOGOUT */}
        <DropdownItem
          className="text-danger"
          onClick={() =>
            signOut({
              callbackUrl: '/auth/signup',
            })
          }
        >
          <IconifyIcon
            icon="solar:logout-3-outline"
            className="align-middle me-2 fs-18"
          />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;