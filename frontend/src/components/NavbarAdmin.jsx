import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardAdmin';
import LogoutContainer from './LogoutContainerAdmin';

const Navbar = () => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft></FaAlignLeft>
        </button>
        <div>
          <h4 className="logo-text">dashboard</h4>
        </div>
        <div className="btn-container">
          <LogoutContainer></LogoutContainer>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
