import styled from 'styled-components';

export const Card = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin: 10px;
  border-radius: 5px;
  background: #fff;
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderId = styled.div`
  font-weight: bold;
`;

export const OrderStatus = styled.div`
  color: ${(props) => (props.status === 'unpaid' ? 'red' : 'green')};
`;

export const OrderContent = styled.div`
  margin-top: 10px;
`;

export const TotalPrice = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const CreatedAt = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

export const ViewDetailsButton = styled.button`
  padding: 10px 20px;
  background-color: #199de1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #147ab8;
  }
`;
