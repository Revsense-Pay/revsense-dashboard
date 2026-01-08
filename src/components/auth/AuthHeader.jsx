import Image from 'next/image';
import logo from '@/assets/images/logo-light.png';

export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="auth-header text-center mb-4">
      <div className="auth-logo">
        <Image
          src={logo}
          alt="Revsense"
          height={32}
          priority
        />
      </div>

      <h2 className="mt-3">{title}</h2>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
    </div>
  );
}