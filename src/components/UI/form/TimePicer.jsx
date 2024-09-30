import React, { useState, useEffect } from "react";
import moment from "moment";
import { TimePicker } from "antd";

const TimePicer = ({ id, time, handleFunction, showValue = true }) => {
  const [selectedTime, setSelectedTime] = useState(
    showValue && time ? moment(time, "h:mm a") : null
  );

  useEffect(() => {
    setSelectedTime(time ? moment(time, "h:mm a") : null);
  }, [time]);

  // Handle time change
  const onChange = (time, timeString) => {
    //  time -  moment object, timeString - time in "h:mm a" format
    setSelectedTime(time);
    handleFunction(id, time, timeString);
  };
  return (
    <TimePicker
      value={selectedTime ? selectedTime : null}
      placeholder="Select Time"
      use12Hours
      format="h:mm a"
      onChange={onChange}
    />
  );
};
export default TimePicer;
