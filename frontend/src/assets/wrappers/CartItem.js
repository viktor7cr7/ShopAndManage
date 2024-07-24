import styled from "styled-components";

export const CartItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  .subtotal-text, .quantity-text {
    color: #757575;
    margin-right: 5px;
  }

  .btn-action {
    height: 48px;
    min-width: 50px;
    background-color: rgb(255, 233, 255);
    border-color: rgb(255, 255, 255);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .update-btn {
     height: 30px;
    border: none;
    color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 15px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .update-btn:hover {
    background-color: #4bb8fe;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

`;

export const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
`;

export const QuantityInput = styled.input`
  width: 50px;
  margin-left: 10px;
  padding: 5px;
`;