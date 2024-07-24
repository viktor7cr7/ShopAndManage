import { CartItemWrapper, ItemQuantity, QuantityInput } from "../assets/wrappers/CartItem";
import { FaPencilAlt, FaTrash, FaCheck } from "react-icons/fa";
import { useState } from "react";

const CartItem = ({ item, updateQuantity, handleRemoveItem }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState(item.quantity);
  
    const handlePencilClick = () => {
      setIsEditing(true);
    };
  
    const handleQuantityChange = (e) => {
      setNewQuantity(Number(e.target.value));
    };
  
    const handleQuantitySubmit = () => {
      updateQuantity(item.key, newQuantity);
      setIsEditing(false);
    };
  
    return (
      <CartItemWrapper>
        <div style={{width: '25%'}}>{item.name}</div>
        <div className="subtotal" style={{width: '30%'}}>
        <span className="subtotal-text">Price for one: </span>
        <span>{item.price} ₽</span>
        </div>
        <ItemQuantity style={{width: '20%'}}>
          <span className="quantity-text">Quantity:</span> {isEditing ? (
            <>
              <QuantityInput 
                type="number" 
                value={newQuantity} 
                onChange={handleQuantityChange} 
                onBlur={handleQuantitySubmit}
              />
              <button onClick={handleQuantitySubmit} className="update-btn"><FaCheck style={{ color: 'green', fontSize: '24px' }}></FaCheck></button>
            </>
          ) : (
            <>
                        
              {item.quantity} <button type="button" className="btn-action" onClick={handlePencilClick}><FaPencilAlt style={{height: 20, width: 20}}/></button>
            </>
          )}
        </ItemQuantity>
        <button onClick={() => handleRemoveItem(item.key)} className="btn-action"><FaTrash style={{height: 20, width: 20}}/></button>
      </CartItemWrapper>
    );
  };
  
  export default CartItem;