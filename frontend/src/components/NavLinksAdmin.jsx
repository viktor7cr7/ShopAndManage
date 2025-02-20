import links from '../utils/linksAdmin';
import { useDashboardContext } from '../pages/DashboardAdmin';
import { NavLink } from 'react-router-dom';

const NavLinks = (isBigSidebar) => {
  const { toggleSidebar } = useDashboardContext();
  return (
    <div className="nav-links">
      {links.map(({ text, path, icon }) => {
        return (
          <NavLink to={path} key={text} className="nav-link" onClick={isBigSidebar ? null : toggleSidebar} end>
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
