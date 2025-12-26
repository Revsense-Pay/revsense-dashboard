import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import ThemeModeToggle from './components/ThemeModeToggle';
import { Container } from 'react-bootstrap';
import Notifications from './components/Notifications';

const page = () => {
  return (
    <header className="app-topbar">
      <div>
        <Container fluid>
          <div className="navbar-header">
            <div className="d-flex align-items-center gap-2">
              <LeftSideBarToggle />
            </div>

            <div className="d-flex align-items-center gap-2">
              <ThemeModeToggle />
              <Notifications />
              <ProfileDropdown />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default page;