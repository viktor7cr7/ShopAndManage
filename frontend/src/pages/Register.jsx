import {Form, redirect, useNavigation, useParams, Link  } from 'react-router-dom'
import FormRow from '../components/FormRow'
import { toast } from 'react-toastify'
import Wrapper from '../assets/wrappers/RegistrationAndLoginPage'
import customFetch from '../utils/customFetch'

export const action = async({request, params}) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  const {type} = params
  let endpoint, redirectPath;
  if (type === 'admin') {
    endpoint = '/auth/admin/register'
    redirectPath = '/login/admin'
  } else {
    endpoint = '/auth/register'
    redirectPath = '/login/user'
  }

  try {
    await customFetch.post(endpoint,data)
    toast.success('Registartion successful')
    return redirect(redirectPath)
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    throw new Error(error.message)
  }

}

const Register = () => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const { type } = useParams();
  return (
        <Wrapper>
            <div>
            <Form method='post' className='form'>
             <h4>{type === 'admin' ? 'Admin Register' : 'User Register'}</h4>
            <FormRow type='text' name='name' required={true}></FormRow>
            <FormRow type='email' name='email' required={true}></FormRow>
            <FormRow type='password' name='password' required={true}></FormRow>
            <p>
                У вас уже есть аккаунт?
                <Link to={type === 'admin' ? '/login/admin' : '/login/user'} className='login-link'>
                Войти
                </Link>
            </p>
            <button type='sumbit' className='btn btn-block' disabled={isSubmitting}>
              {isSubmitting ? 'submitting' : 'submit'}
            </button>
        </Form>
    </div>
        </Wrapper>
  )
}

export default Register