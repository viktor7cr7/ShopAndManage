import FormRow from '../components/FormRow';
import FormRowSelect from '../components/FormRowSelect';
import Wrapper from '../assets/wrappers/ProfileAdmin';
import { useLoaderData } from 'react-router-dom';
import { PRODUCT_CATEGORY } from '../utils/constants';
import { Form, useNavigation, redirect, } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const loader = async ({params}) => {
    try {
      const {data} = await customFetch.get(`admin/product/${params.id}`)
      return data
    } catch (error) {
      toast.error(error?.response?.data?.msg) 
      return redirect('/dashboard/admin/all-products')     
    }
}

export const action = async ({request,params}) => {
  const formData = await request.formData()

  const file = formData.get('image_url');
  if (file && file.size > 500000) {
    toast.error('Image size too large');
    return null;
  }

  try {
    await customFetch.patch(`admin/product/${params.id}`, formData)
    toast.success('Product edited successfully')
    return redirect('/dashboard/admin/all-products')
  } catch (error) {
    return toast.error(error?.response?.data?.msg)
  }
}

const EditJob = () => {
  const {product} = useLoaderData()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <Wrapper>
      <Form method='post' className='form' encType='multipart/form-data' >
        <h4 className='form-title'>edit product</h4>
        <div className='form-center'>
          <FormRow type='text' name='name' defaultValue={product.name}></FormRow>
          <FormRow type='number' name='price' min={'0'} defaultValue={product.old_price}></FormRow>
          <FormRowSelect
            name='category'
            labelText='product category'
            defaultValue={product.category}
            list={Object.values(PRODUCT_CATEGORY)}> 
          </FormRowSelect>
          <FormRow type='number' min={'0'} name='stock_quantity' labelText={'quantity'} defaultValue={product.stock_quantity}></FormRow>
          <div className='form-row'>
          <label htmlFor='image' className='form-label'>
            Select an image file (max 0.5 MB):
          </label>
          <input
            type='file'
            id='product_img'
            name='file'
            className='form-input'
            accept='image/*'
          />
        </div>
        <div className="form-row">
        <label htmlFor={name} className='form-label'>desctiption</label>
                <textarea style={{ height: '100px' }} type='text'
                id='description'
                name='desrtiption'
                className='form-input'
                defaultValue={product.description}
                required>
                </textarea>
        </div>
          <button type='submit' className='btn btn-block form-btn'
          disabled={isSubmitting}>
            {isSubmitting ? 'submitting' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  )
}

export default EditJob