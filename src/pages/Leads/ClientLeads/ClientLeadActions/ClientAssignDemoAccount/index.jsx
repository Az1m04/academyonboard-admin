import { Button, DatePicker, Divider, Form, message } from 'antd';
import React, { useState } from 'react';
import { connect } from 'umi';

const ClientAssignDemoAccount = ({ dispatch, actionKey, setActionKey, loading }) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState();
  const [startValue, setStartValue] = useState(null);
  const [endDate, setEndDate] = useState();
  const handleAssignAccount = () => {
    dispatch({
      type: 'leads/assignDemoAccount',
      payload: {
        body: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
        pathParams: {
          clientId: actionKey?.id,
        },
      },
    }).then((res) => {
      if (res?.status === 'notok') {
        message.error(res?.data?.message);
        setActionKey({ id: null, title: null, subTitle: null, key: null });
      }
      if (res?.status === 'ok') {
        message.success('Demo account assigned successfully');
        setActionKey({ id: null, title: null, subTitle: null, key: null });
      }
    });
  };

  return (
    <div>
      <Form form={form} onFinish={() => handleAssignAccount(endDate)}>
        <div className="w-full">
          <div className="flex w-full ">
            <div className=" w-full ">
              <p className="py-4 w-full px-4  formLabel mb-0">Start date</p>
              <div className="px-4  w-full ">
                <Form.Item
                  name="startDate"
                  style={{ width: '100%' }}
                  rules={[{ required: true, message: 'Please select start date!' }]}
                >
                  <DatePicker
                    format="DD MMM, YYYY"
                    size="large"
                    style={{ width: '100%' }}
                    className="w-full"
                    value={startDate}
                    onChange={(current) => {
                      form.setFieldsValue({
                        endDate: undefined,
                      });
                      if (current) {
                        setStartValue(current.valueOf());
                      }
                      setStartDate(current);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
            <div className=" w-full">
              <p className="py-4 w-full px-4  formLabel mb-0">End date</p>
              <div className="px-4  w-full ">
                <Form.Item
                  name="endDate"
                  style={{ width: '100%' }}
                  rules={[{ required: true, message: 'Please select end date!' }]}
                >
                  <DatePicker
                    format="DD MMM, YYYY"
                    size="large"
                    className="w-full"
                    style={{ width: '100%' }}
                    value={endDate}
                    onChange={(ev) => setEndDate(ev)}
                    disabledDate={(current) => current && current.valueOf() < startValue}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <Divider style={{ margin: '0' }} />
          <div className="flex justify-end pt-3 px-4">
            <Button type="primary" size="large" htmlType="submit" loading={loading}>
              Assign
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ loading }) => ({ loading: loading?.effects['leads/assignAccount'] }))(
  ClientAssignDemoAccount,
);
