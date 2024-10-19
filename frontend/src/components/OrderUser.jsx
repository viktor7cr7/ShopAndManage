import { Link } from 'react-router-dom';
import {
  Card,
  OrderHeader,
  OrderId,
  OrderStatus,
  OrderContent,
  TotalPrice,
  CreatedAt,
  ViewDetailsButton,
} from '../assets/wrappers/OrderCard';
import formatPrice from '../utils/formatPrice';

const OrderCard = ({ order }) => {
  return (
    <Card className="order-item">
      <OrderHeader>
        <OrderId className="order-id">ID: {order.order_id}</OrderId>
        <OrderStatus className="order-status">Status: {order.status}</OrderStatus>
      </OrderHeader>
      <OrderContent>
        <TotalPrice className="order-price">Total Price: ₽ {formatPrice(order.total_price)}</TotalPrice>
        <CreatedAt className="order-created">Created At: {new Date(order.created_at).toLocaleDateString()}</CreatedAt>
        <Link className="order-detail" to={`/dashboard/user/orders/${order.order_id}`}>
          <ViewDetailsButton>View Details</ViewDetailsButton>
        </Link>
      </OrderContent>
    </Card>
  );
};

export default OrderCard;
