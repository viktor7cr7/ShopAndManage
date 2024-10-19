import Wrapper from '../assets/wrappers/RegistrationAndLoginPage';

import { Link, useNavigate, Form } from 'react-router-dom';
import FormRow from '../components/FormRow';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  const token = url.searchParams.get('token');
  const { type } = params;
  data.email = email;
  data.token = token;
  let endpoint, redirectPath;
  if (type === 'admin') {
    endpoint = '/auth/admin/reset-password';
    redirectPath = '/login/admin';
  } else {
    endpoint = '/auth/reset-password';
    redirectPath = '/login/user';
  }

  try {
    await customFetch.post(endpoint, data);
    toast.success('Пароль успешно обновлен');
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirectPath,
      },
    });
  } catch (error) {
    return toast.error(error?.response?.data?.msg);
  }
};

const ResetPassword = () => {
  const navigation = useNavigate();
  const isSubmitting = navigation.state === 'submitting';
  return (
    <Wrapper>
      <div>
        <Form method="post" className="form">
          <h4>Введите новый пароль</h4>
          <FormRow type="password" name="password" required={true}></FormRow>
          <p>
            <Link to={'/'} className="login-link">
              Главная страница
            </Link>
          </p>
          <button disabled={isSubmitting} className="btn btn-block" style={{ marginTop: '1rem' }}>
            {isSubmitting ? 'sumbitting..' : 'submit'}
          </button>
        </Form>
      </div>
    </Wrapper>
  );
};

export default ResetPassword;
