import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Button, DatePicker, message, Form } from 'antd';
import moment from 'moment';

const AddDemoAccount = ({ dispatch, editLead, loading }) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState();
  const [startValue, setStartValue] = useState(null);
  const [endDate, setEndDate] = useState();

  const handleAssignAccount = () => {
    dispatch({
      type: 'leads/assignAccount',
      payload: {
        body: {
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
        },
        pathParams: {
          studentId: editLead?.leadId,
        },
      },
    }).then((res) => {
      if (res?.status === 'notok') {
        message.error(res?.data?.message);
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
      }
      if (res?.status === 'ok') {
        message.success('Demo account assigned successfully');
        dispatch({
          type: 'leads/setStates',
          payload: {
            visible: false,
            type: null,
            title: null,
            leadId: null,
          },
          key: 'editLead',
        });
      }
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      startDate: editLead?.record?.demoAccount?.startDate
        ? moment(editLead?.record?.demoAccount?.startDate)
        : undefined,
      endDate: editLead?.record?.demoAccount?.endDate
        ? moment(editLead?.record?.demoAccount?.endDate)
        : undefined,
    });
  }, [form]);
  return (
    <Form form={form} onFinish={() => handleAssignAccount(endDate)}>
      <div className="w-full">
        <div className="flex ">
          <div>
            <p className="py-4 w-full px-4  formLabel mb-0">Start date</p>
            <div className="px-4  w-full ">
              <Form.Item
                name="startDate"
                rules={[{ required: true, message: 'Please select start date!' }]}
              >
                <DatePicker
                  format="DD MMM, YYYY"
                  className="w-full"
                  value={startDate}
                  onChange={(current) => {
                    if (current) {
                      setStartValue(current.valueOf());
                    }
                    setStartDate(current);
                  }}
                />
              </Form.Item>
            </div>
          </div>
          <div>
            <p className="py-4 w-full px-4  formLabel mb-0">End date</p>
            <div className="px-4  w-full ">
              <Form.Item
                name="endDate"
                rules={[{ required: true, message: 'Please select end date!' }]}
              >
                <DatePicker
                  format="DD MMM, YYYY"
                  className="w-full"
                  value={endDate}
                  onChange={(ev) => setEndDate(ev)}
                  disabledDate={(current) => current && current.valueOf() < startValue}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 px-4">
          <Button
            type="primary"
            // onClick={() => handleAssignAccount(endDate)}
            htmlType="submit"
            loading={loading}
          >
            Assign
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default connect(({ leads, loading }) => ({
  selectedLead: leads?.selectedLead,
  editLead: leads?.editLead,
  loading: loading?.effects['leads/assignAccount'],
}))(AddDemoAccount);
