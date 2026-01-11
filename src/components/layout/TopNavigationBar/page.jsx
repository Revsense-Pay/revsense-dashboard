import LeftSideBarToggle from './components/LeftSideBarToggle';
import ProfileDropdown from './components/ProfileDropdown';
import { Container } from 'react-bootstrap';

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
              <ProfileDropdown />
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default page;