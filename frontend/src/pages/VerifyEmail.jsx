import Wrapper from "../assets/wrappers/RegistrationAndLoginPage";

import { Link, useNavigate, useParams, Form} from 'react-router-dom'
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async ({request, params}) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const token = url.searchParams.get('token');
    const {type} = params
    try {
        await customFetch.post(`/auth/verify-email/${type}?token=${token}&email=${email}`)
        return null
    } catch (error) {
        toast.error(error?.response?.data?.msg) 
        throw new Error(message.error)
    }
    
}

const VerifyEmail = () => {
    const navigation = useNavigate()
    const isSubmitting = navigation.state === 'submitting'
    let { type } = useParams();
    return (
        <Wrapper>
            <div>
            <Form method='post' className='form' >
            <h4>Успех! Ваша почта подтвержденна, можете авторизоваться в системе</h4>
                <Link to={type === 'admin' ? '/login/admin' : '/login/user'} className='btn btn-block' style={{marginLeft:'0rem', textAlign: 'center'}}>
                Войти
                </Link>
            </Form>
            </div>
        </Wrapper>
      )
}

export default VerifyEmail