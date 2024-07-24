import { useEffect, useState } from "react";
import { StarWrapper, Star } from "../assets/wrappers/RatingSetProduct";
import { toast } from 'react-toastify';
import customFetch from "../utils/customFetch";

const RatingStar = ({ productId, itemId, orderId }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [currentRating, setCurrentRating] = useState(null)

    useEffect(() => {
      const fetchRating = async () => {
        const {data} = await customFetch.post('/orders/item/rating', {productId, itemId})
      setCurrentRating(data.rating.rating || 0)
      }
      fetchRating()
    }, [rating])


    const handleClick = (ratingValue) => {
      handleRating(ratingValue);
    };

    const handleRating = async (rate) => {
      try {
        await customFetch.put(`/products/${itemId}`, {
          productId,
          rating: rate,
          orderId
        });
        setRating(rate);
        toast.success('Спасибо за отзыв!')
      } catch (error) {
        toast.error(error?.response?.data?.msg)
        throw new Error(error.message)
      }
    };

    return (
      <StarWrapper>
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={ratingValue}>
              <input
                style={{ display: 'none' }}
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => handleClick(ratingValue)}
              />
              <Star
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                filled={ratingValue <= currentRating}
                interactive={false}
              >
                ★
              </Star>
            </label>
          );
        })}
      </StarWrapper>
    );
  };

  export default RatingStar