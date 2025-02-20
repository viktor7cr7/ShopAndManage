import Wrapper from '../assets/wrappers/LogoutContainer';
import { useState } from 'react';
import { useDashboardContext } from '../pages/DashboardAdmin';
import { FaCaretDown, FaUserCircle } from 'react-icons/fa';

const LogoutContainer = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { user, logoutUser } = useDashboardContext();
  return (
    <Wrapper>
      <button type="button" className="btn logout-btn" onClick={() => setShowLogout(!showLogout)}>
        {user.avatar ? <img src={user.avatar} alt="avatar" className="img" /> : <FaUserCircle></FaUserCircle>}
        {user?.name}
        <FaCaretDown></FaCaretDown>
      </button>
      <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
        <button type="button" className="dropdown-btn" onClick={logoutUser}>
          logout
        </button>
      </div>
    </Wrapper>
  );
};

export default LogoutContainer;
