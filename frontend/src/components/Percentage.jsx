import Wraper from '../assets/wrappers/Percentage';
const Percentage = ({ percentage }) => {
  return (
    <Wraper>
      <div className="percentage-product">
        <span>{`-${percentage}%`}</span>
      </div>
    </Wraper>
  );
};

export default Percentage;
