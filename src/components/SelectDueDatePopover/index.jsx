import React, { useState } from 'react';
import { Popover, Icon, Menu, Modal, Calendar, Input, Select, Button, Tooltip } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import CheckValidation from '@/components/CheckValidation';
import { ChevronLeft, ChevronRight, Clock, Trash } from 'react-bootstrap-icons';

const weekdays = [2, 3, 4, 5, 6];
const moredays = [
  {
    name: '7 Days',
    count: 7,
  },
  { name: '14 Days', count: 14 },
  {
    name: '30 Days',
    count: 30,
  },
];
const nextWeek = [7, 8, 9, 10, 11, 12, 13, 14];
const { SubMenu } = Menu;

const SelectDueDatePopover = ({
  children,
  onDueDateChange,
  visible,
  setVisible,
  showDatePresets,
  popupPlacement,
  showTimeSelector,
}) => {
  const [selectDataModal, setSelectDataModal] = useState(false);
  const [selectedDueDate, setSelectedDueDate] = useState(null);

  const customCalendarHeaderRenderer = ({ value, onChange }) => {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    setSelectedDueDate(value);
    const current = value.clone();
    const year = value.year();

    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current.month(i);
      months.push(localeData.months(current));
    }

    for (let index = start; index < end; index++) {
      monthOptions.push(
        <Select.Option className="month-item" key={`${index}`}>
          {months[index]}
        </Select.Option>,
      );
    }
    const currentMonthIndex = value.month();

    return (
      <div style={{ padding: 8 }}>
        <div className="flex items-center py-2">
          <div>
            <Button
              type="text"
              shape="circle"
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

  return (
    <>
      <Popover
        overlayClassName="app-popup"
        trigger="click"
        placement={popupPlacement}
        visible={visible}
        onVisibleChange={(isVisible) => setVisible(isVisible)}
        content={
          <>
            <div>
              {/* Date selector */}
              <div className="pb-2 mb-2 border-b" style={{ maxWidth: 300 }}>
                <Calendar
                  disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
                  fullscreen={false}
                  headerRender={({ value, type, onChange, onTypeChange }) => {
                    return customCalendarHeaderRenderer({ value, type, onChange, onTypeChange });
                  }}
                  onSelect={(val) => {
                    setSelectedDueDate(val);
                  }}
                />
              </div>
              {/* Time selector */}
              <CheckValidation show={showTimeSelector}>
                <div
                  style={{ margin: '0 16px 8px 8px' }}
                  className="flex items-center mb-2 border-b"
                >
                  <div
                    style={{ width: 40, height: 40, marginRight: 8, paddingLeft: 12 }}
                    className="flex items-center"
                  >
                    <Clock className="text-xl text-gray-500" />
                  </div>
                  <div className="flex-auto">
                    <Input size="large" bordered={false} placeholder="Set time" />
                  </div>
                </div>
              </CheckValidation>
              {/* Ok/done/remove options */}
              <div className="flex justify-between px-3 py-2">
                <div>
                  <Tooltip title="Remove">
                    <Button
                      type="text"
                      onClick={() => {
                        setVisible(false);
                        onDueDateChange({
                          dueDate: null,
                        });
                      }}
                      icon={<Trash className="text-lg text-gray-600" />}
                      shape="circle"
                    />
                  </Tooltip>
                </div>
                <div className="flex-auto flex space-x-2 justify-end">
                  <Button onClick={() => setVisible(false)} type="text" size="large">
                    Cancel
                  </Button>
                  <Button
                    type="link"
                    size="large"
                    className="font-semibold"
                    onClick={() => {
                      setVisible(false);
                      onDueDateChange({
                        dueDate: moment(selectedDueDate).format(),
                      });
                    }}
                  >
                    OK
                  </Button>
                </div>
              </div>
              {/* Date presets (today/tomorrow/this/next week etc.). Hidden by default */}
              <CheckValidation show={showDatePresets}>
                <div style={{ minWidth: 160 }}>
                  <div className="py-2 text-gray-900 text-xxs px-4 font-semibold bg-gray-100">
                    This week
                  </div>
                  <div
                    aria-hidden="true"
                    onClick={() => {
                      onDueDateChange({
                        dueDate: moment().format(),
                      });
                    }}
                    className="py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex ">
                      <div className="px-4">
                        <p
                          className={
                            moment().format('dddd') === 'Saturday' ||
                            moment().format('dddd') === 'Sunday'
                              ? 'text-gray-500'
                              : 'text-blue-900'
                          }
                        >
                          Today
                        </p>
                        <p className="text-xs font-normal">{moment().format('MMM D, YYYY')}</p>
                      </div>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    onClick={() => {
                      onDueDateChange({
                        dueDate: moment().add(1, 'days').format(),
                      });
                    }}
                    className="py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex ">
                      <div className="px-4">
                        <p
                          className={
                            moment().add(1, 'days').format('dddd') === 'Saturday' ||
                            moment().add(1, 'days').format('dddd') === 'Sunday'
                              ? 'text-gray-500'
                              : 'text-blue-900'
                          }
                        >
                          Tomorrow
                        </p>
                        <p className="text-xs font-normal">
                          {moment().add(1, 'days').format('MMM D, YYYY')}
                        </p>
                      </div>
                    </div>
                  </div>
                  {weekdays.map((week) => (
                    <div
                      key=""
                      aria-hidden="true"
                      onClick={() => {
                        onDueDateChange({
                          dueDate: moment().add(week, 'days').format(),
                        });
                      }}
                      className="py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex ">
                        <div className="px-4">
                          <p
                            className={
                              moment().add(week, 'days').format('dddd') === 'Saturday' ||
                              moment().add(week, 'days').format('dddd') === 'Sunday'
                                ? 'text-gray-500'
                                : 'text-blue-900'
                            }
                          >
                            {moment().add(week, 'days').format('dddd')}
                          </p>
                          <p className="text-xs font-normal">
                            {moment().add(week, 'days').format('MMM D, YYYY')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {moredays.map((week) => (
                    <div
                      key=""
                      aria-hidden="true"
                      onClick={() => {
                        onDueDateChange({
                          dueDate: moment().add(week.count, 'days').format(),
                        });
                      }}
                      className="py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer hover:bg-gray-200"
                    >
                      <div className="flex ">
                        <div className="px-4">
                          <p className="text-blue-900">{week.name}</p>
                          <p className="text-xs font-normal">
                            {moment().add(week.count, 'days').format('MMM D, YYYY')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Menu onClick={() => {}} mode="vertical">
                    <SubMenu
                      key="sub1"
                      title={
                        <div className="flex px-4">
                          <p className="text-blue-900 font-medium">Next Week</p>
                        </div>
                      }
                    >
                      {nextWeek.map((week) => (
                        <Menu.Item key="" style={{ padding: 0, margin: 0 }}>
                          <div
                            aria-hidden="true"
                            onClick={() => {
                              onDueDateChange({
                                dueDate: moment().add(week, 'days').format(),
                              });
                            }}
                            className="px-4 hover:bg-gray-200"
                          >
                            <div
                              className={
                                moment().add(week, 'days').format('dddd') === 'Saturday' ||
                                moment().add(week, 'days').format('dddd') === 'Sunday'
                                  ? 'text-gray-500'
                                  : 'text-blue-900'
                              }
                            >
                              {moment().add(week, 'days').format('dddd')},{' '}
                              {moment().add(week, 'days').format('MMM D, YYYY')}
                            </div>
                          </div>
                        </Menu.Item>
                      ))}
                    </SubMenu>
                  </Menu>
                  <div
                    aria-hidden="true"
                    onClick={() => {
                      setSelectDataModal(true);
                      setVisible(false);
                    }}
                    className={
                      ('py-2 font-semibold border-solid border-gray-200 border border-0 border-b cursor-pointer hover:bg-gray-200',
                      'border-t')
                    }
                  >
                    <div className="flex  px-4">
                      <div className="">
                        <p className="text-blue-900">
                          <Icon type="ellipsis" className="mr-2" />
                          More options
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CheckValidation>
            </div>
          </>
        }
      >
        {children}
      </Popover>
      <Modal
        footer={null}
        bodyStyle={{ padding: 0 }}
        title="Set custom date"
        visible={selectDataModal}
        onCancel={() => setSelectDataModal(false)}
      >
        <div className="">
          <Calendar
            disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
            fullscreen={false}
            onSelect={(val) => {
              setSelectDataModal(false);
              onDueDateChange({
                dueDate: moment(val).format(),
              });
            }}
          />
        </div>
      </Modal>
    </>
  );
};

SelectDueDatePopover.defaultProps = {
  showDatePresets: false,
  popupPlacement: 'bottomRight',
  showTimeSelector: false,
};

/**
 * @type {SelectDueDatePopoverProps}
 */
SelectDueDatePopover.propTypes = {
  /**
   * @param {showDatePresets}- if enabled shows date presets like today/tomorrow etc. Defaults to false
   */
  showDatePresets: PropTypes.bool,
  /**
   * @param {showDatePresets}- Position of the popup to select dates, defaults to bottomRight.
   */
  popupPlacement: PropTypes.string,
  /**
   * @param {showTimeSelector}- If enabled displays the time selector, defaults to true.
   */
  showTimeSelector: PropTypes.bool,
};

export default SelectDueDatePopover;
