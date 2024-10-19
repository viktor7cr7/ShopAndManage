import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  .logout-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    height: 35px;
    padding: 0.575rem 0.75rem;
  }
  .img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }
  .dropdown {
    position: absolute;
    top: 45px;
    left: 0;
    width: 100%;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    text-align: center;
    visibility: hidden;
    border-radius: 0.25rem;
    background: #2cb1bc;
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    border-radius: 0.25rem;
    padding: 0.4rem;
    background: transparent;
    border-color: transparent;
    color: #fff;
    letter-spacing: 1px;
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }
`;

export default Wrapper;
