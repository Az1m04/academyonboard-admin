import { DeleteOutlined, EyeTwoTone } from '@ant-design/icons';
import { Row, Col, Input, Form, Button, Popconfirm, Divider, Modal } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import UploadFile from '../UploadFile';

const BusinessDetails = ({ contents, setContents, disabled }) => {
  const [previewModal, setPreviewModal] = useState(false);
  const [uploadInfo, setUploadInfo] = useState();
  const [checkpanUpload, setCheckpanUpload] = useState(false);
  useEffect(() => {
    const newValues = contents?.map((item) => item?.typeId);
    if (newValues.includes('PAN_CARD')) {
      setCheckpanUpload(true);
    } else {
      setCheckpanUpload(false);
    }
  }, [contents]);

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Bank name</p>
          <Form.Item name="bankName">
            <Input disabled={disabled} size="large" placeholder="enter bank name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Account number</p>
          <Form.Item
            name="accountNumber"
            //  rules={[
            // {
            //   min:10,
            //   man:10,message:"Please entre valid "
            // }
            // ]}
          >
            <Input
              disabled={disabled}
              size="large"
              type="number"
              placeholder="enter account number"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">IFSC code</p>
          <Form.Item
            name="ifscCode"
            rules={[
              {
                max: 11,
                min: 11,
                message: 'Please enter valid IFSC code',
              },
            ]}
          >
            <Input
              type="number"
              style={{ width: '100%' }}
              disabled={disabled}
              size="large"
              placeholder="enter IFSC code"
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">GST number</p>
          <div className="flex">
            <Form.Item
              name="gstNumber"
              rules={[
                {
                  max: 15,
                  min: 15,
                  message: 'Please enter vaid GST number',
                },
              ]}
            >
              <div className="flex">
                <Input
                  type="number"
                  style={{ width: '100%' }}
                  maxLength={15}
                  disabled={disabled}
                  size="large"
                  placeholder="enter gst number"
                />
              </div>
            </Form.Item>
            <Form.Item name="gstImg">
              <UploadFile
                disabled={disabled}
                typeId={'GST_NUMBER'}
                contents={contents}
                setContents={setContents}
              />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">PAN number</p>
          <div className="flex">
            <Form.Item
              name="panNumber"
              rules={[
                {
                  max: 10,
                  min: 10,
                  message: 'Please enter valid pan number',
                },
              ]}
            >
              <div className="flex">
                <Input
                  type="number"
                  style={{ width: '100%' }}
                  disabled={disabled}
                  size="large"
                  placeholder="enter pan number"
                />
              </div>
            </Form.Item>
            <Form.Item name="panNumberImg">
              <UploadFile
                disabled={disabled || checkpanUpload}
                typeId={'PAN_CARD'}
                contents={contents}
                setContents={setContents}
              />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Legal documents</p>
          <Form.Item name="legalDocuments">
            <UploadFile
              disabled={disabled}
              typeId={'OTHER_DOC'}
              contents={contents}
              setContents={setContents}
            />
          </Form.Item>
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
                        <div className="mx-2 flex justify-between">
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
                            <Button
                              type="primary"
                              shape="circle"
                              size="small"
                              className="items-center mt-1.5 mx-2"
                            >
                              <DeleteOutlined />
                            </Button>
                          </Popconfirm>
                          <div
                            className="px-2 py-1"
                            onClick={() => {
                              setPreviewModal(true);
                              // if (info?.url || info?.thumbNailUrl) {
                              setUploadInfo(info);
                              // setPreview(item?.name || item?.thumbNailUrl);
                              // } else {
                              //   setUploadInfo(URL.createObjectURL(encodedList[index]));
                              // }
                            }}
                          >
                            <EyeTwoTone
                              twoToneColor="#005be7"
                              className=" cursor-pointer text-xl"
                            />
                          </div>
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
      <div>
        <Modal
          onCancel={() => setPreviewModal(false)}
          visible={previewModal}
          width={900}
          title="Document Preview"
          footer={null}
          bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
        >
          {uploadInfo?.name.includes('pdf') ? (
            <iframe
              title="Document Preview"
              src={uploadInfo?.url}
              className="h-full text-center w-full"
              frameBorder="0"
            />
          ) : (
            <div>
              <img src={uploadInfo?.url} alt="uploaded document" />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default BusinessDetails;
