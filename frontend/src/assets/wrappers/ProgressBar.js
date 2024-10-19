import styled from 'styled-components';

export const ProgressBarContainer = styled.div`
  width: 100%;
  background-color: #e0e0df;
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
`;

export const Progress = styled.div`
  height: 20px;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
  transition: width 0.5s ease-in-out;
`;

export const Level = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  .discount-info {
    display: flex;
    flex-direction: column;
    row-gap: 0.3rem;
    align-items: center;
  }

  span.discount {
    color: rgba(0, 0, 0, 0.6);
    font-size: 12px;
  }
`;

export const LevelImage = styled.img`
  width: 30px;
  height: 30px;
`;

export const ProgressLabel = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;
