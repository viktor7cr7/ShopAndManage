import { toast } from 'react-toastify';
import ProductsContainer from '../components/ProductContainerUser';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import FiltersShop from '../components/FiltersShop';

export const loader = async({request}) => {
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries()
  ])
  try {
    const {data} = await customFetch('/products', {params})
    return {data, searchValues: {...params}}
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    throw new Error(error.message)
  }
}

const AllProductsContext = createContext()

const AllJobs = () => {
  const {data, searchValues} = useLoaderData()
  return (
    <AllProductsContext.Provider value={{data, searchValues}}>
      <FiltersShop></FiltersShop>
      <ProductsContainer></ProductsContainer>
    </AllProductsContext.Provider>
  )
}

export const useAllProductsContext = () => useContext(AllProductsContext)

export default AllJobs