import { createContext, useContext } from 'react';

const OrdersContext = createContext();

export const OrdersProvider = ({ children, orders }) => {
  console.log(orders);
  return <OrdersContext.Provider value={orders}>{children}</OrdersContext.Provider>;
};

export const useOrdersContext = () => {
  return useContext(OrdersContext);
};
