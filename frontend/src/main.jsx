import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { DiscountProvider } from './contexts/DiscountContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <DiscountProvider>
    <App />
    <ToastContainer position="top-center"></ToastContainer>
  </DiscountProvider>,
);
