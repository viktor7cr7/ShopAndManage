import Wrapper from '../assets/wrappers/RegistrationAndLoginPage';

import { Link, useNavigate, useParams, Form, redirect } from 'react-router-dom';
import FormRow from '../components/FormRow';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const { type } = params;
  let endpoint, redirectPath;
  if (type === 'admin') {
    endpoint = '/auth/admin/login';
    redirectPath = '/dashboard/admin/add-product';
  } else {
    endpoint = '/auth/login';
    redirectPath = '/dashboard/user/all-products';
  }

  try {
    await customFetch.post(endpoint, data);
    toast.success('login successful');
    return redirect(redirectPath);
  } catch (error) {
    return toast.error(error?.response?.data?.msg);
  }
};

const Login = () => {
  const navigation = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  let { type } = useParams();

  return (
    <Wrapper>
      <div>
        <Form method="post" className="form">
          <h4>{type === 'admin' ? 'Admin Login' : 'User Login'}</h4>
          <FormRow type="email" name="email" required={true}></FormRow>
          <FormRow type="password" name="password" required={true}></FormRow>
          <button type="submit" disabled={isSubmitting} className="btn btn-block">
            {isSubmitting ? 'sumbitting..' : 'submit'}
          </button>
          <p>
            Не имеете аккаунта?
            <Link to={type === 'admin' ? '/register/admin' : '/register/user'} className="member-btn ">
              Регистрация
            </Link>
          </p>
          <Link
            to={type === 'admin' ? '/forgot-password/admin' : '/forgot-password/user'}
            className="member-btn"
            style={{ marginTop: '0.5rem', textAlign: 'center', display: 'block' }}
          >
            Забыли пароль?
          </Link>
        </Form>
      </div>
    </Wrapper>
  );
};

export default Login;
