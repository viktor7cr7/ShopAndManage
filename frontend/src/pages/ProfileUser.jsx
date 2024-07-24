import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useOutletContext, Form, useLoaderData } from "react-router-dom";
import { useNavigation } from "react-router-dom";
import Wrapper from "../assets/wrappers/ProfileUser";
import FormRow from "../components/FormRow";
import ProgressBar from "../components/Grades";
import { useDiscount } from "../contexts/DiscountContext";
import { DOLLAR_EXCHANGE_RATE } from "../../../utils/constants";

export const loader = async () => {
    try {
        const {data} = await customFetch('/total-amount')
        return data
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
}

export const action = async ({request}) => {
    const formData = await request.formData();
  
    const file = formData.get('avatar');
    if (file && file.size > 500000) {
      toast.error('Image size too large');
      return null;
    }
  
    try {
      await customFetch.patch(`/update-info`, formData);
      toast.success('Данные успешно обновлены');
      return null
    } catch (error) {
      toast.error(error?.response?.data?.msg);
      throw new Error(error.message)
    }
  }
  
  const Profile = () => {
      const { user } = useOutletContext();
      const {email, userId } = user;
      const navigation = useNavigation();
      const discount = useDiscount()
      const {totalAmount} = useLoaderData()
      const totalValue = totalAmount[0].sum
      const isSubmitting = navigation.state === 'submitting'
      const infoGrade = {
        summAmount: Math.round((totalValue || 0) * DOLLAR_EXCHANGE_RATE),
        currentLevel: 'Новичок',
        nextPriceLevel: 1
      }
      if (infoGrade.summAmount <= 25000 && infoGrade.summAmount !== 0) {
        infoGrade.currentLevel = 'Любитель'
        infoGrade.nextPriceLevel = 25000 - infoGrade.summAmount
      } else if (infoGrade.summAmount > 25000 && infoGrade.summAmount < 50000) {
        infoGrade.currentLevel = 'Профессионал',
        infoGrade.nextPriceLevel = 50000 - infoGrade.summAmount
      } else if (infoGrade.summAmount >= 50000 ) {
        infoGrade.currentLevel = 'Лидер',
        infoGrade.nextPriceLevel = 'Максимальный уровень'
      }
    

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
          <FormRow type='email' name='email' defaultValue={email} />
          <input type='hidden' name='author_id' value={userId}></input>
          <button
            className='btn btn-block form-btn'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'submitting...' : 'save changes'}
          </button>
        </div>
      </Form>
      <div className="grades-container">
            <div className="grades-header">Grages</div>
            <ProgressBar amount={infoGrade.summAmount}></ProgressBar>
            <div className="grades-header">My grades</div>
            <div className="info-grades">
                <div className="info-text">Ваша сумма покупок: <span className="info-value">{infoGrade.summAmount} руб</span></div>
                <div className="info-text">Ваш уровень: <span className="info-value">{infoGrade.currentLevel}</span></div>
                <div className="info-text">До следующего уровня: <span className="info-value">{infoGrade.nextPriceLevel} руб</span></div>
                <div className="info-text">Персональная скидка на все товары: <span className="info-value-discount">{discount}%</span></div>
            </div>
        </div>
    </Wrapper>
    )
  }
  
  export default Profile