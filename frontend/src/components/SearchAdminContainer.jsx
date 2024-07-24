import FormRow from './FormRow';
import FormRowSelect from './FormRowSelect';
import Wrapper from '../assets/wrappers/ProfileAdmin.js';
import { Form, useSubmit, Link } from 'react-router-dom';
import { PRODUCT_CATEGORY,PRODUCT_STATUS, PRODUCT_SORT_BY} from '../utils/constants.js';
import { useAllProductsContext } from '../pages/AllProducts';


const SearchAdminContainer = () => {
  const submit = useSubmit()

  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(form);
      }, 1000);
    };
  };


  const {searchValues} = useAllProductsContext()
  const {search, productStatus, productCategory, sort} = searchValues
  return (
    <Wrapper>
    <Form className='form'>
      <h5 className="form-title">search form</h5>
      <div className="form-center">
        <FormRow type='search' name='search' defaultValue={search}
        onChange={debounce((form) =>{submit(form)})}></FormRow>
        <FormRowSelect labelText='product category'
        name='productCategory'
        list={['all', ...PRODUCT_CATEGORY]}
        defaultValue={productCategory}
        onChange={(e) => submit(e.currentTarget.form)}></FormRowSelect>
        <FormRowSelect labelText='product status'
        name='productStatus'
        list={['all', ...Object.values(PRODUCT_STATUS)]}
        defaultValue={productStatus}
        onChange={(e) => submit(e.currentTarget.form)}></FormRowSelect>
        <FormRowSelect name='sort' defaultValue={sort}
        list={[...Object.values(PRODUCT_SORT_BY)]}
        onChange={(e) => submit(e.currentTarget.form)}></FormRowSelect>
        <Link to='/dashboard/admin/all-products' className='btn form-btn delete-btn'>Reset Search Values</Link>
      </div>
    </Form>
  </Wrapper>
  )
}

export default SearchAdminContainer