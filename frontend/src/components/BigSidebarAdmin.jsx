import Wrapper from '../assets/wrappers/BigSidebar';
import NavLinks from './NavLinksAdmin';
import { useDashboardContext } from '../pages/DashboardAdmin';

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();

  return (
    <Wrapper>
      <div className={showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'}>
        <div className="content">
          <header></header>
          <NavLinks isBigSidebar></NavLinks>
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
