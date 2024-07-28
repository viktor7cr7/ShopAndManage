import { toast } from 'react-toastify';
import ProductsContainer from '../components/ProductsContainerAdmin';
import SearchAdminContainer from '../components/SearchAdminContainer';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';

export const loader = async({request}) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries()
  ])
  try {
    const {data} = await customFetch('/admin/products', {params})
    console.log(data)
    return {data, searchValues: {...params}}
  } catch (error) {
    return toast.error(error?.response?.data?.msg)
  }
}

const AllProductsContext = createContext()

const AllJobs = () => {
  const {data, searchValues} = useLoaderData()
  return (
    <AllProductsContext.Provider value={{data, searchValues}}>
      <SearchAdminContainer></SearchAdminContainer>
      <ProductsContainer></ProductsContainer>
    </AllProductsContext.Provider>
  )
}

export const useAllProductsContext = () => useContext(AllProductsContext)

export default AllJobs