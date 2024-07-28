import customFetch from '../utils/customFetch'
import { redirect } from 'react-router-dom'
import {toast} from 'react-toastify'

export const action = async({params}) => {
  try {
    await customFetch.delete(`/admin/product/${params.id}`)
    toast.success('Product delete success')
  } catch (error) {
    return toast.error(error?.response?.data?.msg) 
  }
  return redirect('/dashboard/admin/all-products')
}

export default action