const onChangeStartTime = (date: Date, setStartDate: (date: Date) => void) => {
  setStartDate(date);
};

const onChangeEndTime = (date: Date, setEndDate: (date: Date) => void) => {
  setEndDate(date);
};

export {onChangeEndTime, onChangeStartTime};