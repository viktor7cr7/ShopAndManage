import Wrapper from '../assets/wrappers/BigSidebar'
import NavLinks from './NavLinksUser'
import { useDashboardContext } from '../pages/DashboardUser'

const BigSidebar = () => {
  const {showSidebar} = useDashboardContext()

  return <Wrapper>
    <div className={showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'}>

      <div className='content'>
        <header>
        </header>
        <NavLinks isBigSidebar></NavLinks>
      </div>
    </div>
  </Wrapper>
}

export default BigSidebar