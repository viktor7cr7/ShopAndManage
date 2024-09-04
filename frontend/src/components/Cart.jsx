import React, { useEffect, useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa';
import { CartIcon, CloseButton, ModalContent, TotalCost, Modal, ModalHeader, ModalFooter  } from '../assets/wrappers/Cart';
import CartItem from './CartItem';
import FormRowSelect from './FormRowSelect';
import { PAYMENT_METHOD } from '../utils/constants';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
import formatPrice from '../utils/formatPrice';

const Cart = ({handleCloseCartModal}) => {

    const [isOpen, setIsOpen] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('Credit Card')
    console.log(paymentMethod)
    const toggleCart = () => {
      setIsOpen(!isOpen);
      handleCloseCartModal()
    };

  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(items)
  }, [])

  
  const updateQuantity = (key, quantity) => {
    const updateCart = cartItems.map(item => item.key === key ?  {...item, quantity} : item)
    setCartItems(updateCart)
    localStorage.setItem('cart', JSON.stringify(updateCart))
    console.log(12)
  }

  const removeItem = (key) => {
    const updateCart = cartItems.filter(item => item.key !== key)
    setCartItems(updateCart)
    localStorage.setItem('cart', JSON.stringify(updateCart))
  }




   const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

   const sendDataItems = async () => {
    const dataItem = JSON.parse(localStorage.getItem('cart')) || []
    if (dataItem == []) return toast.error('Добавьте товары в корзину')
    let dataforServer = {}
    dataforServer.items = dataItem
    dataforServer.paymentMethod = paymentMethod
    try {
        if (totalCost < 50) return toast.error('Сумма покупки должна быть не менее 50 рублей')
        const {data} = await customFetch.post('/create-checkout-session', dataforServer)
        const sessionUrl = data.success_url || data.session.url;
        if (sessionUrl) {
          setTimeout(() => {
            window.location.href = sessionUrl;
          }, 2000)
        }
        toast.success('Успешная покупка!')
        window.location.href = sessionUrl;
    } catch (error) {
        return toast.error(error?.response?.data?.msg)
    }       
  }

   return (
    <>
      <CartIcon onClick={toggleCart}>
        <FaShoppingCart size={24} />
      </CartIcon>
      <Modal isOpen={isOpen}>
        <ModalHeader>
          <h2 className='title-cart'>Cart</h2>
          <CloseButton onClick={toggleCart} className='close-cart'>X</CloseButton>
        </ModalHeader>
        <ModalContent className='content-cart'>
        {cartItems.length === 0 ? (
          <h4 style={{textTransform: 'inherit'}}>Нет добавленных товаров</h4>
        ) :(cartItems.map((item, key) => (
          <CartItem 
          key={key} 
          item={item} 
          updateQuantity={updateQuantity} 
          handleRemoveItem={removeItem} 
        />
)))}
        </ModalContent>
        <ModalFooter>
          <TotalCost className='cart-totalCost'>Total Cost: ₽ {formatPrice(totalCost)}</TotalCost>
          <FormRowSelect id='selectPayment' labelText={'PaymentMethod'} list={PAYMENT_METHOD} style={{width: '50%', marginTop: '10px'}} onChange={(e) => setPaymentMethod(e.target.value)}></FormRowSelect>
          <button className="buy-btn" type='button' onClick={sendDataItems}>Buy Products</button>
        </ModalFooter>
      </Modal>
    </>
  );
};


export default Cart