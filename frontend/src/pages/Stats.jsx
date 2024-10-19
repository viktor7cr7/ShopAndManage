import React, { useEffect, useState } from 'react';
import { useDashboardContext } from './DashboardAdmin';
import customFetch from '../utils/customFetch';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsContainer from '../components/StatsContainer';
import Wrapper from '../assets/wrappers/Stats';
import { toast } from 'react-toastify';

export const Stats = () => {
  const [itemsStats, setItemsStats] = useState([]);
  const [qunatityOrders, setQuantityOrders] = useState(0);
  const { author_id } = useDashboardContext();

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await customFetch.get('/admin/orders-stat', author_id);
        setItemsStats(data.statsOrders);
        setQuantityOrders(data.totalQuantity);
      } catch (error) {
        toast.error(error?.response?.data?.msg);
        throw new Error(error.message);
      }
    };
    getStats();
  }, []);

  const processData = (data) => {
    const result = {};

    data.forEach((item) => {
      const date = new Date(item.created_at).toLocaleDateString();
      if (!result[date]) {
        result[date] = { date, quantity: 0, products: [] };
      }
      result[date].quantity += +item.quantity;
      result[date].products.push(item.product_id);
    });

    return Object.values(result);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { quantity, products } = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ background: '#fff', padding: '5px', border: '1px solid #ccc' }}>
          <p className="label">{`Date: ${label}`}</p>
          <p className="intro">{`Quantity: ${quantity}`}</p>
          <p className="intro">{`Products: ${products.join(', ')}`}</p>
        </div>
      );
    }

    return null;
  };

  const statsResult = processData(itemsStats);
  return (
    <Wrapper>
      <StatsContainer totalQuantity={qunatityOrders}></StatsContainer>
      <ResponsiveContainer width="100%" height={400} className="stats-container">
        <BarChart data={statsResult}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Wrapper>
  );
};

export default Stats;
