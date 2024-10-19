import styled from 'styled-components';

const ModalWrapper = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .action-buy {
    height: 40px;
    font-size: 17px;
    margin-top: 0.5rem;
    cursor: pointer;
    width: 30%;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .name-product {
    letter-spacing: normal;
    font-weight: bold;
  }

  @media (min-width: 992px) {
    .form-center {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      row-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr;
      row-gap: 1rem;
    }
  }

  .form-label {
    margin-bottom: 0.5rem;
  }

  .result {
    margin-top: 0.5rem;
    font-size: 20px;
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
`;

const Overlay = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export { ModalWrapper, Overlay };
