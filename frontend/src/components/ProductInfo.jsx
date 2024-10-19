import Wrapper from '../assets/wrappers/ProductInfo';

const ProductInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="products-icon">{icon}</span>
      <span className={`${text.includes('Quantity') ? 'product-quantity' : 'product-date'}`}>{text}</span>
    </Wrapper>
  );
};

export default ProductInfo;
