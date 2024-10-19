import styled from 'styled-components';

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    border-bottom: solid 3px red;
    background: aliceblue;
    color: black;
    font-weight: bold;
    padding: 10px;
    cursor: pointer;
    &:hover .sort-icon {
      display: inline-block;
    }
  }

  tr > th:nth-child(1) {
    width: 10%;
  }

  tr > th:nth-child(2) {
    width: 20%;
  }

  tr > th:nth-child(3) {
    width: 20%;
  }

  tr > th:nth-child(4) {
    width: 25%;
  }

  td {
    padding: 10px;
    border: solid 1px gray;
    background: papayawhip;
  }
`;

export const SortIcon = styled.span`
  display: none;
  position: absolute;
  right: 10px;
  background: gray;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  color: white;
  &.active {
    display: inline-block;
    background: green;
  }
`;

export default StyledTable;
