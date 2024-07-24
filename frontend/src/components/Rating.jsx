import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import Wrapper from '../assets/wrappers/Rating';

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <Wrapper>
        <div className="star-rating">
      {[...Array(filledStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={solidStar} />
      ))}
      {halfStar && <FontAwesomeIcon icon={regularStar} />}
      {[...Array(emptyStars)].map((_, index) => (
        <FontAwesomeIcon key={index} icon={regularStar} />
      ))}
    </div>
    </Wrapper>
  );
};

export default StarRating;