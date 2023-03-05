import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Divider, Form, Input, Modal, Popconfirm, Select, Upload } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import { connect, useParams } from 'umi';

const StaffLeaveForm = ({
  isModalVisible,
  setIsModalVisible,
  dispatch,
  staffSuperviser,
  getAllLeave,
}) => {
  const [content, setContent] = useState([]);
  const { staffId } = useParams();
  const [leaveForm] = Form.useForm();
  const leaveType = [
    {
      description: 'Sick',
      typeId: 'SICK_LEAVE',
    },
    {
      description: 'Casual',
      typeId: 'CASUAL',
    },
    {
      description: 'Planned',
      typeId: 'PLANNED',
    },
    {
      description: 'Without Pay',
      typeId: 'WITHOUT_PAY',
    },
  ];
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const onFinishForm = (val) => {
    let body = {
      ...val,
      endsAt: val?.endsAt?.toISOString(),
      startsAt: val?.startsAt?.toISOString(),
    };
    let newContents = {};
    newContents = content?.map((item) => {
      return {
        ...item,
        comment: val?.comment,
      };
    });

    if (content?.length > 0) {
      body = { ...body, content: { ...newContents } };
    }

    dispatch({
      type: 'staff/applyStaffLeave',
      payload: {
        pathParams: { staffId },
        body,
      },
    }).then((res) => {
      if (res?.leaveId) {
        setIsModalVisible(false);
        leaveForm.resetFields();
        getAllLeave();
      }
    });
  };

  useEffect(() => {
    dispatch({
      type: 'staff/staffSuperviser',
      payload: {
        query: { partyId: staffId, statusId: 'REPORTS_TO' },
      },
    });
  }, [staffId, dispatch]);

  return (
    <div>
      <Modal
        title="Apply leave"
        footer={null}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={leaveForm} onFinish={(val) => onFinishForm(val)}>
          <div className="mt-5">
            <p className="font-medium mb-0">Leave Type</p>
            <Form.Item
              name="leaveTypeId"
              rules={[
                {
                  required: true,
                  message: 'Please select leave type',
                },
              ]}
            >
              <Select placeholder="Select leave type">
                {leaveType?.map((item) => (
                  <Select.Option key={item?.typeId} value={item?.typeId}>
                    {item?.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div>
              <p className="font-medium mb-0">Start Date</p>
              <Form.Item name="startsAt">
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
            <div>
              <p className="font-medium mb-0">End Date</p>
              <Form.Item name="endsAt">
                <DatePicker className="w-full" />
              </Form.Item>
            </div>
            <div>
              <p className="font-medium mb-0">Select approval </p>
              <Form.Item name={['approval', 'id']}>
                <Select placeholder="Select approval person">
                  {staffSuperviser?.partyList?.map((item) => (
                    <Select.Option key={item?.id} value={item?.id}>
                      {item?.displayName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            <div>
              <p className="font-medium mb-0">Select duration </p>
              <Form.Item name="startDuration">
                <Select placeholder="Select leave duration">
                  <Select.Option key="FIRST_HALF">First Half</Select.Option>
                  <Select.Option key="SECOND_HALF">Second Half</Select.Option>

                  <Select.Option key="ALL_DAY">Full Day</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div>
              <p className="font-medium mb-0">Reason for Leave</p>
              <Form.Item name="reasonForLeave">
                <Input.TextArea placeholder="Enter your reason for leave" />
              </Form.Item>
            </div>
            <div>
              <p className="font-medium mb-0">Comment</p>
              <div className="flex mb-8 w-full">
                <Form.Item name="comment">
                  <Input placeholder="Enter comment here.." style={{ width: '400px' }} />
                </Form.Item>
                <Upload
                  beforeUpload={async (data) => {
                    await toBase64(data)
                      .then((res) => {
                        const obj = {
                          encodedFile: res,
                          name: data?.name,
                          typeId: 'LEAVE_DOCUMENT',
                        };
                        setContent([].concat(obj, content));
                      })
                      .catch(() => {});

                    return false;
                  }}
                  fileList={[]}
                >
                  <Button type="primary" size="middle">
                    <UploadOutlined className="text-xl font-extrabold px-2 pl-3 " />{' '}
                  </Button>
                </Upload>
              </div>
            </div>
            <div>
              {content?.length > 0 && (
                <>
                  <div className="mt-4 mb-5" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                    {content?.map((file, index) => (
                      <div key={file.key}>
                        {index !== 0 && <Divider style={{ marginBottom: 0 }} />}

                        <div className="w-full flex justify-between mt-4 ">
                          <div className="flex">
                            <div className="">
                              <img
                                src={file?.name?.includes('pdf') ? PDF : PNG}
                                alt="uploaded image"
                              />
                            </div>
                            <div className=" mx-6 ">
                              <div className="text-blue-900 text-md font-semibold">
                                {file?.name}
                              </div>
                              <div className="text-gray-400 font-normal text-xs">
                                {dayjs(new Date().toISOString()).format('MMMM D, YYYY')} at{' '}
                                {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                              </div>
                            </div>
                          </div>

                          <div className="flex mx-2 " style={{ float: 'right' }}>
                            <div className="mx-2">
                              {' '}
                              <Popconfirm
                                title="Are you sure you want to delete this document?"
                                onConfirm={() => {
                                  setContent((prev) => {
                                    return [...prev?.filter((item, i) => i !== index)];
                                  });
                                }}
                                okText="Delete"
                                cancelText="Cancel"
                                okType="danger"
                              >
                                <Button type="primary" shape="circle" size="small" className="mb-1">
                                  <DeleteOutlined />
                                </Button>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-5">
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ staff }) => ({
  staffSuperviser: staff?.staffSuperviser,
}))(StaffLeaveForm);
