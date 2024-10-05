import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const NoMatch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onClickToWindow = () => {
    return window.history.back();
  };

  const onClickToHome = () => {
    navigate('/home');
  };

  return (
    <div className="container">
      <h1>404 - Not Found</h1>
      <p>존재하지 않는 페이지입니다.</p>
      <button className="back-button" onClick={onClickToWindow}>뒤로가기</button>
      <button className="home-button" onClick={onClickToHome}>홈으로</button>
    </div>
  )
}

export default NoMatch;