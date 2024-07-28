import Wrapper from "../assets/wrappers/RegistrationAndLoginPage";

import { Link, useNavigate, useParams, Form} from 'react-router-dom'
import FormRow from "../components/FormRow";
import {toast} from 'react-toastify'
import customFetch from '../utils/customFetch'

export const action = async({request, params}) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const {type} = params
    let endpoint 
    if (type === 'admin') {
        endpoint = '/auth/admin/forgot-password'
      } else {
        endpoint = '/auth/forgot-password'
      }

    try {
      await customFetch.post(endpoint, data)
      toast.success('Письмо отправлено на почту, перейдите и активируйте новый пароль')
      return null
    } catch (error) {
      return toast.error(error?.response?.data?.msg)
    }
  }

const ForgotPassword = () => {
    const navigation = useNavigate()
    const isSubmitting = navigation.state === 'submitting'
    let { type } = useParams();
    return (
        <Wrapper>
            <div>
            <Form method='post' className='form' >
            <h4>Введите ваш email</h4>
                <FormRow type='email' name='email' required={true}></FormRow>
                    <p>
                У вас уже есть аккаунт?
                <Link to={type === 'admin' ? '/login/admin' : '/login/user'} className='login-link'>
                Войти
                </Link>
            </p>
                <button disabled={isSubmitting} className='btn btn-block'>
                    {isSubmitting ? 'sumbitting..' : 'submit'}
                </button>
            </Form>
            </div>
        </Wrapper>
      )
}

export default ForgotPassword