import React from 'react';

const ControllerComponent = ({contNumber, value, name}: { contNumber: number, value: string, name: string }) => {
  return (
    <div
      className="status__cardItem-box"
      style={{
        backgroundColor: "white",
        color: "black"
      }}
    >
      <div className="status__cardItem-icon">
        <img src={`/assets/icon/controllers/ic_c_${contNumber}.png`} className="status__icon__img" alt="제어기 이미지"/></div>
      {/*<div className="status__cardItem-level">21.80 ℃</div>*/}
      <div className="status__cardItem-level">{value}</div>
      <div className="status__cardItem-name">{name}</div>
    </div>
  );
};

export default ControllerComponent;
