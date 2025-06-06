// client/src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">歡迎來到 WordNest</h1>
      <h2 className="home-title">透過WordNest幫你熟記日文&英文單字</h2>
      <div className="home-buttons">
        <button className="home-button" onClick={() => navigate('/en')}>
          英文單字
        </button>
        <button className="home-button" onClick={() => navigate('/jp')}>
          日文單字
        </button>
      </div>
    </div>
  );
};

export default Home;
