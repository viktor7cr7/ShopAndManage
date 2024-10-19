import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings, MdPayments } from 'react-icons/md';
import { RiAlignItemLeftFill } from 'react-icons/ri';

const links = [
  { text: 'buy products', path: 'all-products', icon: <MdQueryStats /> },
  { text: 'orders', path: 'orders', icon: <RiAlignItemLeftFill /> },
  { text: 'Add funds', path: 'add-funds', icon: <MdPayments /> },
  { text: 'Transactions', path: 'transaction', icon: <FaMoneyBillTransfer /> },
  { text: 'profile', path: 'profile', icon: <ImProfile /> },
];

export default links;
