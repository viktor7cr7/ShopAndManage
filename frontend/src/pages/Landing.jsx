import Wrapper from "../assets/wrappers/LandingPage";
import { Form, Link, redirect } from "react-router-dom";
import FormRow from "../components/FormRow";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async({request}) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const {userType} = data
    let endpoint, redirectPath 
    if (userType === 'admin') {
        endpoint = '/auth/admin/login'
        redirectPath = '/dashboard/admin/add-product'
      } else {
        endpoint = '/auth/login'
        redirectPath = '/dashboard/user/all-products'
      }

    try {
      await customFetch.post(endpoint, data)
      toast.success('login successful')
      return redirect(redirectPath)
    } catch (error) {
      return toast.error(error?.response?.data?.msg)
    }
  }

const Landing = () => {
    
    return (
        <Wrapper>
            <>
            <div className="container">
        <div className="section left">
            <h2 className="title-shop">Market Shop</h2>
            <p>Здесь вы можете делать покупки и отслеживать свои заказы.</p>
            <Form method="post">
            <input type='hidden' name='userType' value='user'></input>
            <FormRow type={'email'} id={'shop-email'} name={'email'} labelText={'Email:'} required={true}></FormRow>
            <FormRow type={'password'} id={'shop-password'} name={'password'} labelText={'Password:'}></FormRow>
            <div className="action-btn">
            <button type="submit" className="btn" id='user-login-button'>Войти</button>
                <Link to="/register/user" type="button" className="btn" id='user-register'>Регистрация</Link>
                <Link to="forgot-password/user" type="button" className="btn" id='user-forgot-password'>Забыли пароль?</Link>
            </div>
            </Form>
        </div>
        <div className="section right">
            <h2 className="title-admin-panel">Admin Panel</h2>
            <p>Здесь вы можете управлять продуктами и отслеживать заказы.</p>
            <Form method="post">
            <input type='hidden' name='userType' value='admin'></input>
            <FormRow type={'email'} id={'admin-email'} name={'email'} labelText={'Email:'} required={true}></FormRow>
            <FormRow type={'password'} id={'admin-password'} name={'password'} labelText={'Password:'}></FormRow>
             <div className="action-btn">
             <button type="submit" className="btn" id="admin-login-button">Войти</button>
                <Link to='/register/admin' type="button" className="btn" id='admin-register'>Регистрация</Link>
                <Link to="forgot-password/admin" type="button" className="btn" id='admin-forgot-password'>Забыли пароль?</Link>
             </div>
            </Form>
        </div>
    </div>
            </>
        </Wrapper>
    )
}

export default Landing