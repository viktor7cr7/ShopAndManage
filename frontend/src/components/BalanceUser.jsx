import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/BalanceUser';
import formatPrice from '../utils/formatPrice';

const BalanceComponent = ({ balance }) => {
  const [showAddFundsButton, setShowAddFundsButton] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const navigate = useNavigate();

  const handleBalanceClick = () => {
    setShowAddFundsButton((prevState) => !prevState);
    setIsRotated((prevState) => !prevState);
  };

  const handleAddFundsClick = () => {
    navigate('/dashboard/user/add-funds');
  };

  return (
    <Wrapper>
      <div className="balance-container">
        <button onClick={handleBalanceClick} className="balance-btn">
          Balance: {formatPrice(balance)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="5"
            viewBox="0 0 8 5"
            fill="none"
            className={`header__currency--arr ${isRotated ? 'rotated' : ''}`}
          >
            <path d="M7 1L4 4L1 1" stroke="#757575" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          {showAddFundsButton && (
            <button onClick={handleAddFundsClick} className="add-funds-btn">
              Add Funds
            </button>
          )}
        </button>
      </div>
    </Wrapper>
  );
};

export default BalanceComponent;
