import logoDark from '@/assets/images/logo-dark.png';
import logoLight from '@/assets/images/logo-light.png';
import logoSm from '@/assets/images/logo-sm.png';
import Image from 'next/image';
import Link from 'next/link';

const LogoBox = () => {
  return (
    <div className="logo-box">
      {/* Dark mode */}
      <Link href="/dashboards" className="logo-dark">
        <Image
          src={logoSm}
          width={28}
          height={28}
          className="logo-sm"
          alt="RevSense"
        />

        <Image
          src={logoDark}
          alt="RevSense"
          className="logo-lg"
          priority
          style={{
            height: '28px',
            width: 'auto',
            maxWidth: '160px',
          }}
        />
      </Link>

      {/* Light mode */}
      <Link href="/dashboards" className="logo-light">
        <Image
          src={logoSm}
          width={28}
          height={28}
          className="logo-sm"
          alt="RevSense"
        />

        <Image
          src={logoLight}
          alt="RevSense"
          className="logo-lg"
          priority
          style={{
            height: '28px',
            width: 'auto',
            maxWidth: '160px',
          }}
        />
      </Link>
    </div>
  );
};

export default LogoBox;