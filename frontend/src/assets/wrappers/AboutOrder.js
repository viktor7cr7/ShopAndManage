import styled from "styled-components";

export const DetailsWrapper = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 5px;
  margin: 20px;
`;

export const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const OrderId = styled.div`
  font-weight: bold;
`;

export const OrderStatus = styled.div`
  color: ${props => props.status === 'unpaid' ? 'red' : 'green'};
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

export const ItemsWrapper = styled.div`
  margin-top: 20px;
`;

export const ItemCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background: #fff;
`;

export const ProductName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Quantity = styled.div`
  margin-bottom: 5px;
`;

export const ItemPrice = styled.div`
  color: #888;
`;