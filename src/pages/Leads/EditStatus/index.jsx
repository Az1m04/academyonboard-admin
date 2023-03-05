/* eslint-disable no-console */
import React from 'react';
import { Select, Form, Input, Button } from 'antd';
import { connect } from 'umi';

const EditStatus = ({ dispatch }) => {
  // const [resettingFields, setResettingFields] = useState('');
  // console.log(`resettingFields`, resettingFields);
  const [form] = Form.useForm();
  const { Option } = Select;

  const onStatusFinish = (values) => {
    console.log(`Status Modal Success`, values);
    form?.setFieldsValue({
      NewLeads: 'New Leads',
    });
    if (values?.StatusRadiobtn) {
      form?.resetFields();
    }
  };

  const onSelectChange = (value) => {
    console.log(`OnChangedvalue`, value);
    form?.setFieldsValue({
      ReasonInput: '',
    });
  };

  return (
    <Form form={form} onFinish={onStatusFinish} hideRequiredMark autoComplete="off">
      <div className="m-4 my-8">
        <span className="block"> Select Status</span>
        <Form.Item
          initialValue="NewLeads"
          name="StatusRadiobtn"
          rules={[{ required: true, message: 'Please select a status first' }]}
        >
          <Select size="large" placeholder="Select a status" onChange={onSelectChange}>
            <Option value="NewLeads">New Leads</Option>
            <Option value="Call-back">Call-back</Option>
            <Option value="Walk-in">Walk-in</Option>
            <Option value="Appointment">Appointment</Option>
            <Option value="Closed">Closed</Option>
            <Option value="Registered">Registered</Option>
            <Option value="Demo Account">Demo Account</Option>
            <Option value="Demo Account Expired">Demo Account Expired</Option>
          </Select>
        </Form.Item>

        <span className="block"> Reason</span>
        <Form.Item name="ReasonInput">
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 6 }}
            placeholder="Type a reason to change status"
          />
        </Form.Item>
      </div>
      <div className="flex justify-end ">
        <div
          style={{
            bottom: 0,
            position: 'absolute',
            marginBottom: 35,
            marginRight: 20,
          }}
          className="flex  justify-end "
        >
          <Button
            size="large"
            onClick={() => {
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
            }}
            className="mr-4"
          >
            Cancel
          </Button>

          <Button type="primary" size="large" onClick={() => form.submit()}>
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default connect(({ leads }) => ({
  editLead: leads.editLead,
}))(EditStatus);
