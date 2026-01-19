import logoLight from '@/assets/images/logo-light.png';
import ProfileDropdown from './components/ProfileDropdown';
import { Container } from 'react-bootstrap';

const page = () => {
  return (
    <header className="app-topbar">
      <Container fluid>
        <div className="navbar-header mobile-topbar">

          {/* LEFT spacer */}
          <div className="topbar-left" />

          {/* CENTER logo */}
          <div className="topbar-center">
            <img
              src={logoLight.src}
              alt="Revsense"
              className="topbar-logo"
            />
          </div>

          {/* RIGHT account */}
          <div className="topbar-right">
            <ProfileDropdown />
          </div>

        </div>
      </Container>
    </header>
  );
};

export default page;