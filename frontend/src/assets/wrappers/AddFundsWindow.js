import styled from "styled-components";

const Wrapper = styled.div`
    background-color: #fff;
    .btn-back {
        height: 36px;
    min-width: auto;
    width: auto;
    margin-bottom: 20px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    color: #919191;
    transition: 0.3s all ease;
    letter-spacing: 0.08rem;
    }

    .btn-back:hover {
        cursor: pointer;
        color: black
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
    letter-spacing: .0125em;
    line-height: 3rem;
    word-break: break-all;
}

.modal-content {
    padding: 24px 24px 16px;
}

.content-method {
    display: flex;
    width: 200px;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 36px;
}

.total-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 3rem;
    font-size: 1.2rem;
    font-weight: 700;
    line-height: 2rem;
}

.action-add-funds {
    width: 100%;
    background-color: #199de1;
    color: #fff;
    font-size: 1.2rem;
    border: none;
    border-radius: 5px;
    line-height: 2rem;
    font-weight: bold;
    transition: 0.3s all ease;
    margin-top: 1.5rem;
}

.action-add-funds:hover {
    cursor: pointer;
    background-color: #0083c5;
}
`

export default Wrapper