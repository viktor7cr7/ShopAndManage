import FormRow from '../components/FormRow';
import Wrapper from '../assets/wrappers/ProfileAdmin';
import { useOutletContext } from 'react-router-dom';
import { useNavigation, Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = async ({request}) => {
  const formData = await request.formData();

  const file = formData.get('avatar');
  if (file && file.size > 500000) {
    toast.error('Image size too large');
    return null;
  }

  try {
    await customFetch.patch(`/admin/update-info`, formData);
    toast.success('Данные успешно обновлены');
    return null
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    throw new Error(error.message)
  }
}

const Profile = () => {
    const { user } = useOutletContext();
    const { name, email, author_id } = user;
    const navigation = useNavigation();
    const isSubmitting = navigation.state === 'submitting'
  return (
    <Wrapper>
    <Form method='post' className='form' encType='multipart/form-data'>
      <h4 className='form-title'>profile</h4>

      <div className='form-center'>
        <div className='form-row'>
          <label htmlFor='image' className='form-label'>
            Select an image file (max 0.5 MB):
          </label>
          <input
            type='file'
            id='avatar'
            name='avatar'
            className='form-input'
            accept='image/*'
          />
        </div>
        <FormRow type='text' name='name' defaultValue={name} />
        <FormRow type='email' name='email' defaultValue={email} />
        <input type='hidden' name='author_id' value={author_id}></input>
        <button
          className='btn btn-block form-btn'
          type='submit'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'submitting...' : 'save changes'}
        </button>
      </div>
    </Form>
  </Wrapper>
  )
}

export default Profile