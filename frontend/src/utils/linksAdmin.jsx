import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAdminPanelSettings, MdPayments } from 'react-icons/md';

const links = [
  { text: 'add product', path: 'add-product', icon: <FaWpforms /> },
  { text: 'all products', path: 'all-products', icon: <MdQueryStats /> },
  { text: 'profile', path: 'profile', icon: <ImProfile /> },
  { text: 'stats', path: 'stats', icon: <IoBarChartSharp /> },
];

export default links;
