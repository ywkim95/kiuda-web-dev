const TempSensorComponent = ({sensorNumber, value, name}: { sensorNumber: number, value: string, name: string }) => {
  
  return (
    <>
      <div className="status__cardItem-icon">
        <img src={`/assets/icon/sensors/ic_s_${name.startsWith('토양수분') ? 10 : 9}.png`} className="status__icon__img" alt="센서 이미지"/></div>
      {/*<div className="status__cardItem-level">21.80 ℃</div>*/}
      <div className="status__cardItem-level">{value}</div>
      <div className="status__cardItem-name">{name.split('(')[0]}</div>
    </>
  );
};

export default TempSensorComponent;
