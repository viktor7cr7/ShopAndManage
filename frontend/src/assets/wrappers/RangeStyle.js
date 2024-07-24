import styled from 'styled-components';
import { getTrackBackground } from 'react-range';

export const WrapperRange = styled.div`
      width: 210px;
      height: 75px;
      row-gap: 0.3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto;
      text-align: center;
      grid-column: 2;
      transition: max-height 0.3s ease-out;
      overflow: hidden;
      margin-top: 10px;
`;

export const Track = styled.div`
  height: 6px;
  width: 80%;
  background: ${(props) =>
    getTrackBackground({
      values: props.values,
      colors: ['#ccc', '#548BF4', '#ccc'],
      min: props.min,
      max: props.max,
    })};
  border-radius: 3px;
  align-self: center;
`;

export const Thumb = styled.div`
  height: 16px;
  width: 16px;
  background-color: #548bf4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 2px 6px #aaa;
`;

export const ThumbLabel = styled.div`
  position: absolute;
  top: -22px;
  color: #fff;
  font-weight: bold;
  font-size: 12px;
  padding: 2px;
  border-radius: 3px;
  background-color: #548bf4;
`;