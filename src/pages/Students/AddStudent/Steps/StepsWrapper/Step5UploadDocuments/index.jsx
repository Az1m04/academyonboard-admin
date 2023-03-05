import React, { useState } from 'react';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, Popconfirm, Button, Divider, Select, Modal } from 'antd';
import PNG from '@/assets/file-types/png_doc.svg';
import PDF from '@/assets/file-types/pdf_doc.svg';
import dayjs from 'dayjs';
import UploadStudentFile from './UploadStudentFile';
import UploadFile from './Upload';
import PassportDetails from '../../../PassportDetails';
import Card from '@/components/Structure/Card';
import styles from './index.less';

const Step5UploadDocuments = ({
  setContents,
  contents,
  onNextClick,
  uploadDocumentForm,
  currentStepForStudent,
  className,
}) => {
  const [typeId, setTypeId] = useState();
  const [viewUploadedDocuments, setViewUploadedDocuments] = useState(false);
  const [enableDisableUploadButton, setEnableDisableUploadButton] = useState();
  const [uploadUrl, setUploadUrl] = useState();
  const [checkFileExtension, setCheckFileExtension] = useState([]);
  const [uploadTypeID, setUploadTypeID] = useState('LGOIMGURL');

  const idProofList = [
    {
      id: 'AADHAAR_CARD',
      name: 'Aadhaar card',
    },
    {
      id: 'VOTER_CARD',
      name: 'Voter card',
    },
    {
      id: 'DRIVER_LICENSE',
      name: 'Driving license',
    },
    {
      id: 'PAN_CARD',
      name: 'Pan card',
    },
    {
      id: 'PASSPORT',
      name: 'Passport',
    },
  ];

  const idProofSelection = (value) => {
    uploadDocumentForm.setFieldsValue({
      idProof: '',
    });
    setTypeId(value);
    // setEnableDisableUploadButton('');
  };
  // const cleanInput = (inp) => {
  //   if (inp) {
  //     return inp.replace(/(?!-)[^0-9.]/g, '');
  //   }
  //   return '';
  // };
  function isDocumentTypeUploaded(type) {
    // document is already uploaded if true
    return contents?.findIndex((content) => content?.typeId === type) !== -1;
  }
  function isProfileUploaded(type) {
    // profile pic is already uploaded if true
    return contents?.findIndex((content) => content?.typeId === type) !== -1;
  }
  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={uploadDocumentForm}
        onFinish={() => {
          onNextClick();
        }}
        name={'documentsForm'}
      >
        <Card>
          <h2 className="p-5 text-base font-semibold text-gray-800">Upload documents</h2>
          <Divider style={{ margin: '0' }} />
          <div className="px-4 pb-5">
            <Row gutter={12}>
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="font-medium text-gray-800 mt-4">Select ID proof</p>
                <Form.Item
                  name="typeId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select id proof !',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="Please select the category"
                    style={{ width: '100%' }}
                    getPopupContainer={(node) => node.parentNode}
                    onSelect={(val) => {
                      idProofSelection(val);
                      setUploadTypeID(val);
                      setEnableDisableUploadButton(val);
                    }}
                    // disabled={contents?.length > 0 ? true : null}
                  >
                    {idProofList?.map((item) => (
                      <Select.Option value={item?.id} key={item?.id}>
                        {item?.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              {/* {uploadDocumentForm.getFieldValue('typeId') !== undefined && ( */}
              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <p className="font-medium text-gray-800 mt-4">
                  {idProofList?.find((item) => item?.id === typeId)?.name
                    ? idProofList?.find((item) => item?.id === typeId)?.name
                    : 'ID proof'}
                  {`${' '}no.`}
                </p>
                <div className="flex w-max  ">
                  <Form.Item
                    name="idProof"
                    rules={[
                      {
                        required: true,
                        message: `Please enter your ID proof no.`,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      maxLength={12}
                      placeholder={`Enter your ${
                        idProofList?.find((item) => item?.id === typeId)?.name
                          ? idProofList?.find((item) => item?.id === typeId)?.name
                          : 'ID proof'
                      } no.`}
                      autoComplete="off"
                      onBlur={(event) => {
                        if (typeId === 'AADHAAR_CARD') {
                          const res = event.target.value
                            ?.replaceAll('-', '')
                            ?.match(/.{1,4}/g)
                            ?.join('-');
                          uploadDocumentForm.setFieldsValue({
                            idProof: res,
                          });
                        }
                      }}
                      // onChange={(e) => {
                      //   // setUploadTypeID(e.target.value)
                      //   // if (typeId === 'AADHAAR_CARD') {
                      //   //   const value = cleanInput(e.target.value.toString());
                      //   //   setEnableDisableUploadButton(value);
                      //   //   uploadDocumentForm.setFieldsValue({
                      //   //     idProof: value,
                      //   //   });
                      //   // } else {
                      //   //   setEnableDisableUploadButton(e);
                      //   // }
                      // }}
                      // disabled={contents?.length > 0 ? true : null}
                    />
                  </Form.Item>
                  <div className="ml-3">
                    <UploadStudentFile
                      setContents={setContents}
                      contents={contents}
                      typeId={uploadTypeID}
                      uploadDocumentForm={uploadDocumentForm}
                      enableDisableUploadButton={enableDisableUploadButton}
                      disabled={isDocumentTypeUploaded(uploadTypeID)}
                    />
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <UploadFile
                  setContents={setContents}
                  contents={contents}
                  typeId={'LGOIMGURL'}
                  buttonTitle="Upload profile pic"
                  disabled={isProfileUploaded('LGOIMGURL')}
                />
              </Col>
            </Row>

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
                                {info?.name}
                              </div>
                              <div className="text-gray-400 font-normal text-xs">
                                {dayjs(new Date().toISOString()).format('MMMM D, YYYY')} at{' '}
                                {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                              </div>
                            </div>
                          </div>

                          <div className="flex mx-2 " style={{ float: 'right' }}>
                            <Button
                              type="primary"
                              shape="circle"
                              size="small"
                              onClick={() => {
                                setViewUploadedDocuments(true);
                                setUploadUrl(info?.encodedFile);
                                setCheckFileExtension(info?.name);
                                // setDisplayFrame(true);
                              }}
                            >
                              <EyeOutlined />
                            </Button>
                            <div className="mx-2">
                              <Popconfirm
                                title="Are you sure you want to delete this attachment?"
                                onConfirm={() => {
                                  setContents(() => contents?.filter((item, i) => i !== index));
                                  uploadDocumentForm.setFieldsValue({
                                    idProof: undefined,
                                    typeId: undefined,
                                    uploadItems: undefined,
                                  });

                                  setEnableDisableUploadButton('');
                                  setTypeId('');
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
        </Card>
        {checkFileExtension.includes('.docx') || checkFileExtension.includes('.xlsx') ? (
          <iframe
            title="Document Preview"
            src={uploadUrl}
            className="h-full text-center w-full"
            frameBorder="0"
          />
        ) : (
          <Modal
            footer={false}
            visible={viewUploadedDocuments}
            maskClosable={true}
            onCancel={() => setViewUploadedDocuments(false)}
            className={`rounded-lg ${styles.modalHeaderStyle} ${styles.modalOverride}`}
            bodyStyle={{ margin: 0, padding: 0, height: '75vh', width: '100%' }}
          >
            <iframe
              title="Document Preview"
              src={uploadUrl}
              className="h-full text-center w-full"
              frameBorder="0"
            />
            {/* <img src={} alt="uploaded document" className="w-full h-full" /> */}
          </Modal>
        )}
        <PassportDetails form={uploadDocumentForm} />
      </Form>
    </div>
  );
};

export default Step5UploadDocuments;
