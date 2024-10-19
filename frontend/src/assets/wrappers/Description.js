import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    display: ${(props) => (props.show ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s ease;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 800px;
    height: 50%;
    position: relative;
    background: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    transition-duration: transform 2.5s, ease-out 0.5s;
    z-index: 1200;
    padding: 20px;
  }

  .descr-content {
    width: 100%;
    max-height: 200px;
    margin-top: 0.5rem;
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }

  .descr-body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .close-btn {
    display: block;
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }

  .descr-header {
    width: 95%;
    top: 2rem;
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .product-name {
    font-size: 38px;
    height: inherit;
  }

  .product-id {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    color: #333;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    margin-right: 10px;
    padding-bottom: 2px;
    font-size: 16px;
    font-weight: bold;
    font-size: 38px;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
`;

export default Wrapper;
