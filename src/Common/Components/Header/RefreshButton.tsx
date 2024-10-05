import React from 'react';

const RefreshButton = ({Refresh}: {Refresh: () => void}) => {
  const onClick = () => {
    Refresh();
  }
  
  return (
  <button onClick={onClick} className="refresh">
    <div className="refresh__iconBox">
      <img src="/assets/icon/monitoring/ic_refresh.png" alt="새로고침 아이콘" className="refresh__icon"/>
    </div>
    <span className="refresh__text">새로고침</span>
  </button>
)
  ;
};

export default RefreshButton;