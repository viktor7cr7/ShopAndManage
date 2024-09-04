import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FormRow from "./FormRow";
import { useNavigate } from "react-router-dom";
import '../assets/css/datePickerStyle.css'
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
const DiscountModal = ({ onClose, onSave, product_id }) => {
    const [percentage, setDiscount] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    let minToNextDay = new Date()
    minToNextDay.setDate(minToNextDay.getDate() + 1);
    const [endDate, setEndDate] = useState(minToNextDay);

    const navigate = useNavigate()
    const handleSave = (e) => {
        e.preventDefault()
        onSave({ percentage, startDate, endDate });
        onClose();
    };

    const handleDelete = async () => {
        try {
            await customFetch.delete(`admin/product/discount/${product_id}`);
            toast.success('Скидка успешно удалена');
            navigate('/dashboard/admin/all-products')
            onClose();
        } catch (error) {
           return toast.error(error?.response?.data?.msg)
        }
    };


    return (
            <div className='modal modal-discount'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>&times;</span>
                <h2 className="form-title" style={{textAlign: "center"}}>Set Discount</h2>
                <form className="form" onSubmit={handleSave}>
                    <FormRow labelText={'discount %'} type={'number'} value={percentage} onChange={(e) => setDiscount(e.target.value)} min={1} id='percentage'></FormRow>
                    <div className="form-center">
                    <label htmlFor='startDate'>Start Date</label>
                    <DatePicker
                        className="start-date"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat='yyyy/MM/dd'
                        required={true}
                        minDate={new Date()}
                    />
                    <label htmlFor='endDate'>End Date</label>
                    <DatePicker
                        className="end-date"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat='yyyy/MM/dd'
                        required={true}
                        minDate={minToNextDay}
                        dayClassName={(date) =>
                            date < minToNextDay ? 'blocked-day' : undefined
                          }
                        
                    />

                    </div>
                    <div className="form-footer">
                    <button type='submit' className="btn save-btn">Save</button>
                    <button type='button' className="btn delete-btn" onClick={handleDelete}>Delete Discount</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiscountModal