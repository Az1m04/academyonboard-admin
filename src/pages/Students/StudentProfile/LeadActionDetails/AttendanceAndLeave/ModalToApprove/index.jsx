import React, { useState } from 'react';
import { FileAddOutlined } from '@ant-design/icons';
import { Form, Button, Divider, Radio, Modal, Input, message } from 'antd';
import { connect } from 'umi';

const ModalToApprove = ({
  loading,
  setApproveModal,
  approveModal,
  dispatch,
  studentId,
  viewData,
}) => {
  const [notesValue, setNotesValue] = useState('');
  const [form] = Form.useForm();

  const handelSubmit = (values) => {
    dispatch({
      type: 'student/approveLeave',
      payload: {
        body: values,
        pathParams: { studentId, leaveId: viewData?.leaveId },
      },
    })
      .then((res) => {
        if (res?.status === 'ok') {
          setApproveModal(false);
          message.success('You have successfully marked the leave status');
        } else {
          message.error(res?.data?.message);
        }
      })
      .catch(() => {});
  };

  return (
    <>
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
          <Form onFinish={handelSubmit} hideRequiredMark autoComplete="off" form={form}>
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
                    <Radio.Group
                      buttonStyle="solid"
                      value={notesValue}
                      onChange={(val) => setNotesValue(val.target.value)}
                    >
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

            <Button loading={loading} type="primary" size="large" onClick={() => form.submit()}>
              Submit
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
};

export default connect(({ loading, student }) => ({
  studentApproverList: student?.studentApproverList,
  loading: loading?.effects['student/approveLeave'],
}))(ModalToApprove);
