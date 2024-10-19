import { useParams } from 'react-router-dom';
import {
  DetailsWrapper,
  OrderContent,
  OrderHeader,
  OrderId,
  OrderStatus,
  CreatedAt,
  ItemsWrapper,
  ItemCard,
  ProductName,
  Quantity,
  TotalPrice,
  ItemPrice,
} from '../assets/wrappers/AboutOrder';
import { useEffect, useState } from 'react';
import customFetch from '../utils/customFetch';
import formatPrice from '../utils/formatPrice';
import RatingStar from '../components/RatingSetProduct';
import { toast } from 'react-toastify';

const AboutOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await customFetch.get(`/orders/item/${id}`);
        const items = data[id];
        setOrder(items);
      } catch (error) {
        return toast.error(error?.response?.data?.msg);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div>Order not found</div>;
  }

  const convertPrice = (value) => {
    return formatPrice(Math.round(Number(value * 87.9)));
  };

  return (
    <DetailsWrapper>
      <OrderHeader>
        <OrderId>ID: {order.order_id}</OrderId>
        <OrderStatus>Status: {order.status}</OrderStatus>
      </OrderHeader>
      <OrderContent className="item-content">
        <TotalPrice>Total Price: ₽ {convertPrice(order.total_price)}</TotalPrice>
        <CreatedAt>Created At: {new Date(order.created_at).toLocaleDateString()}</CreatedAt>
        <ItemsWrapper>
          {order.items.map((item) => (
            <ItemCard key={item.item_id}>
              <ProductName>{item.product_name}</ProductName>
              <Quantity>Quantity: {item.quantity}</Quantity>
              <ItemPrice>Price: ₽ {convertPrice(item.price)}</ItemPrice>
              <RatingStar itemId={item.item_id} productId={item.productId} orderId={order.order_id}></RatingStar>
            </ItemCard>
          ))}
        </ItemsWrapper>
      </OrderContent>
    </DetailsWrapper>
  );
};

export default AboutOrder;
