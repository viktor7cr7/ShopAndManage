import styled from "styled-components";

export const CartIcon = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
  width: 800px;
  height: 100%;
  background: white;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition-duration: transform 2.5s, ease-out 0.5s;
  z-index: 1200;
  padding: 20px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export const ModalContent = styled.div`
  margin-top: 20px;
  overflow-y: auto;
  padding: 10px;
border: 1px solid #e0e0e0;
`;

export const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

export const ItemName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

export const ItemPrice = styled.div`
  font-size: 14px;
  color: gray;
`;

export const ItemQuantity = styled.div`
  font-size: 14px;
  color: gray;
  display: flex;
  align-items: center;

  svg {
    margin-left: 5px;
    cursor: pointer;
  }
`;

export const DeleteIcon = styled.div`
  cursor: pointer;

  svg {
    color: red;
  }
`;

export const ModalFooter = styled.div`
  margin-top: 20px;

  .buy-btn {
    height: 40px;
    min-width: 140px;
    font-size: 16px;
    background-color: #199de1;
    color: #fff;
    display: block;
    border-radius: 28px;
    margin-right: 10px;
    border-color: cyan;
    border: none;
    transition: box-shadow 0.3s ease;
  }

  .buy-btn:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

export const TotalCost = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const PaymentMethod = styled.div`
  margin-bottom: 10px;

  label {
    margin-right: 10px;
  }
`;

export const PurchaseButton = styled.button`
  width: 100%;
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;

  &:hover {
    background: darkblue;
  }
`;

