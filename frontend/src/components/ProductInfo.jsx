import Wrapper from "../assets/wrappers/ProductInfo"

const ProductInfo = ({icon, text}) => {
  return (
    <Wrapper>
        <span className="products-icon">{icon}</span>
        <span className="products-text">{text}</span>
    </Wrapper>
  )
}

export default ProductInfo