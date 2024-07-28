import { useState } from 'react';
import Wrapper from '../assets/wrappers/productShop';
import StarRating from './Rating';
import { useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from './ModalBuy';
import Percentage from './Percentage';
import customFetch from '../utils/customFetch';
import formatPrice from '../utils/formatPrice';
import { useDiscount } from '../contexts/DiscountContext';
import { Description } from '../assets/wrappers/productShop';
import  nextId  from  "react-id-generator" ;
import DescriptionProduct from './DescriptionProduct';
import getScrollWidth from '../utils/getScrollWidth';

const Products = ({
    product_id, name, old_price, new_price, description, stock_quantity, rating, percentage, image_url
}) => {
  const discount = useDiscount()
  let oldPrice
  if (percentage !== null) {
        oldPrice = 'old-price'
  }
  const navigate = useNavigate()
  let calculatedDiscountNewPrice, calculatedDiscountOldrice
  if (discount !== 0) {
     calculatedDiscountNewPrice = Math.round((new_price * discount) / 100)
     calculatedDiscountOldrice = Math.round((old_price * discount) / 100)
  }

  const [showModal, setShowModal] = useState(false);
  const [showModalDescription, setShowModalDescription] = useState(false)
  const [display, setDisplay] = useState(false)
  const formatOldPrice = formatPrice(old_price - (calculatedDiscountOldrice || 0))
  const formatNewPrice = formatPrice(new_price - (calculatedDiscountNewPrice || 0))

  const finalNewPrice = new_price - (calculatedDiscountNewPrice || 0)

  const handleBuyNow = () => {
    setShowModal(true);
    document.querySelector('body').style.overflow = 'hidden'
    const scrollWidth = getScrollWidth()
    document.body.style.paddingRight = `${scrollWidth}px`
  };

  const handleCloseModal = () => {
    setShowModal(false);
    document.querySelector('body').style.overflow = ''
    document.body.style.paddingRight = ``
  };

  const hanldeModalDesciption = () => {
    const scrollWidth = getScrollWidth()
    setShowModalDescription(!showModalDescription)
    if (document.querySelector('body').style.overflow === 'hidden') {
      document.querySelector('body').style.overflow = ''
      document.body.style.paddingRight = ``
    } else {
      document.querySelector('body').style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollWidth}px`
    }
  }

  const handleSubmit = async (data) => {
    const items = []
    data ? items.push(data) : null
    const {paymentMethod} = data
    try {
        const response = await customFetch.post('/create-checkout-session', {
            items: [
                ...items
            ],
            paymentMethod
        })
        const sessionUrl = response.data.success_url || response.data.session.url;
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
  };

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const newItem = {
      product_id,
      name,
      price: finalNewPrice,
      quantity: 1,
      key: nextId()
    }
    const updateCart = [...cart, newItem]
    localStorage.setItem('cart', JSON.stringify(updateCart))
    toast.success('Товар добавлен в корзину')
  }

  return (
    <Wrapper>
    <div className="product-containter">
    <div className="product-header">
      <div className="product-id">{`ID: ${product_id}`}</div>
      <div className="product-avatar">
        <StarRating rating={rating}></StarRating>
      </div>
    </div>
    <div className="product-content">
        <div className="product-info">
          <div className="product-name">{name}</div>
          <div className="product-quantity">{`Кол-во: ` + stock_quantity}</div>
          {percentage && <Percentage percentage={percentage}></Percentage>}
        </div>
        <div className="product_img"
        onMouseEnter={() => setDisplay(true)}
        onMouseLeave={() => setDisplay(false)}>
          <Description display={display}>
            <button className='button-descr' onClick={hanldeModalDesciption}>Подробнее о продукте</button>
          </Description>
          <img src={image_url} alt="product_img"></img>
        </div>
    </div>
    <div className="product-action" style={percentage ? {justifyContent: 'center'} : {justifyContent : 'space-between'}}>
      <div className="product-price">
        <span className={oldPrice}>{`₽ ${formatOldPrice}`}</span>
        {percentage && <span className='new-price'>{ '/ ' + `₽ ${formatNewPrice}`}</span>}
        </div>
      <button className="action-buy" onClick={handleBuyNow} style={percentage ? {height: '30px'} : {heigth : '40px'}}>Buy Now</button>
      <button className="add-to-cart" onClick={addToCart}>Add to cart</button>
    </div>
  </div>
  <DescriptionProduct handleCloseModal={hanldeModalDesciption} id={product_id} description={description} name={name} show={showModalDescription}></DescriptionProduct>
    <Modal show={showModal} onClose={handleCloseModal} onSubmit={handleSubmit} productId={product_id} newPrice={finalNewPrice} name={name} description={description}/>
    </Wrapper>
  )
}

export default Products