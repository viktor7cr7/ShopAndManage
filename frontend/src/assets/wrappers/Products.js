import styled from 'styled-components';

const Wrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: var(--border-radius);
  display: grid;
  grid-template-rows: 0.5fr 1fr;
  box-shadow: var(--shadow-2);
  header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--grey-100);
    display: grid;
    height: 150px;
    grid-template-columns: auto 1.5fr 1fr;
    align-items: center;
    border-bottom: inset;
    column-gap: 1.5rem;
  }
  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--border-radius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
  }
  .info {
    display: flex;
    flex-direction: column;
    h5 {
      margin-bottom: 0.5rem;
      letter-spacing: 0;
      font-size: 1.2rem;
      -webkit-box-orient: vertical;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    overflow: hidden;
    }
    p {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letter-spacing);
      color: var(--text-secondary-color);
    }
  }
  .content {
    position: relative;
    padding: 1rem 1.5rem;
    height: 250px;
  }
  .content-center {
    display: grid;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }
  .product-status {
    border-radius: var(--border-radius);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    text-align: center;
    width: 150px;
    height: 30px;
    display: grid;
    align-items: center;
  }
  .avaliable {
    background-color: aqua
  }
  .ended {
    background-color: lightgray
  }
  .actions {
    position: absolute;
    margin-top: 1rem;
    display: flex;
    top: 185px;
    align-items: center;
  }
  .edit-btn,

  .delete-btn {
    height: 35px;
    font-size: 0.85rem;
    margin-left: 0.5rem;
    display: flex;
    align-items: center;
  }

  .set-discount {
    display: inline-block;
    font-weight: bold;
    color: #28a745;
    background-color: #e6ffe6;
    padding: 2px 8px;
    border-radius: 5px;
    margin-left: 5px;
    font-size: 0.9em;
  }

  .discount-btn {
    margin-left: 0.5rem;
    background: crimson;
  }
  .no-discount {
    color: #999;
    font-style: italic;
  }

  .fa-percent {
  margin-right: 5px;
}
.no_activity_price {
  text-decoration: line-through;
}

.modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    min-width: 50%;
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

.form-footer {
    display: flex;
}
`;

export default Wrapper;