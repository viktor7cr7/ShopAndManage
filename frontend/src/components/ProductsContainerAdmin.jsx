import Products from './ProductsAdmin'
import Wrapper from '../assets/wrappers/ProductsContainer'
import { useAllProductsContext } from '../pages/AllProducts'
import PageBtnContainer from './PageBtnContainerAdmin'

const ProductsContainer = () => {
  const {data} = useAllProductsContext()
  const {products, totalProducts, numOfPages} = data
  if(totalProducts.length === 0) {
    return (
        <Wrapper>
            <h2>Нет товаров для отображения...</h2>
        </Wrapper>
    )
  }
  return (
    <Wrapper>
      <h5>
        {totalProducts} товаров{totalProducts.length > 1} найдено
      </h5>
        <div className='products'>
            {products.map((product) =>{
                return <Products key={product.product_id} {...product}></Products>
            })}
        </div>
        {numOfPages > 1 && <PageBtnContainer></PageBtnContainer>}
    </Wrapper>
  )
}

export default ProductsContainer