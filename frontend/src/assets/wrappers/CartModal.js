import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    display: ${(props) => (props.isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s ease;
  }

  .modal-content {
    position: fixed;
    top: 0;
    right: 0;
    transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
    width: 300px;
    height: 100%;
    background: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
    z-index: 1000;
    padding: 20px;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

export const ModalOverlay = styled.div`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
`;

export default Wrapper;
