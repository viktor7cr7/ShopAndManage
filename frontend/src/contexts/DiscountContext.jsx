import { useState, useContext, createContext, useEffect } from "react";
import { loader as profileLoader } from "../pages/ProfileUser";

const DiscountContext = createContext()

export const useDiscount = () => useContext(DiscountContext)

export const DiscountProvider = ({children}) => {
    const [discount, setDiscount] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
          const data = await profileLoader();
          const totalValue = data.totalAmount[0].sum;
          const summAmount = Math.round((totalValue || 0) * 87.90);
    
          let calculatedDiscount = 0;
          if (summAmount <= 25000 && summAmount !== 0) {
            calculatedDiscount = 5;
          } else if (summAmount > 25000 && summAmount < 50000) {
            calculatedDiscount = 15;
          } else if (summAmount >= 50000) {
            calculatedDiscount = 25;
          }
    
          setDiscount(calculatedDiscount);
        };
    
        fetchData();
      }, []);

      return <DiscountContext.Provider value={discount}>
        {children}
      </DiscountContext.Provider>
}