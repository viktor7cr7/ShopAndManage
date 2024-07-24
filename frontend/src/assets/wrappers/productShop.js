import styled from "styled-components";

const Wrapper = styled.section`
.product-containter {
  width: 300px;
  min-height: 410px;
  box-shadow: 2px 4px 16px 0 hsla(0, 0%, 61.6%, .25), 1px 1px 4px 0 rgba(78, 78, 78, .1);
  border-radius: 32px;
}

.product-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-height: 102px;
  border-radius: 32px 32px 30% 30%;
  background: linear-gradient(360deg, rgb(200, 0, 0) 0%, rgb(200, 0, 0) 100%);
}

.product-body {
  border-top: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  padding: 16px;
}

.product-name {
      font-family: 'Arial', sans-serif;
      font-weight: bold;
      color: #333;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      margin-right: 10px;
      font-size: 16px;
      height: 32px;
      font-weight: bold;
      row-gap: 0.5rem;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
}

.product_img {
  position: relative;
  width: 250px;
  height: 270px;
}

.product_img>img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius:32px 32px 10% 10%
}

.product_content_action {
  width: 100%;
  display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: 1px solid;
}

.product-id {
  font-size: 0.9em;
  color: #fff;
  padding-top: 5px;
  font-weight: bold;
  letter-spacing: 1px;
}

.product-avatar {
  width: 45px;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}
.product-avatar>img {
  width: 100%;
}

.product-info {
  display: flex;
  justify-content: center;
  align-items: start;
  padding-bottom: 0.5rem
}

.product-quantity {
  font-size: 14px;
  color: gray;
  white-space: nowrap;
}

.product-action {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  height: 136px;
  padding-top: 20px;
  border-top: 1px solid;
}
  .product-price {
    font-size: 1.35rem;
    line-height: 30px;
    font-weight: 700;
    color: #199de1;
    padding-left: 10px;
  }

  .action-buy {
    height: 40px;
    min-width: 90px;
    font-size: 16px;
    background-color: #199de1;
    color: #fff;
    display: block;
    border-radius: 28px;
    margin-right: 10px;
    border-color: cyan;
    border: none;
    transition: box-shadow 0.3s ease;
  }

  .action-buy:hover {
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .old-price {
    color: #999;
    text-decoration: line-through;
    margin-right: 10px;
  }

  .new-price {
    font-size: 1.35rem;
    line-height: 30px;
    font-weight: 700;
    color: #199de1;
  }
  .add-to-cart {
  background-color: #28a745;
  color: white;
  width: 100%;
  padding: 10px 20px;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  margin-top: 5px;
  border-radius: 0 0 24px 24px; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-to-cart:hover {
  background-color: #218838;
}

.button-descr {
    border: none;
    background-color: white;
    border-radius: 12px;
    padding: 5px;
    cursor: pointer;
}

`

export const Description = styled.div`
 
  display: ${props => props.display ? 'flex' : 'none'};
    position: absolute;
    width: 100%;
    transition: opacity 0.5s ease;
    height: 100%;
    opacity: 0.5;
    background-color: #999;
    justify-content: center;
    align-items: center;
    border-radius: 24px;
`

export default Wrapper