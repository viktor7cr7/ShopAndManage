import { ProgressBarContainer, Progress, Level, LevelImage, ProgressLabel } from "../assets/wrappers/ProgressBar";
const baseUrl = import.meta.env.VITE_BASE_URL_IMG;
console.log(baseUrl)
const getColor = (amount) => {
    if (amount >= 0) return 'gold';
    if (amount >= 25000) return 'green';
    return 'blue';
  };
  
  const getPercentage = (amount) => {
    if (amount <= 0) return 0;
    return (amount / 50000) * 100;
  };

const ProgressBar = ({ amount }) => {
    const color = getColor(amount);
    const percentage = getPercentage(amount);
  
    return (
      <div style={{  padding: '5px'}} className="progress-container">
        <ProgressBarContainer className="progress-bar">
          <Progress color={color} percentage={percentage}></Progress>
        </ProgressBarContainer>
        <Level>
          <div className="discount-info">
            <LevelImage src={`${baseUrl}\\icons8-medal-64.png`} alt="Start Level" />
            <ProgressLabel>1+ руб</ProgressLabel>
            <span className="discount">Discount: 5%</span>
          </div>
          <div className="discount-info">
            <LevelImage src={`${baseUrl}\\icons8-medal-64.png`} alt="Next Level" />
            <ProgressLabel>25000+ руб</ProgressLabel>
            <span className="discount">Discount: 15%</span>
          </div>
          <div className="discount-info">
            <LevelImage src={`${baseUrl}\\icons8-medal-64.png`} alt="Higher Level" />
            <ProgressLabel>50000+ руб</ProgressLabel>
            <span className="discount">Discount: 25%</span>
          </div>
        </Level>
      </div>
    );
  };
  
  export default ProgressBar