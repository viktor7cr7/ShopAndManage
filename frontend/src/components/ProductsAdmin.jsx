import { FaLocationArrow, FaCalendarAlt } from 'react-icons/fa';
import { useState } from 'react';
import DiscountModal from './ModalDiscount';
import { Link, Form } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Products';
import ProductInfo from './ProductInfo';
import day from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import StarRating from './Rating';
import { faMoneyBill, faPercentage } from '@fortawesome/free-solid-svg-icons';
import customFetch from '../utils/customFetch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
day.extend(advancedFormat);

const Products = ({
    product_id, name, old_price, new_price, category, status, created_at, stock_quantity, rating, percentage
}) => {
  const navigate = useNavigate()
  stock_quantity === 0 ? status = 'ended stock' : status = 'available'
  let styleDiscount
  const date = day(created_at).format('MMM Do, YYYY')
  if (percentage === null) {
        percentage = 'Discount not set'
        styleDiscount = 'no-discount'
  } else {
    percentage + '%'
    styleDiscount = 'set-discount'
  }
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const transformNewPrice = Math.round(new_price)
  const transformOldPrice = Math.round(old_price)

  return (
    <Wrapper className='product-item'>
        <header>
            <div className='main-icon'>{name.charAt(0)}</div>
            <div className='info'>
                <h5 className='product-name'>{name}</h5>
                <p>{'Id ' + product_id}</p>
            </div>
            <div className='info'>
                <h5 >Категория:</h5>
                <p className='product-category'>{category}</p>
            </div>
        </header>
        <div className='content'>
            <div className='content-center'>
                <ProductInfo icon={<FaLocationArrow></FaLocationArrow>} text={'Quantity: ' + stock_quantity}></ProductInfo>
                <div className={`product-status ${status}`}>{status}</div>
                <StarRating rating={rating}></StarRating>
                <ProductInfo icon={<FaCalendarAlt></FaCalendarAlt>} text={date}></ProductInfo>
            </div>
            <div className='content-center'>
                <p className={transformOldPrice === transformNewPrice ? 'product-price' : 'no_activity_price'}><FontAwesomeIcon icon={faMoneyBill}/>{` ${transformOldPrice} RUB`}</p>
                <p className={`${styleDiscount}`}><FontAwesomeIcon icon={faPercentage} />{percentage}</p>
                {transformOldPrice !== transformNewPrice && <p className={`fa-percentage`}><FontAwesomeIcon icon={faMoneyBill} />{` ${transformNewPrice} RUB`}</p>}
            </div>
            <footer className='actions'>
                <Link to={`../edit-product/${product_id}`} className='btn edit-btn'>Edit</Link>
                <Form method='post' action={`../delete-product/${product_id}`}>
                    <button type='submit' className='btn delete-btn'>delete</button>
                </Form>
                <button onClick={() => setShowDiscountModal(true)} className='btn discount-btn'>Set Discount</button>
            </footer>
            {showDiscountModal && (
            <DiscountModal
                product_id={product_id}
                onClose={() => setShowDiscountModal(false)}
                 onSave={ async ({ percentage, startDate: start_date, endDate: end_date }) => {
                    const body = JSON.stringify({percentage, start_date, end_date})
                    try {
                        await customFetch.post(`admin/product/discount/${product_id}`, body, { headers: {
                                'Content-Type': 'application/json'
                            }
                    })  
                        toast.success('Скидка успешно установлена')
                        navigate('/dashboard/admin/all-products')
                    } catch (error) {
                        toast.error(error?.response?.data?.msg)
                    }
                }}
            />
        )}
        </div>
    </Wrapper>
  )
}

export default Products