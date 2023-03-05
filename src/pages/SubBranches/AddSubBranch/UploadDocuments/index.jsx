import React from 'react';
import { DeleteOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Col, Divider, Form, Input, Modal, Popconfirm, Row } from 'antd';
import dayjs from 'dayjs';
import UploadFile from '../UploadFile';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';

const UploadDocuments = ({
  contents,
  setContents,
  previewModal,
  setPreviewModal,
  documentUrl,
  setDocumentUrl,
}) => {
  const documentName = (typeId, docName) => {
    const name =
      typeId === 'PAN_CARD' || typeId === 'GST_NUMBER'
        ? (typeId === 'PAN_CARD' && 'Pan card ID') || (typeId === 'GST_NUMBER' && 'GST ID')
        : docName;
    return name;
  };
  return (
    <>
      <Row>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">GST number</p>
          <div className="flex">
            <Form.Item
              name={['bankDetail', 'gstNum']}
              rules={[
                {
                  required: true,
                  message: 'please enter gst number',
                },
                () => ({
                  validator(_, value) {
                    if (value?.length <= 15) {
                      return Promise.resolve();
                      // eslint-disable-next-line no-else-return
                    } else {
                      return Promise.reject(
                        value && new Error(`${'Gst number only contains 15 digits'}`),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input size="large" placeholder="enter gst number" />
            </Form.Item>
            <Form.Item name="gstImg">
              <UploadFile typeId={'GST_NUMBER'} contents={contents} setContents={setContents} />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">PAN number</p>
          <div className="flex">
            <Form.Item
              name={['bankDetail', 'panCard']}
              rules={[
                {
                  required: true,
                  message: 'please enter pan number',
                },
                () => ({
                  validator(_, value) {
                    if (value?.length <= 15) {
                      return Promise.resolve();
                      // eslint-disable-next-line no-else-return
                    } else {
                      return Promise.reject(
                        value && new Error(`${'Pan number only contains 15 digits'}`),
                      );
                    }
                  },
                }),
              ]}
            >
              <Input size="large" placeholder="enter pan number" />
            </Form.Item>
            <Form.Item name="panNumberImg">
              <UploadFile typeId={'PAN_CARD'} contents={contents} setContents={setContents} />
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} sm={18} md={12} lg={6} xl={6}>
          <p className="font-medium text-gray-800">Legal documents</p>
          <Form.Item name="legalDocuments">
            <UploadFile typeId={'OTHER_DOC'} contents={contents} setContents={setContents} />
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
                          <div className="text-blue-900 text-md font-semibold">
                            {documentName(info?.typeId, info?.name)}
                          </div>
                          <div className="text-gray-400 font-normal text-xs">
                            {dayjs(new Date().toISOString()).format('MMMM D, YYYY')} at{' '}
                            {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                          </div>
                        </div>
                      </div>

                      <div className="flex mx-2 items-center gap-5">
                        <button
                          className="py-1.5 px-1.5 bg-blue-200 rounded-full flex items-center justify-center "
                          type="button"
                          onClick={() => {
                            setPreviewModal(true);
                            if (info?.thumbUrl) {
                              setDocumentUrl({
                                url: info?.thumbUrl,
                                name: info?.name,
                                typeId: info?.typeId,
                              });
                            }
                          }}
                        >
                          <EyeTwoTone twoToneColor="#005be7" className="cursor-pointer" />
                        </button>
                        <div className="mx-2">
                          <Popconfirm
                            title="Are you sure you want to delete this attachment?"
                            onConfirm={() => {
                              setContents(() =>
                                contents?.filter(
                                  (item) => item?.uid !== info?.uid || item?.id !== info?.id,
                                ),
                              );
                            }}
                            okText="Delete"
                            cancelText="Cancel"
                            okType="danger"
                          >
                            <Button
                              type="primary"
                              shape="circle"
                              size="small"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
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
        {documentUrl?.name?.includes('.docx') || documentUrl?.name?.includes('.xlsx') ? (
          <iframe
            title={documentName(documentUrl?.typeId, documentUrl?.name)}
            src={documentUrl?.url}
            className="h-full text-center w-full"
            frameBorder="0"
          />
        ) : (
          <div>
            <Modal
              onCancel={() => setPreviewModal(false)}
              visible={previewModal}
              width="80%"
              title={documentName(documentUrl?.typeId, documentUrl?.name)}
              footer={null}
              bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
            >
              <iframe
                src={documentUrl?.url}
                className="h-full text-center w-full"
                frameBorder="0"
              />
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadDocuments;
