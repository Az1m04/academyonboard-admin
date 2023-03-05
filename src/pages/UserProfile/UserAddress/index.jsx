import Address from '@/components/Address';
import { Button, Form, message } from 'antd';
import React from 'react';
import { connect } from 'umi';

function UserAddress({ currentUser, dispatch, loading }) {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      initialValues={{
        address: {
          addressLine1: currentUser?.personalDetails?.address?.addressLine1,
          addressLine2: currentUser?.personalDetails?.address?.addressLine2,
          city: currentUser?.personalDetails?.address?.city,
          postalCode: currentUser?.personalDetails?.address?.postalCode,
          stateCode: currentUser?.personalDetails?.address?.stateCode,
          countryCode: currentUser?.personalDetails?.address?.countryCode,
        },
      }}
      hideRequiredMark
      layout="vertical"
      colon={false}
      onFinish={(values) => {
        dispatch({
          type: 'user/updateCurrent',
          payload: {
            body: {
              personalDetails: {
                primaryAddress: values.address,
              },
            },
          },
        }).then((res) => {
          if (res) {
            message.success(
              `Address ${
                currentUser?.personalDetails?.address?.addressLine1 ? 'updated' : 'saved'
              } successfully`,
            );
            dispatch({
              type: 'user/fetchCurrent',
              payload: {},
            });
          }
        });
      }}
    >
      <div className="p-4">
        <Address required form={form} type="address" />
      </div>
      <div className="px-4 py-3 text-right bg-gray-50 sm:px-6">
        <Button
          loading={loading}
          type="primary"
          size="medium"
          className="text-center text-white flex-end"
          htmlType="submit"
        >
          {currentUser?.personalDetails?.address?.addressLine1 ? 'Update' : 'Save'}
        </Button>
      </div>
    </Form>
  );
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.effects['user/updateCurrent'],
}))(UserAddress);
