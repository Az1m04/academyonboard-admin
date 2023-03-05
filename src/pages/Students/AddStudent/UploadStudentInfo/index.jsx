import { DeleteOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Popconfirm, Button, Divider } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import dayjs from 'dayjs';
import React from 'react';
import UploadStudentFile from './UploadStudentFile';

const UploadStudentInfo = ({ setContents, contents }) => {
  return (
    <div>
      <Row gutter={12}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <p className="font-medium text-gray-800 mt-4">ID proof no.</p>

          <div className=" flex ">
            <Form.Item name="idProof">
              <div className=" flex ">
                <Input size="large" placeholder="Enter your ID proof no." />
              </div>
            </Form.Item>
            <UploadStudentFile setContents={setContents} contents={contents} typeId="ID_CARD" />
          </div>
        </Col>
      </Row>

      <div>
        <div>
          {contents?.length > 0 && (
            <>
              <div className="my-4 font-bold text-sm text-blue-900">Uploaded Documents</div>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {contents?.map((info, index) => (
                  <div key={info?.name}>
                    {index !== 0 && <Divider />}

                    <div className="w-full flex justify-between mt-4 ">
                      <div className="flex">
                        <div className="">
                          <img src={info?.name?.includes('pdf') ? PDF : PNG} alt="PNG" />
                        </div>
                        <div className=" mx-6 ">
                          <div className="text-blue-900 text-md font-semibold">{info?.name}</div>
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
                            title="Are you sure you want to delete this attachment?"
                            onConfirm={() => {
                              setContents(() => contents?.filter((item, i) => i !== index));
                            }}
                            okText="Delete"
                            cancelText="Cancel"
                            okType="danger"
                          >
                            <Button type="primary" shape="circle" size="small">
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
    </div>
  );
};

export default UploadStudentInfo;
