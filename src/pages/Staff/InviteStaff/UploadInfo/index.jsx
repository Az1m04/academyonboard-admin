import { DeleteOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Popconfirm, Button, Divider, Select } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import UploadFile from './Upload';

const UploadInfo = ({ setContents, contents }) => {
  const [uploadTypeID, setUploadTypeID] = useState('LGOIMGURL');

  const { Option } = Select;

  const getTypeOfDocument = (type) => {
    switch (type) {
      case 'PAN_CARD':
        return 'PAN CARD';
      case 'ID_CARD':
        return 'ID CARD';
      case 'OTHER_DOC':
        return 'OTHER DOCUMENT';
      case 'LGOIMGURL':
        return 'Image';
      case 'RESUME':
        return 'CV';
      case '"EXPERIENCE_LETTER"':
        return '"EXPERIENCE LETTER"';
      default:
        return 'Document';
    }
  };
  function isDocumentTypeUploaded(type) {
    // document is already uploaded if true
    return contents?.findIndex((content) => content?.typeId === type) !== -1;
  }
  const arrayOfTypesOfDoc = [
    { name: 'Upload photo', value: 'LGOIMGURL' },
    { name: 'Upload CV', value: 'RESUME' },
    { name: 'Upload other documents', value: 'OTHER_DOC' },
    { name: 'Experience letter', value: 'EXPERIENCE_LETTER' },
    { name: 'Offer letter', value: 'OFFER_LETTER' },
  ];

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800 mt-4">PAN card no.</p>

          <div className="flex">
            <Form.Item name="panCard">
              <div className="flex">
                <Input size="large" placeholder="Enter your pan no." />
              </div>
            </Form.Item>
            <UploadFile
              disabled={isDocumentTypeUploaded('PAN_CARD')}
              setContents={setContents}
              contents={contents}
              typeId="PAN_CARD"
            />
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800 mt-4">ID proof no.</p>

          <div className=" flex ">
            <Form.Item name="idProof">
              <div className=" flex ">
                <Input size="large" placeholder="Enter your ID proof no." />
              </div>
            </Form.Item>
            <UploadFile
              disabled={isDocumentTypeUploaded('ID_CARD')}
              setContents={setContents}
              contents={contents}
              typeId="ID_CARD"
            />
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800 mt-4">Upload other documents</p>
          <div className="flex">
            <Select
              size="large"
              className="w-full"
              placeholder="upload other documents"
              getPopupContainer={(node) => node.parentNode}
              onChange={(val) => setUploadTypeID(val)}
              value={uploadTypeID}
            >
              {arrayOfTypesOfDoc?.map((doc) => (
                <Option key={doc.value} value={doc.value}>
                  <div className="flex items-center justify-between ">{doc.name}</div>
                </Option>
              ))}
            </Select>
            <UploadFile
              disabled={isDocumentTypeUploaded(uploadTypeID)}
              setContents={setContents}
              contents={contents}
              typeId={uploadTypeID}
            />
          </div>
        </Col>
      </Row>
      <div>
        <div>
          {contents?.length > 0 && (
            <>
              <div className="mt-4" style={{ maxHeight: '20vh', overflow: 'auto' }}>
                {contents?.map((file, index) => (
                  <div key={file.key}>
                    {index !== 0 && <Divider style={{ marginBottom: 0 }} />}
                    <div className="mb-4 font-bold text-sm text-blue-900">
                      {getTypeOfDocument(file?.typeId)}
                    </div>
                    <div className="w-full flex justify-between mt-4 ">
                      <div className="flex">
                        <div className="">
                          <img src={file?.name?.includes('pdf') ? PDF : PNG} alt="uploaded image" />
                        </div>
                        <div className=" mx-6 ">
                          <div className="text-blue-900 text-md font-semibold">{file?.name}</div>
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
                              setContents((prev) => {
                                return [...prev?.filter((item, i) => i !== index)];
                              });
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

export default UploadInfo;
