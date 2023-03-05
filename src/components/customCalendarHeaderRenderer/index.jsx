import { Button } from 'antd';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const customCalendarHeaderRenderer = ({ value, onChange }) => {
  // setSelectedDueDate(value);
  const current = value.clone();
  const year = value.year();

  const localeData = value.localeData();
  const months = [];
  for (let i = 0; i < 12; i++) {
    current.month(i);
    months.push(localeData.months(current));
  }

  const currentMonthIndex = value.month();

  return (
    <div style={{ padding: 8 }}>
      <div className="flex items-center py-2">
        <div>
          <Button
            type="text"
            shape="circle"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => {
              const newValue = value.clone();
              newValue.month(currentMonthIndex - 1);
              onChange(newValue);
            }}
            icon={<ChevronLeft />}
          />
        </div>
        <div className="flex-auto text-center font-semibold">
          {months[currentMonthIndex]} {year}
        </div>
        <div>
          <Button
            type="text"
            shape="circle"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => {
              const newValue = value.clone();
              newValue.month(currentMonthIndex + 1);
              onChange(newValue);
            }}
            icon={<ChevronRight />}
          />
        </div>
      </div>
    </div>
  );
};
export default customCalendarHeaderRenderer;
