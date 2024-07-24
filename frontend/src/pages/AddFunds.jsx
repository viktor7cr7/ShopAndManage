import React from 'react'
import Wrapper from '../assets/wrappers/AddFunds';
import { FaRegCreditCard } from "react-icons/fa";
import { useState } from 'react';
import WrapperWindow from '../assets/wrappers/AddFundsWindow';
import FormRow from '../components/FormRow';
import { Form, useNavigation } from 'react-router-dom';
import { useTransition } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch';

export const action = async ({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        const response = await customFetch.patch('/create-checkout-session', data)

        const sessionUrl = response.data.session.url;
        window.location.href = sessionUrl
        return null
    } catch (error) {
        toast.error(error?.response?.data?.msg)
        throw new Error(error.message)
    }
}

const AddFunds = () => {
  const [display, setDislay] = useState(true)
  const transition = useTransition()
  const [cost, setCost] = useState(Number(0).toFixed(2))
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting'
   const dispatchDisplay = () => {
    setDislay(!display)
  }

  const changeCost = (value) => {
    if (value < 0) return
    setCost(Number(value).toFixed(2))
  }

  return (
    <Wrapper>
    <div className="block-header" style={display ? {width: '100%'} : {width: '600px'}}>Add Funds</div>
    <div className='add-funds' style={display ? {display: 'block'} : {display: 'none'}}>
        <span className='select-method'>Выберите метод:</span>
        <div className="block-payments">
        <button className="payment-methods" onClick={dispatchDisplay}>
            <div className="methods-img">
            <FaRegCreditCard style={{fontSize: '13rem'}}></FaRegCreditCard>
            </div>
            <div className="payment-text">Card</div>
        </button>
        </div>
    </div>
    <Form method='post' encType='multipart/form-data'>
    <WrapperWindow style={{maxWidth: '600px'}}>
    <div className="modal-content" style={display ? {display: 'none'} : {display: 'block'}}>
        <div className="back">
        <button className='btn-back' onClick={dispatchDisplay}>
        <svg data-v-39ce4537="" data-v-00086cf6="" xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5" fill="none" class="header__currency--arr" style={{marginRight: '10px',
    transform:'rotate(90deg)'}}><path data-v-39ce4537="" d="M7 1L4 4L1 1" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>Back</button>
        </div>
        <div className="content-method">
        <FaRegCreditCard style={{}}></FaRegCreditCard>
            <h4 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Credit Card</h4>
        </div>
        <FormRow labelText={'Amount USD'} min={'5'} type={'number'} required={true} onChange={(e) => changeCost(e.target.value)} name={'amount'}></FormRow>
        <div className="modal-header">
            <div className="total-price">
                <span>Итого к оплате:</span>
                <span>$ {cost}</span>
            </div>
            <button className="action-add-funds">
                {isSubmitting ? 'Загрузка...' : 'Перейти к оплате'}
              </button>
        </div>
    </div>
    </WrapperWindow>
    </Form>
    </Wrapper>
    
  )
}

export default AddFunds