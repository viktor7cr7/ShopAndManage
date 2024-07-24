import {useLoaderData, Outlet, Form } from "react-router-dom"
import customFetch from "../utils/customFetch"
import OrderCard from "../components/OrderUser"
import { useState } from "react"
import { OrdersProvider } from "../contexts/OrdersContext";
import FormRow from "../components/FormRow";
import FormRowSelect from "../components/FormRowSelect";
import { PRODUCT_SORT_BY, STATUS_PAYMENT } from "../utils/constants";
import { DOLLAR_EXCHANGE_RATE } from "../../../utils/constants";

export const loader = async () => {
    try {
      const {data} = await customFetch.get('/orders')
      return data
    } catch (error) {
        toast.error(error?.response?.data?.msg)
        throw new Error(error.message)
    }
}


const OrdersUser = () => {

const [value, setValue] = useState('')
const [sortByPrice, setSortByPrice] = useState('')
const [sortByDate, setSortByDate] = useState('')
const [sortByStatus, setSortByStatus] = useState('')

const handlerValue = (value) => {
  setValue(value);
}

const handlerValueDate = (value) => {
  setSortByDate(value);
}

const handlerValuePrice = (value) => {
  setSortByPrice(value);
}

const handlerValueStatus = (value) => {
  setSortByStatus(value);
}

console.log(sortByPrice)
const {orders} = useLoaderData()

const renderOrder = (items) => {
        return items.reduce((acc, order) => {
            if (!acc[order.order_id]) {
                acc[order.order_id] = {
                    order_id: String(order.order_id),
                    total_price: Number(order.total_price * DOLLAR_EXCHANGE_RATE).toFixed(2),
                    status: order.status,
                    created_at: order.created_at, 
                    items: []
                }
            }
    
            acc[order.order_id].items.push({
                item_id: order.item_id,
                product_id: order.product_id,
                product_name: order.product_name,
                quantity: order.quantity,
                price: Number(order.price * DOLLAR_EXCHANGE_RATE).toFixed(2)
            })
    
            return acc
        }, {}) 
}
    
    let result = Object.values(renderOrder(orders))


    let finalResultFilter = result.filter((order) => {
      const matchesId = value ? order.order_id.includes(value) : true;
      const matchesStatus = sortByStatus ? order.status === sortByStatus : true;
      return matchesId && matchesStatus;
    });

    finalResultFilter.sort((a, b) => {
      if (sortByPrice) {
        const priceComparison = sortByPrice ===  'desc' ? b.total_price - a.total_price : a.total_price - b.total_price;
        if (priceComparison !== 0) return priceComparison;
      }

      if (sortByDate) {
        const dateComparison = sortByDate === 'desc' ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at);
        return dateComparison;
      }
      return 0;

    })

    console.log(result)
    return (
      <OrdersProvider orders={result}>
        <Form style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', columnGap: '2rem'}}>
          <FormRow name={'Поиск по ID'} onChange={(e) => handlerValue(e.target.value)}></FormRow>
          <FormRowSelect name={'Сортировка по цене'} list={Object.values(PRODUCT_SORT_BY)} onChange={(e) => handlerValuePrice(e.target.value)}></FormRowSelect>
          <FormRowSelect name={'Сортровка по дате'} list={Object.values(PRODUCT_SORT_BY)} onChange={(e) => handlerValueDate(e.target.value)}></FormRowSelect>
          <FormRowSelect name={'Сортировка по статусу'} list={STATUS_PAYMENT} onChange={(e) => handlerValueStatus(e.target.value)}></FormRowSelect>
          </Form>
          {
            finalResultFilter.length === 0 ? (
              <h4 style={{textTransform: 'inherit'}}>Заказы не найдены</h4>) : finalResultFilter.map((order) => (
                <OrderCard key={order.order_id} order={order} />
              )
            )
          }
            <Outlet context={{ orders: result }} />
      </OrdersProvider>
    );
  };

export default OrdersUser