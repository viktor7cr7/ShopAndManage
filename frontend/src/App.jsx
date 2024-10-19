import {
  Landing,
  HomeLayout,
  Error,
  DashboardUser,
  DashboardAdmin,
  AddProduct,
  AllProducts,
  EditProducts,
  ProfileAdmin,
  AllProductShop,
  OrdersUser,
  AboutOrder,
  AddFunds,
  TransactionTable,
  ProfileUser,
  ForgotPassword,
  ResetPassword,
  Stats,
  VerifyEmail,
} from './pages';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Register, Login } from './pages';

import { action as actionRegister } from './pages/Register';
import { action as actionLogin } from './pages/Login';
import { action as actionLandingAuth } from './pages/Landing';
import { loader as loaderDashboardAdmin } from './pages/DashboardAdmin';
import { action as actionAddProduct } from './pages/AddProduct';
import { loader as loaderAllProduct } from './pages/AllProducts';
import { loader as loaderEditProduct } from './pages/EditProduct';
import { action as actionEditProduct } from './pages/EditProduct';
import { action as actionDeleteProduct } from './pages/DeleteProduct';
import { action as actionProfileAdmin } from './pages/ProfileAdmin';

import { loader as loaderUser } from './pages/DashboardUser';
import { loader as loaderProducts } from './pages/AllProductShop';
import { loader as loaderOrders } from './pages/OrdersUser';
import { action as actionAddFunds } from './pages/AddFunds';
import { loader as loaderTransactions } from './pages/TransactionUser';
import { loader as loaderProfile } from './pages/ProfileUser';
import { action as actionProfileUser } from './pages/ProfileUser';
import { action as actionForgotPassword } from './pages/ForgotPassword';
import { action as actionResetPassword } from './pages/ResetPassword';
import { loader as loaderVerifyEmail } from './pages/VerifyEmail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout></HomeLayout>,
    errorElement: <Error></Error>,
    children: [
      {
        index: true,
        element: <Landing></Landing>,
        action: actionLandingAuth,
      },
      {
        path: 'register/:type',
        element: <Register></Register>,
        action: actionRegister,
      },
      {
        path: 'login/:type',
        element: <Login></Login>,
        action: actionLogin,
      },
      {
        path: 'verify-email/:type',
        element: <VerifyEmail></VerifyEmail>,
        loader: loaderVerifyEmail,
      },
      {
        path: 'forgot-password/:type',
        element: <ForgotPassword></ForgotPassword>,
        action: actionForgotPassword,
      },
      {
        path: 'reset-password/:type',
        element: <ResetPassword></ResetPassword>,
        action: actionResetPassword,
      },
      {
        path: 'dashboard/user',
        element: <DashboardUser></DashboardUser>,
        loader: loaderUser,
        children: [
          {
            index: true,
            path: 'all-products',
            element: <AllProductShop></AllProductShop>,
            loader: loaderProducts,
          },
          {
            path: 'orders',
            element: <OrdersUser></OrdersUser>,
            loader: loaderOrders,
          },
          {
            path: 'orders/:id',
            element: <AboutOrder></AboutOrder>,
          },
          {
            path: 'add-funds',
            element: <AddFunds></AddFunds>,
            action: actionAddFunds,
          },
          {
            path: 'transaction',
            element: <TransactionTable></TransactionTable>,
            loader: loaderTransactions,
          },
          {
            path: 'profile',
            element: <ProfileUser></ProfileUser>,
            loader: loaderProfile,
            action: actionProfileUser,
          },
        ],
      },
      {
        path: 'dashboard/admin',
        element: <DashboardAdmin></DashboardAdmin>,
        loader: loaderDashboardAdmin,
        children: [
          {
            index: true,
            path: 'add-product',
            element: <AddProduct></AddProduct>,
            action: actionAddProduct,
          },
          {
            path: 'all-products',
            element: <AllProducts></AllProducts>,
            loader: loaderAllProduct,
          },
          {
            path: 'edit-product/:id',
            element: <EditProducts></EditProducts>,
            loader: loaderEditProduct,
            action: actionEditProduct,
          },
          {
            path: 'delete-product/:id',
            action: actionDeleteProduct,
          },
          {
            path: 'profile',
            element: <ProfileAdmin></ProfileAdmin>,
            action: actionProfileAdmin,
          },
          {
            path: 'stats',
            element: <Stats></Stats>,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
