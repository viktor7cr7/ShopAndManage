import { useEffect, useState } from "react";
import { Overlay, ModalWrapper } from "../assets/wrappers/ModalBuy";

const Modal = ({ show, onClose, onSubmit, productId, newPrice, name, description }) => {
    const [formData, setFormData] = useState({
        quantity: 1,
        paymentMethod: 'Credit Card',
        totalPrice: newPrice,
        price: newPrice
    })

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            totalPrice: (prevData.quantity * newPrice).toFixed(2)
        }))
    }, [newPrice])

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prevData) => {
            const newQunatity = name === 'quantity' ? Number(value) : prevData.quantity
            return {
                ...prevData,
                [name]: value,
                totalPrice: Math.round(newQunatity * newPrice)
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
          ...formData,
          product_id: productId,
          name,
          description,
        });
        onClose();
        setFormData({
          quantity: 1,
          paymentMethod: 'Credit Card',
          totalPrice: newPrice,
          price: newPrice
        });
      };
      const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
      }).format(formData.totalPrice);
  
    return (
      <>
        <Overlay show={show} onClick={onClose} />
        <ModalWrapper show={show}>
        <button class="close-btn" onClick={onClose}>X</button>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><h2 style={{margin: '0 0 15px', fontSize: '24px', textAlign: 'center'}}>Вы покупаете:</h2> 
          <p className='name-product' style={{martin: '0px', wordBreak: 'break-word', whiteSpace: 'pre-wrap'}}>{name}</p>
          </div>
          <form onSubmit={handleSubmit} className="form form-center">
            <div>
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Payment Method:</label>
              <select
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleChange}
                name="paymentMethod"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Balance">Balance</option>
              </select>
              <div className="result"><p>Итого: {formattedPrice}</p></div>
            </div>
            <button className="action-buy">Buy Product</button>
          </form>
        </ModalWrapper>
      </>
    );
  };
  
  export default Modal;