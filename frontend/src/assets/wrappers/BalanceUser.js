import styled from 'styled-components';

const Wrapper = styled.div`
  .balance-container {
    position: relative;
    display: inline-block;
  }

  .balance-btn {
    color: black;
    border: none;
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 35px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }

  .balance-btn:hover {
    background-color: #ababab;
  }

  .add-funds-btn {
    border: none;
    color: black;
    padding: 5px 5px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
    margin: 4px 2px;
    position: absolute;
    cursor: pointer;
    width: 100%;
    top: 100%;
    left: 0;
    border-radius: 12px;
    transition: background-color 0.3s ease;
  }

  .add-funds-btn:hover {
    background-color: #ababab;
  }

  .header__currency--arr {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }

  .header__currency--arr.rotated {
    transform: rotate(180deg);
  }
`;

export default Wrapper;
