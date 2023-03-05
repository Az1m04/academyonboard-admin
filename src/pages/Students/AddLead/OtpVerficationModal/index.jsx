import { Modal, Button, Input, Form } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import React from 'react';
import { connect } from 'umi';

const OtpVerification = ({ visible, setVisible, registerData, dispatch, otpLoading }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      bodyStyle={{
        padding: 18,
      }}
      visible={visible}
      onCancel={() => setVisible(false)}
      width={500}
      footer={false}
    >
      <div className="mx-4 my-6">
        <div className=" font-bold text-lg text-center text-gray-600">
          We have sent an OTP to your Mobile Number (
          {registerData?.phone?.areaCode + registerData?.phone?.phone}). Please enter the OTP to
          proceed further.
        </div>

        <Form
          form={form}
          hideRequiredMark
          layout="vertical"
          colon={false}
          onFinish={(values) => {
            console.log(`values11`, values);
            // const payload = {
            //   pathParams: {
            //     partyId: optId,
            //     otp: values.otp,
            //   },
            //   query: {
            //     isSignUp: true,
            //   },
            // };
            dispatch();
          }}
        >
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: 'Otp is required',
              },
            ]}
          >
            <Input size="large" type="number" />
          </Form.Item>
          <div
            onClick={() => {}}
            className="flex py-2 cursor-pointer pb-4 justify-end text-blue-600 text-xs"
          >
            {otpLoading && <LoadingOutlined />}
            <span className="pl-2">Resend otp</span>
          </div>
          <div className="pt-4">
            <Button
              className="px-3 py-2 w-full"
              text={otpLoading ? 'Verifying...' : 'Verify'}
              onClick={() => {
                form.submit();
              }}
            />
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default connect(() => ({}))(OtpVerification);
