import styled from "styled-components";

export const StarWrapper = styled.div`
  display: flex;
  direction: row;
  margin-top: 1rem;
`;


export const Star = styled.span`
  font-size: 2rem;
  color: ${props => (props.filled ? 'gold' : 'lightgray')};
  cursor: ${props => (props.interactive ? 'pointer' : 'default')};
    &:hover {
    color: #ffc107;
  }
`;