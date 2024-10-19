import FormRow from '../components/FormRow';
import Wrapper from '../assets/wrappers/ProfileAdmin';
import { Form, useNavigation, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';
import FormRowSelect from '../components/FormRowSelect';
import { PRODUCT_CATEGORY } from '../utils/constants';

export const action = async ({ request }) => {
  const formData = await request.formData();

  const file = formData.get('image_url');
  if (file && file.size > 500000) {
    toast.error('Image size too large');
    return null;
  }

  try {
    await customFetch.post('/admin/products', formData);
    toast.success('Товар успешно добавлен');
    return redirect('/dashboard/admin/all-products');
  } catch (error) {
    return toast.error(error?.response?.data?.msg);
  }
};

const AddJob = () => {
  const navigate = useNavigation();
  const isSubmitting = navigate.state === 'submitting';
  return (
    <Wrapper>
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title"></h4>
        <div className="form-center form-filters">
          <FormRow type="text" name="name" required={true} id="name"></FormRow>
          <FormRow type="number" name="price" required={true} min={1} id="price"></FormRow>
          <FormRow type="text" name="description" required={true} minLength={10} id="description"></FormRow>
          <FormRowSelect name={'category'} list={PRODUCT_CATEGORY} id="category"></FormRowSelect>
          <div className="form-row">
            <label htmlFor="image" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input type="file" id="product_img" name="file" className="form-input" accept="image/*" />
          </div>
          <FormRow type="text" name="stock_quantity" labelText={'quantity'} id="quantity"></FormRow>
          <button type="submit" className="btn btn-block form-btn" disabled={isSubmitting}>
            {isSubmitting ? 'submitting' : 'submit'}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default AddJob;
