import { Modal, Button, Row, Col, Form, DatePicker, Input, message } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import React from 'react';
import NumberInput from '@/components/NumberInput';
/**
 *
 * @UpdateStaffDetails - The purpose of this component is to update the Staff's Personal Details
 */

const UpdateStaffDetails = ({
  visible,
  staffDetails,
  setVisible,
  dispatch,
  updateStaffDetailsLoading,
}) => {
  const [form] = Form.useForm();

  const getClassesOfStaff = () => {
    dispatch({
      type: 'staff/getStaffDetails',
      payload: {
        staffId: staffDetails.id,
      },
    });
  };

  const onFinish = (values) => {
    dispatch({
      type: 'staff/updateStaffDetails',
      payload: {
        staffId: staffDetails.id,
        body: values,
      },
    }).then((res) => {
      if (res) {
        message.success('Staff Member details updated successfully!');
        getClassesOfStaff();
        setVisible(false);
      }
    });
  };

  return (
    <Modal
      title="Update Details"
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
      footer={
        <div className="flex justify-end">
          <div>
            <Button
              type="link"
              onClick={() => {
                setVisible(false);
              }}
            >
              Cancel
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                form.submit();
              }}
              type="primary"
              loading={updateStaffDetailsLoading}
            >
              Update
            </Button>
          </div>
        </div>
      }
    >
      <Form
        layout="vertical"
        hideRequiredMark
        form={form}
        initialValues={{
          first_name: staffDetails?.display_name?.split(' ')[0],
          last_name: staffDetails?.display_name?.split(' ')[1],
          aadhar_number: staffDetails?.aadhar_number,
          birth_date: moment(staffDetails?.birth_date),
          joining_date: moment(staffDetails?.joining_date),
          qualification: staffDetails?.qualification,
        }}
        onFinish={onFinish}
      >
        <div className="bg-white rounded -my-3">
          <Row gutter={24}>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="first_name"
                label={<span className="formLabel">First Name</span>}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "First name can't be blank!",
                  },
                ]}
                className="m-0 p-0"
              >
                <Input size="large" autoFocus />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="last_name"
                label={<span className="formLabel">Last Name</span>}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Last name can't be blank!",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="aadhar_number"
                label={<span className="formLabel ">Adhar Number</span>}
              >
                <NumberInput
                  rules={[
                    {
                      required: true,
                      message: 'Please check adhar number!',
                      min: 16,
                    },
                  ]}
                  size="large"
                  style={{ width: '100%' }}
                  form={form}
                  name="aadhar_number"
                  maxLength={16}
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="birth_date"
                label={<span className="formLabel ">Date Of Birth</span>}
                rules={[
                  {
                    required: true,
                    message: "DOB can't be blank!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Select Date of Birth"
                />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                label={<span className="formLabel">Qualification</span>}
                name="qualification"
                rules={[
                  {
                    required: true,
                    whitespace: true,

                    message: "Qualification can't be blank!",
                  },
                ]}
              >
                <Input size="large" type="email" />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
              <Form.Item
                name="joining_date"
                label={<span className="formLabel ">Select Joining Date</span>}
                rules={[
                  {
                    required: true,
                    message: "Joining date can't be blank!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Select Joining Date"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default connect(({ staff, loading }) => ({
  updateStaffDetailsLoading: loading.effects['staff/updateStaffDetails'],
  staffDetails: staff.staffDetails,
}))(UpdateStaffDetails);
