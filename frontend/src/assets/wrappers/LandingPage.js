import styled from "styled-components";

const Wrapper = styled.section`
  font-family: 'Arial', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  color: #333;
  overflow: hidden;
        .container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 100%;
            min-height: 100vh;
        }
        .section {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            transition: background-color 0.5s ease;
            border: 5px solid transparent;
              text-align: center;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          animation: fadeIn 2s ease-in-out;
        }

        .title-shop, .title-admin-panel {
              font-size: 4rem;
              color: #333;
              margin-bottom: 20px;
              font-weight: bold;
              animation: slideInDown 1s ease-in-out;
        }

        .section>p {
              font-size: 1.5rem;
                color: #555;
                margin-top: 10px;
                animation: slideInUp 1.5s ease-in-out;
        }
        .left {
            background-color: #f0f0f0;
        }
        .right {
            background-color: #e0e0e0;
        }
        .left:hover {
            background-color: #d4edda;
        }
        .right:hover {
            background-color: #cce5ff; 
        }
        .form-group {
            min-width: 300px;
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
    }
    .form-group input {
            padding: 10px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
}
        .btn {
            padding: 10px 20px;
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
            height: 36px;
            font-size: inherit;
            margin-right: 20px
        }
        .btn:hover {
            background-color: #0056b3;
        }

        p {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    }

    .action-btn {
      display: flex;
      align-items: center;
    }

    @keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-50px);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(50px);
  }
  to {
    transform: translateY(0);
  }
}

    @media (max-width: 991px) {
    .form-group {
      display: grid;
      min-width: auto;
    }
  }
  
  a {
  text-decoration: none;
}
    `
    

export default Wrapper