import styled from "styled-components";

const Wrapper = styled.section`
    form {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem 1.5rem;
        margin: 0.5rem auto;
    }
    

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); 
  gap: 10px;
  height: 300px;
}

.full-width {
  grid-column: 1 / -1;
}

.bth-action {
    height: 34px;
    min-width: 41px;
    font-size: 14px;
    background-color: #199de1;
    color: #fff;
    display: flex;
    border-radius: 28px;
    margin-right: 10px;
    border-color: cyan;
    border: none;
    transition: box-shadow 0.3s ease;
    padding: 10px;
    text-align: center;
    cursor: pointer;
}

  .btn-range {
    border: none;
    background-color: #199de1;
    color: #fff;
    padding: 5px;
    border-radius: 12px;
    width: 60px;
    cursor: pointer;
  }

  .link-reset {
    margin-top: 10px;
    border-color: cyan;
    border: none;
    transition: box-shadow 0.3s ease;
    background-color: #199de1;
    height: 34px;
    min-width: 41px;
    font-size: 14px;
    background-color: #199de1;
    border-radius: 16px;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export default Wrapper