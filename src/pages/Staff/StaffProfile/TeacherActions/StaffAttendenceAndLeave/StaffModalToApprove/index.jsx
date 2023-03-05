import React from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import { Form, Button, Divider, Radio, Modal, Input } from 'antd';

const StaffModalToApprove = ({
  setApproveModal,
  approveModal,
  updateLeaveStatus,
  statusLoading,
}) => {
  const [form] = Form.useForm();

  return (
    <div>
      <Modal
        title={
          <div className="flex justify-between border-b">
            <div className="flex w-full px-4 py-4 pt-2">
              <FileAddOutlined className="mt-1 text-xl" style={{ color: 'rgba(30,58,138)' }} />
              <div className="w-full pl-4">
                <div className="w-full text-base font-semibold text-blue-900">
                  Leave action
                  <div className="w-full text-sm font-normal text-gray-500">
                    Approve/Reject leave
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        onCancel={() => {
          setApproveModal(false);
          form?.resetFields();
        }}
        visible={approveModal}
        footer={null}
      >
        <>
          <Form
            hideRequiredMark
            onFinish={(values) => updateLeaveStatus(values)}
            autoComplete="off"
            form={form}
          >
            <div className="p-4">
              <div className="">
                <p className="font-medium text-gray-800 ">Select to approve/reject leave</p>
                <div className="-mt-1">
                  <Form.Item
                    style={{ marginBottom: 20 }}
                    name="leaveStatus"
                    rules={[{ required: true, message: 'Please set approve/reject leave ' }]}
                    initialValue="APPROVED"
                  >
                    <Radio.Group buttonStyle="solid">
                      <Radio.Button value="APPROVED">Approve</Radio.Button>
                      <Radio.Button value="REJECTED">Reject</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
              <p className="font-medium text-gray-800">
                Remarks <span className="text-gray-500 text-sm ">(optional)</span>
              </p>
              <Form.Item name="comment">
                <Input.TextArea rows={4} />
              </Form.Item>
            </div>
          </Form>
          <Divider style={{ margin: '0' }} />
          <div className="flex justify-end p-4">
            <Button
              size="large"
              disabled={!form?.getFieldValue('noteInfo')}
              onClick={() => {
                form.resetFields();
              }}
              className="mr-4"
            >
              Reset
            </Button>

            <Button
              loading={statusLoading}
              type="primary"
              size="large"
              onClick={() => form.submit()}
            >
              Submit
            </Button>
          </div>
        </>
      </Modal>
    </div>
  );
};
export default StaffModalToApprove;
