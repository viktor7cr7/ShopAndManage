import styled from 'styled-components';

const Wrapper = styled.div`
  .add-funds {
    margin: 0 auto;
    padding: 0 10px;
    background-color: white;
  }

  .block-payments {
    display: flex;
    padding: 10px;
    margin-top: 20px;
  }

  .block-header {
    padding-left: 5px;
    border-radius: 5px;
    background-color: #199de1;
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    color: beige;
    font-size: 1.45rem;
    font-weight: 500;
    letter-spacing: 0.0125em;
    line-height: 3rem;
    word-break: break-all;
  }

  .payment-methods {
    display: flex;
    justify-content: center;
    background-color: #e2e2e2;
    padding: 15px;
    align-items: center;
    flex-direction: column;
    gap: 5px;
    width: 250px;
    border-radius: 10px;
    border: none;
  }

  .payment-methods:hover {
    cursor: pointer;
  }

  .payment-text {
    font-size: 10px;
  }

  .select-method {
    letter-spacing: 0.1rem;
    display: inline-block;
    margin-top: 15px;
    font-size: 25px;
    font-weight: bold;
  }

  .payment-text {
    font-size: 18px;
    font-weight: bold;
  }
`;

export default Wrapper;
