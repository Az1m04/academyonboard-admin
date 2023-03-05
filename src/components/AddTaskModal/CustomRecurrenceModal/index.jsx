import React from 'react';
import { Modal, Form, Select, Radio, DatePicker, InputNumber } from 'antd';
import moment from 'moment';

const CustomRecurrenceModal = ({
  isRecurrenceModalVisible,
  setIsRecurrenceModalVisible,
  createTaskForm,
  customRecurrenceForm,
  repeatCount,
  setRepeatCount,
  repeatOption,
  setRepeatOption,
  repeatEnds,
  setRepeatEnds,
  getWeekNumber,
  setRecurrencePayload,
  recurrencePayload,
}) => {
  let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
  weeks = (weeks + 52) % 52;
  const recurrenceDays = [
    {
      id: 1,
      name: 'Sun',
      value: 'SUN',
    },
    {
      id: 2,
      name: 'Mon',
      value: 'MON',
    },
    {
      id: 3,
      name: 'Tue',
      value: 'TUE',
    },
    {
      id: 4,
      name: 'Wed',
      value: 'WED',
    },
    {
      id: 5,
      name: 'Thurs',
      value: 'THU',
    },
    {
      id: 6,
      name: 'Fri',
      value: 'FRI',
    },
    {
      id: 7,
      name: 'Sat',
      value: 'SAT',
    },
  ];
  const repeatOn = [
    {
      id: 1,
      name: 'day',
      value: 'DAILY',
    },
    {
      id: 2,
      name: 'week',
      value: 'WEEKLY',
    },
    {
      id: 3,
      name: 'month',
      value: 'MONTHLY',
    },
    {
      id: 4,
      name: 'year',
      value: 'YEARLY',
    },
  ];

  const getStep = () => {
    switch (repeatOption) {
      case 'DAY':
        return <></>;
      case 'WEEKLY':
        return (
          <>
            <p className="text-sm font-semibold mb-1 mt-5">Repeat on</p>
            <Form.Item name="repetitionOn" style={{ margin: '0%' }} initialValue={['SUN']}>
              <Select
                style={{ minWidth: '300px' }}
                mode="multiple"
                size="large"
                placeholder="Repeating Days"
                onChange={(e) => {
                  if (e?.length === 0) {
                    customRecurrenceForm?.setFieldsValue({
                      repetitionOn: 'SUN',
                    });
                  }
                }}
                defaultValue="SUN"
              >
                {recurrenceDays?.map((item) => (
                  <Select.Option key={item?.value} value={item?.value}>
                    {item?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        );
      case 'MONTHLY':
        return (
          <>
            <Form.Item
              name="repeatByDay"
              style={{ marginTop: '2rem' }}
              valuePropName
              initialValue={+moment().format('DD')}
            >
              <Select
                style={{ minWidth: '300px' }}
                size="large"
                defaultValue={moment().format('DD')}
              >
                <Select.Option value={moment().format('DD')}>
                  {`Monthly on day ${+moment().format('DD')}`}
                </Select.Option>
                <Select.Option value={weeks}>
                  {`Monthly on ${getWeekNumber()}${moment().format('dddd').toLowerCase()}`}
                </Select.Option>
              </Select>
            </Form.Item>
          </>
        );
      case 'YEARLY':
        return <></>;
      default:
        return <></>;
    }
  };
  const getCustomValues = (valuesSubmited) => {
    const values = valuesSubmited;
    let isEnds = false;
    if (repeatEnds === 'on' || repeatEnds === 'after') {
      isEnds = true;
      if (repeatEnds === 'on') {
        Object.keys(values).forEach((key) => {
          if (key === 'endsOn') {
            values[key] = values[key]?.toISOString();
          }
        });
      }
      if (repeatEnds === 'on') {
        Object.keys(values).forEach((key) => {
          if (key === 'endsAfter') {
            delete values[key];
          }
        });
      }
      if (repeatEnds === 'after') {
        Object.keys(values).forEach((key) => {
          if (key === 'endsOn') {
            delete values[key];
          }
        });
      }
    } else {
      isEnds = false;
      Object.keys(values).forEach((key) => {
        if (key === 'endsAfter' || key === 'endsOn') {
          delete values[key];
        }
      });
    }
    const customPayload = {
      isEnds,
      ...values,
    };
    Object.keys(customPayload).forEach((key) => {
      if (customPayload[key] === undefined) {
        delete customPayload[key];
      }
    });
    if (customPayload?.repetitionType === 'MONTHLY') {
      customPayload.repetitionOnType = 'DAY';
    }
    if (customPayload?.repetitionType === 'YEARLY') {
      customPayload.repetitionOnType = 'DATE';
    }
    setRecurrencePayload({
      isRecurrence: true,
      recurrence: { startDate: moment().toISOString(), recurrenceType: 'CUSTOM', ...customPayload },
    });
    setIsRecurrenceModalVisible(false);
  };
  return (
    <>
      <Modal
        centered
        title={<p className="p-0 m-0 text-blue-700 font-medium">Custom recurrence</p>}
        visible={isRecurrenceModalVisible}
        onCancel={() => {
          setIsRecurrenceModalVisible(false);
          if (recurrencePayload === undefined) {
            createTaskForm?.setFieldsValue({
              durationUnitId: undefined,
            });
          }
        }}
        width={480}
        onOk={() => customRecurrenceForm.submit()}
        okText={recurrencePayload === undefined ? 'Add' : 'Update'}
        maskClosable={false}
      >
        <Form form={customRecurrenceForm} onFinish={(values) => getCustomValues(values)}>
          <div className="flex gap-2.5">
            <p className="text-sm font-semibold  mt-2 mb-0">Repeat every</p>
            <Form.Item name="repetitionFrequency" style={{ margin: '0%' }} initialValue={1}>
              <InputNumber
                size="large"
                min={1}
                defaultValue={1}
                style={{ width: '6rem' }}
                onChange={(e) => setRepeatCount(e)}
              />
            </Form.Item>
            <Form.Item name="repetitionType" style={{ margin: '0%' }} initialValue="WEEKLY">
              <Select
                style={{ width: '7rem' }}
                onChange={(e) => setRepeatOption(e)}
                size="large"
                defaultValue={'WEEKLY'}
              >
                {repeatOn?.map((item) => (
                  <Select.Option key={item?.value} value={item?.value}>
                    {item?.name}
                    {repeatCount > 1 ? 's' : null}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          {getStep()}
          <p className="text-sm font-semibold mt-6">Ends</p>
          <Radio.Group
            style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}
            size="large"
            defaultValue="never"
            onChange={(e) => setRepeatEnds(e.target.value)}
            buttonStyle="solid"
          >
            <Radio value="never">Never</Radio>
            <Radio value="on" style={{ display: 'flex', alignItems: 'center' }}>
              <div className="flex">
                <span className="mt-2.5">On</span>
                <Form.Item name="endsOn" style={{ margin: '0%' }} initialValue={moment()}>
                  <DatePicker
                    size="small"
                    allowClear={false}
                    suffixIcon={<></>}
                    disabled={repeatEnds !== 'on'}
                    format={'ll'}
                    style={{
                      height: '2rem',
                      width: '6rem',
                      marginLeft: '5rem',
                      marginTop: '5px',
                      borderTop: '0px',
                      borderLeft: '0px',
                      borderRight: '0px',
                    }}
                  />
                </Form.Item>
              </div>
            </Radio>
            <Radio value="after">
              <div className="flex">
                <p className="mt-2.5">After</p>
                <div className="flex" style={{ marginLeft: '4.3rem' }}>
                  <Form.Item name="endsAfter" style={{ margin: '0%' }} initialValue={1}>
                    <InputNumber
                      size="small"
                      allowClear={false}
                      disabled={repeatEnds !== 'after'}
                      min={1}
                      format={'ll'}
                      style={{
                        height: '2rem',
                        width: '6rem',
                        marginTop: '5px',
                        borderTop: '0px',
                        borderLeft: '0px',
                        borderRight: '0px',
                      }}
                    />
                  </Form.Item>
                  <p className="mt-2.5 text-gray-900  font-medium ml-2">Occurrences</p>
                </div>
              </div>
            </Radio>
          </Radio.Group>
        </Form>
      </Modal>
    </>
  );
};

export default CustomRecurrenceModal;
