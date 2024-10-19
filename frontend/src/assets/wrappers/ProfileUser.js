import styled from 'styled-components';

const Wrapper = styled.section`
  border-radius: 0.25rem;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .form-title {
    margin-bottom: 2rem;
  }
  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 3rem 2rem 4rem;
    max-width: 100%;
    width: 100%;
  }
  .form-row {
    margin-bottom: 0;
  }
  .form-center {
    display: grid;
    row-gap: 1rem;
  }
  .form-btn {
    align-self: end;
    margin-top: 1rem;
    display: grid;
    place-items: center;
  }

  .grades-header,
  .my-grades {
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
    margin-top: 2rem;
  }

  .grades-content {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }

  .info-text {
    font-size: 19px;
    margin-bottom: 10px;
  }

  .info-value {
    font-weight: bold;
    color: #199de1;
  }

  .info-value-discount {
    font-weight: bold;
    color: #e12b1b;
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1rem;
    }
  }
  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;

export default Wrapper;
