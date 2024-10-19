import styled from 'styled-components';

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  align-items: center;
  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
    justify-self: center;
  }

  .auth-form h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.6rem;
    color: #555;
    text-transform: capitalize;
  }

  .form-group input {
    width: 93%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    transition: border-color 0.3s;
  }

  .form-group input:focus {
    border-color: #6b73ff;
    outline: none;
  }

  .auth-btn {
    width: 100%;
    padding: 0.75rem;
    background: #6b73ff;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .auth-btn:hover {
    background: #000dff;
  }

  h4 {
    text-align: center;
    font-size: 25px;
    margin-bottom: 1.25rem;
    text-transform: none;
  }

  p {
    margin-top: 1rem;
    text-align: center;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  a {
    text-decoration: none;
    margin-left: 0.5rem;
  }

  @media (max-width: 500px) {
    .form-container {
      padding: 1rem;
    }

    .auth-form h2 {
      font-size: 1.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      text-transform: capitalize;
    }

    .form-group input {
      padding: 0.5rem;
    }

    .auth-btn {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
`;

export default Wrapper;
