import Wrapper from '../assets/wrappers/Navbar';
import { FaAlignLeft } from 'react-icons/fa';
import { useDashboardContext } from '../pages/DashboardUser';
import { useState } from 'react';
import LogoutContainer from './LogoutContainerUser';
import { FaShoppingCart } from 'react-icons/fa';
import Cart from './Cart';
import WrapperCartModal from '../assets/wrappers/CartModal';
import BalanceSelect from './BalanceUser';

const Navbar = () => {
  const { toggleSidebar, user } = useDashboardContext();

  const [showCartModal, setShowCartModal] = useState(false);

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleCloseCartModal = () => {
    setShowCartModal(false);
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          <h4 className="logo-text">dashboard</h4>
        </div>
        <div className="btn-container">
          <BalanceSelect balance={user.amount}></BalanceSelect>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleCartClick}
            className="cart-btn"
          >
            <FaShoppingCart size={24} style={{ marginRight: '8px' }} />
            Корзина
          </button>
          <LogoutContainer />
        </div>
      </div>
      {showCartModal && <CartModal isOpen={showCartModal} handleCloseCartModal={handleCloseCartModal} />}
    </Wrapper>
  );
};

const CartModal = ({ isOpen, handleCloseCartModal }) => (
  <WrapperCartModal isOpen={isOpen}>
    <div className="modal modal-cart">
      <div className="modal-content">
        <span className="close" onClick={handleCloseCartModal}>
          &times;
        </span>
        <Cart handleCloseCartModal={handleCloseCartModal} />
      </div>
    </div>
  </WrapperCartModal>
);

export default Navbar;
