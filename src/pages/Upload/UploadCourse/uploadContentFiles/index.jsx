/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { useDispatch, connect } from 'umi';
import { PlusOutlined, DeleteOutlined, UploadOutlined, EyeTwoTone } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Popconfirm,
  Upload,
  Spin,
  Modal,
  Tooltip,
  Popover,
  message,
} from 'antd';
import uploadedImg from '@/assets/uploadedImage.png';
import videoIcon from '@/assets/videoIcon.png';

const UploadContentFiles = ({
  courseContentUpload,
  setUploadAllFile,
  uploadAllFile,
  setUploadContent,
  uploadContent,
  singleCourseDetail,
  updateUoploadFile,
  singleModules,
  setFileList,
  fileList,
  courseId,
  updateFiles,
  secondForm,
  setstate,
  state,
  courseContentUploadAll,
  checkValidation,
  setCheckValidation,
  courseViewId,
  moduleViewId,
  loadingForUpload,
  loadingForAdditional,
}) => {
  const [isFileDelete, setIsFileDelete] = useState(false);
  const [encodedList, setEncodedList] = useState([]);
  const [filesLists, setFileslists] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [preview, setPreview] = useState('');
  const [previewModal, setPreviewModal] = useState(false);
  const [additionalFileNameChange, setAdditionalFileNameChange] = useState('');
  const [additionalFileName, setAdditionalFileName] = useState('');
  const [additionalDocument, setAdditionalDocument] = useState();
  const [changeFileNameForm] = Form.useForm();

  const dispatch = useDispatch();

  const formDataValues = (file, name, type) => {
    const formData = new FormData();
    formData.append('file', file);
    dispatch({
      type: 'courses/uploadCourseContentFile',
      payload: {
        body: formData,
      },
    }).then((res) => {
      const contentState = { ...uploadContent };

      contentState.upload_data[Number(name)] = {
        ...contentState?.upload_data?.[Number(name)],
        [type]: {
          encodedFile: res,
          // file,
          id: res?.contentId,
          document: {
            name: file?.name,
            url: URL.createObjectURL(file),
            typeId: type,
          },
        },
      };
      setUploadContent(contentState);
      setFileslists([].concat(type, filesLists));
    });
    setEncodedList([].concat(file, encodedList));
  };
  const handleUpload = (content, name, type) => {
    formDataValues(content, name, type);
  };
  const OnTopicChange = (e, name) => {
    const { value } = e.target;
    const contentData = { ...uploadContent };
    contentData.upload_data[Number(name)] = {
      ...uploadContent?.upload_data[Number(name)],
      topicName: value,
    };
    setUploadContent(contentData);
  };
  useEffect(() => {
    secondForm.setFieldsValue({
      uploadCourse: [undefined],
    });
  }, [secondForm]);
  useEffect(() => {
    if (courseId || (courseViewId && moduleViewId)) {
      secondForm.setFieldsValue({
        uploadCourse: updateFiles?.courseDetails?.topicsDetails?.map((item) => {
          return {
            topicName: item?.name,
            testFile: item?.contents?.find((val) => val?.contentTypeId === 'TEST_FILE')
              ?.thumbNailUrl,
          };
        }),
      });
    }
  }, []);

  return (
    <div className="relative">
      <div className=" bg-white rounded-lg px-1 " style={{}}>
        <div className="px-5 pb-3">
          <div className=" pt-4">
            <Spin spinning={Boolean(loadingForUpload || isFileDelete || loadingForAdditional)}>
              <Form
                name="form_list_fields"
                form={secondForm}
                initalValues={{ uploadCourse: [undefined] }}
                onFinish={() => {
                  if (checkValidation === true) {
                    const contentData = [...uploadContent?.upload_data];
                    const AdditionalDocuments = [...fileList];
                    courseContentUploadAll(contentData, AdditionalDocuments);
                  }
                }}
              >
                <Form.List name="uploadCourse">
                  {(fields, { add, remove }) => (
                    <>
                      {fields?.map(({ key, name, fieldKey }, index) => (
                        <Row
                          gutter={24}
                          className=" py-4 mb-5 rounded-md  border  py-10"
                          key={key}
                          style={{ display: 'flex', flexWrap: 'nowrap', overflow: 'auto' }}
                        >
                          <Col lg={5} xl={5} md={8} sm={12} xs={24}>
                            <span className="font-medium text-gray-800 block mb-3 p-0">
                              Topic Name
                            </span>
                            <Form.Item
                              name={[name, 'topicName']}
                              fieldKey={[fields, 'topicName']}
                              rules={[
                                {
                                  required: state === index || state === '' ? true : null,
                                  message: 'Topic Name is require',
                                },
                              ]}
                              shouldUpdate
                            >
                              <Input
                                size="large"
                                placeholder="Enter your Topic Name"
                                disabled={
                                  uploadContent?.upload_data[Number(name)]?.status === 'ok'
                                    ? true
                                    : null || (courseViewId && moduleViewId)
                                }
                                onChange={(e) => {
                                  OnTopicChange(e, name);
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4} lg={5} xl={5} md={8} sm={12} xs={24}>
                            <Form.Item name={[name, 'testFile']} fieldKey={[fieldKey, 'first']}>
                              <>
                                {uploadContent?.upload_data?.[Number(name)]?.TEST_FILE?.document
                                  ?.name ||
                                uploadContent?.upload_data?.[Number(name)]?.contents?.find(
                                  (ite) => ite?.contentTypeId === 'TEST_FILE',
                                ) ? (
                                  <div className="">
                                    <div className=" flex ">
                                      <div>
                                        <div className="mb-4 font-bold text-sm text-blue-900">
                                          Test File
                                        </div>
                                        <div className="w-full flex justify-between mt-4 ">
                                          <div className="flex">
                                            <div className="text-yellow-700">
                                              <img
                                                src={
                                                  uploadContent?.upload_data?.[
                                                    Number(name)
                                                  ]?.TEST_FILE?.content?.type.includes('video')
                                                    ? videoIcon
                                                    : uploadedImg
                                                }
                                                width={40}
                                                alt="uploaded image"
                                              />
                                            </div>
                                            <div className=" mx-2 ">
                                              <Tooltip
                                                title={
                                                  uploadContent?.upload_data?.[Number(name)]
                                                    ?.TEST_FILE?.document?.name ||
                                                  uploadContent?.upload_data?.[
                                                    Number(name)
                                                  ].contents?.find(
                                                    (ite) => ite?.contentTypeId === 'TEST_FILE',
                                                  )?.name
                                                }
                                              >
                                                <div
                                                  className="text-blue-900 text-md font-semibold w-20"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                  }}
                                                >
                                                  {uploadContent?.upload_data?.[Number(name)]
                                                    ?.TEST_FILE?.document?.name ||
                                                    uploadContent?.upload_data?.[
                                                      Number(name)
                                                    ].contents?.find(
                                                      (ite) => ite?.contentTypeId === 'TEST_FILE',
                                                    )?.name}
                                                </div>
                                              </Tooltip>
                                              <div className="text-gray-400 font-normal text-xs">
                                                {dayjs(new Date().toISOString()).format(
                                                  'MMMM D, YYYY',
                                                )}{' '}
                                                at{' '}
                                                {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{}}>
                                      <div className=" flex justify-between mr-10">
                                        <Popconfirm
                                          disabled={
                                            uploadContent?.upload_data[Number(name)]?.status ===
                                            'ok'
                                              ? true
                                              : null || (courseViewId && moduleViewId)
                                          }
                                          title="Are you sure that you want to delete?"
                                          className="text-red-600 cursor-pointer"
                                          okButtonProps={{
                                            onClick: () => {
                                              setIsFileDelete(true);
                                              if (
                                                uploadContent.upload_data[Number(name)]?.TEST_FILE
                                                  ?.id
                                              ) {
                                                dispatch({
                                                  type: 'courses/deleteUploadFile',
                                                  payload: {
                                                    pathParams: {
                                                      courseId: singleCourseDetail?.id,
                                                      contentId:
                                                        uploadContent?.upload_data[Number(name)]
                                                          .TEST_FILE?.id,
                                                    },
                                                  },
                                                });
                                              }
                                              const contentState = { ...uploadContent };
                                              contentState.upload_data[
                                                Number(name)
                                              ].TEST_FILE = null;
                                              setUploadContent(contentState);
                                              setIsFileDelete(false);
                                            },
                                          }}
                                        >
                                          <Button
                                            disabled={
                                              uploadContent?.upload_data[Number(name)]?.status ===
                                              'ok'
                                                ? true
                                                : null || (courseViewId && moduleViewId)
                                            }
                                            style={{ border: 'none' }}
                                          >
                                            <DeleteOutlined
                                              style={{
                                                color: 'red',
                                              }}
                                            />
                                          </Button>
                                        </Popconfirm>
                                        <div
                                          className="py-1"
                                          onClick={() => {
                                            // setPreview(true);
                                            if (
                                              uploadContent?.upload_data[Number(name)].TEST_FILE
                                                ?.document?.url
                                            ) {
                                              setPreviewModal(true);
                                              setPdfUrl(
                                                uploadContent?.upload_data[Number(name)]?.TEST_FILE
                                                  ?.document?.url,
                                              );
                                              setPreview(
                                                uploadContent?.upload_data[Number(name)]?.TEST_FILE
                                                  ?.document?.name,
                                              );
                                            }
                                            //  else {
                                            //   setPdfUrl(URL.createObjectURL(encodedList[index]));
                                            // }
                                          }}
                                        >
                                          <EyeTwoTone
                                            twoToneColor="#005be7"
                                            className="cursor-pointer"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-1.5">
                                    <p className="font-medium text-xs text-gray-800 mb-3 p-0">
                                      Upload Test File
                                    </p>

                                    <Upload
                                      beforeUpload={(content) => {
                                        handleUpload(content, name, 'TEST_FILE');
                                        return false;
                                      }}
                                      fileList={[]}
                                      typeId="Test_File"
                                    >
                                      <Button
                                        type="primary"
                                        size="large"
                                        disabled={
                                          uploadContent?.upload_data[Number(name)]?.status === 'ok'
                                            ? true
                                            : null || (courseViewId && moduleViewId)
                                        }
                                      >
                                        <UploadOutlined className="text-xl font-extrabold px-2 pl-3 " />{' '}
                                      </Button>
                                    </Upload>
                                  </div>
                                )}
                              </>
                            </Form.Item>
                          </Col>

                          <Col span={4} lg={5} xl={5} md={8} sm={12} xs={24}>
                            <Form.Item name={[name, 'answer_File']} fieldKey={[fieldKey, 'second']}>
                              <>
                                {uploadContent?.upload_data?.[Number(name)]?.ANSWER_FILE?.document
                                  ?.name ? (
                                  <div>
                                    <div className=" flex ">
                                      <div>
                                        <div className="mb-4 font-bold text-sm text-blue-900">
                                          Answer File
                                        </div>
                                        <div className="w-full flex justify-between mt-4 ">
                                          <div className="flex">
                                            <div className="">
                                              <img
                                                src={uploadedImg}
                                                width={40}
                                                alt="uploaded image"
                                              />
                                            </div>
                                            <div className=" mx-2 ">
                                              <Tooltip
                                                title={
                                                  uploadContent?.upload_data?.[Number(name)]
                                                    ?.ANSWER_FILE?.document?.name
                                                }
                                              >
                                                <div
                                                  className="text-blue-900 text-md font-semibold w-20"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                  }}
                                                >
                                                  {
                                                    uploadContent?.upload_data?.[Number(name)]
                                                      ?.ANSWER_FILE?.document?.name
                                                  }
                                                </div>
                                              </Tooltip>
                                              <div className="text-gray-400 font-normal text-xs">
                                                {dayjs(new Date().toISOString()).format(
                                                  'MMMM D, YYYY',
                                                )}{' '}
                                                at{' '}
                                                {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{}}>
                                      <div className="flex justify-between mr-10">
                                        <Popconfirm
                                          disabled={
                                            uploadContent?.upload_data[Number(name)]?.status ===
                                            'ok'
                                              ? true
                                              : null || (courseViewId && moduleViewId)
                                          }
                                          title="Are you sure that you want to delete?"
                                          className="text-red-600 cursor-pointer"
                                          okButtonProps={{
                                            onClick: () => {
                                              setIsFileDelete(true);
                                              if (
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.ANSWER_FILE?.id
                                              ) {
                                                dispatch({
                                                  type: 'courses/deleteUploadFile',
                                                  payload: {
                                                    pathParams: {
                                                      courseId: singleCourseDetail?.id,
                                                      contentId:
                                                        uploadContent?.upload_data[Number(name)]
                                                          .ANSWER_FILE?.id,
                                                    },
                                                  },
                                                });
                                              }
                                              const contentState = { ...uploadContent };
                                              contentState.upload_data[
                                                Number(name)
                                              ].ANSWER_FILE = null;
                                              setUploadContent(contentState);

                                              setIsFileDelete(false);
                                            },
                                          }}
                                        >
                                          <Button
                                            disabled={
                                              uploadContent?.upload_data[Number(name)]?.status ===
                                              'ok'
                                                ? true
                                                : null || (courseViewId && moduleViewId)
                                            }
                                            style={{ border: 'none' }}
                                          >
                                            <DeleteOutlined
                                              style={{
                                                color: 'red',
                                              }}
                                            />
                                          </Button>
                                        </Popconfirm>
                                        <div
                                          className="px-2 py-1"
                                          onClick={() => {
                                            if (
                                              uploadContent?.upload_data[Number(name)].ANSWER_FILE
                                                .document?.url
                                            ) {
                                              setPreviewModal(true);
                                              setPdfUrl(
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.ANSWER_FILE.document?.url,
                                              );
                                              setPreview(
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.ANSWER_FILE?.document?.name,
                                              );
                                            }
                                            // else {
                                            //   setPdfUrl(URL.createObjectURL(encodedList[index]));
                                            // }
                                          }}
                                        >
                                          <EyeTwoTone
                                            twoToneColor="#005be7 "
                                            className="cursor-pointer"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="mt-1.5">
                                    <p className="font-medium text-xs text-gray-800 p-0 mb-3">
                                      Upload Answer File
                                    </p>

                                    <Upload
                                      beforeUpload={(content) => {
                                        handleUpload(content, name, 'ANSWER_FILE');
                                        return false;
                                      }}
                                      fileList={[]}
                                      typeId="Test_File"
                                    >
                                      <Button
                                        type="primary"
                                        size="large"
                                        disabled={
                                          uploadContent?.upload_data[Number(name)]?.status === 'ok'
                                            ? true
                                            : null || (courseViewId && moduleViewId)
                                        }
                                      >
                                        <UploadOutlined className="text-xl font-extrabold px-2 pl-3 " />{' '}
                                      </Button>
                                    </Upload>
                                  </div>
                                )}
                              </>
                            </Form.Item>
                          </Col>
                          <Col span={4} lg={5} xl={5} md={8} sm={12} xs={24}>
                            <Form.Item
                              name={[name, 'discussion_file']}
                              fieldKey={[fieldKey, 'third']}
                            >
                              <>
                                {uploadContent?.upload_data?.[Number(name)]?.DISCUSSION_FILE
                                  ?.document?.name ? (
                                  <div>
                                    <div className=" flex ">
                                      <div>
                                        <div className="mb-4 font-bold text-sm text-blue-900">
                                          Discussion File
                                        </div>
                                        <div className="w-full flex justify-between mt-4 ">
                                          <div className="flex">
                                            <div className="">
                                              <img
                                                src={uploadedImg}
                                                width={40}
                                                alt="uploaded image"
                                              />
                                            </div>
                                            <div className=" mx-2 ">
                                              <Tooltip
                                                title={
                                                  uploadContent?.upload_data?.[Number(name)]
                                                    ?.DISCUSSION_FILE?.document?.name
                                                }
                                              >
                                                <div
                                                  className="text-blue-900 text-md w-20 font-semibold"
                                                  style={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                  }}
                                                >
                                                  {
                                                    uploadContent?.upload_data?.[Number(name)]
                                                      ?.DISCUSSION_FILE?.document?.name
                                                  }
                                                </div>
                                              </Tooltip>
                                              <div className="text-gray-400 font-normal text-xs">
                                                {dayjs(new Date().toISOString()).format(
                                                  'MMMM D, YYYY',
                                                )}{' '}
                                                at{' '}
                                                {dayjs(new Date().toISOString()).format('h:mm A')} -{' '}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div style={{}}>
                                      <div className="flex mr-10 justify-between">
                                        <Popconfirm
                                          disabled={
                                            uploadContent?.upload_data[Number(name)]?.status ===
                                            'ok'
                                              ? true
                                              : null || (courseViewId && moduleViewId)
                                          }
                                          title="Are you sure that you want to delete?"
                                          className="text-red-600 cursor-pointer"
                                          okButtonProps={{
                                            onClick: () => {
                                              setIsFileDelete(true);
                                              if (
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.DISCUSSION_FILE?.id
                                              ) {
                                                dispatch({
                                                  type: 'courses/deleteUploadFile',
                                                  payload: {
                                                    pathParams: {
                                                      courseId: singleCourseDetail?.id,
                                                      contentId:
                                                        uploadContent.upload_data[Number(name)]
                                                          ?.DISCUSSION_FILE?.id,
                                                    },
                                                  },
                                                });
                                              }

                                              const contentState = { ...uploadContent };
                                              contentState.upload_data[
                                                Number(name)
                                              ].DISCUSSION_FILE = null;
                                              setUploadContent(contentState);
                                              setIsFileDelete(false);
                                            },
                                          }}
                                          okText="Yes"
                                          cancelText="No"
                                        >
                                          <Button
                                            disabled={
                                              uploadContent?.upload_data[Number(name)]?.status ===
                                              'ok'
                                                ? true
                                                : null || (courseViewId && moduleViewId)
                                            }
                                            style={{ border: 'none' }}
                                          >
                                            <DeleteOutlined
                                              style={{
                                                color: 'red',
                                              }}
                                            />
                                          </Button>
                                        </Popconfirm>
                                        <div
                                          className="px-2 py-1"
                                          onClick={() => {
                                            if (
                                              uploadContent?.upload_data[Number(name)]
                                                .DISCUSSION_FILE?.document?.url
                                            ) {
                                              setPreviewModal(true);
                                              setPdfUrl(
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.DISCUSSION_FILE?.document?.url,
                                              );
                                              setPreview(
                                                uploadContent?.upload_data[Number(name)]
                                                  ?.DISCUSSION_FILE?.document?.name,
                                              );
                                            }
                                            //  else {
                                            //   setPdfUrl(URL.createObjectURL(encodedList[index]));
                                            // }
                                          }}
                                        >
                                          <EyeTwoTone
                                            twoToneColor="#005be7"
                                            className=" cursor-pointer"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-44 mt-1.5">
                                    <p className="font-medium text-xs mr-2 text-gray-800 mb-3 p-0">
                                      Upload Lesson Discussion File
                                    </p>
                                    <Upload
                                      beforeUpload={(content) => {
                                        handleUpload(content, name, 'DISCUSSION_FILE');
                                        return false;
                                      }}
                                      typeId="DISCUSSION_FILE"
                                      listType="text"
                                    >
                                      <Button
                                        disabled={
                                          uploadContent?.upload_data[Number(name)]?.status === 'ok'
                                            ? true
                                            : null || (courseViewId && moduleViewId)
                                        }
                                        type="primary"
                                        size="large"
                                      >
                                        <UploadOutlined className="text-xl font-extrabold px-2 pl-2.5" />{' '}
                                      </Button>
                                    </Upload>
                                  </div>
                                )}
                              </>
                            </Form.Item>
                          </Col>
                          <Col>
                            <div className="flex">
                              {fileList[Number(name)]?.map((item) => (
                                <div key={item?.uid} className="mx-8">
                                  <div className=" flex  w-56">
                                    <div>
                                      <div className="mb-4 font-bold text-sm text-blue-900">
                                        Additional File
                                      </div>
                                      <div className="w-full flex justify-between mt-4 ">
                                        <div className="flex">
                                          <div className="">
                                            <img
                                              src={uploadedImg}
                                              width={40}
                                              alt="uploaded image"
                                            />
                                          </div>
                                          <div className=" mx-2 ">
                                            <Tooltip title={item?.name}>
                                              <div
                                                className="text-blue-900 text-md w-20 font-semibold"
                                                style={{
                                                  whiteSpace: 'nowrap',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                }}
                                              >
                                                {item?.name}
                                              </div>
                                            </Tooltip>
                                            <div className="text-gray-400 font-normal text-xs">
                                              {dayjs(new Date().toISOString()).format(
                                                'MMMM D, YYYY',
                                              )}{' '}
                                              at {dayjs(new Date().toISOString()).format('h:mm A')}{' '}
                                              -{' '}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div style={{}}>
                                    <div className="flex justify-between">
                                      <Popconfirm
                                        disabled={
                                          uploadContent?.upload_data[Number(name)]?.status === 'ok'
                                            ? true
                                            : null || (courseViewId && moduleViewId)
                                        }
                                        title="Are you sure that you want to delete?"
                                        className="text-red-600 cursor-pointer"
                                        onConfirm={() => {
                                          setIsFileDelete(true);
                                          if (item?.id) {
                                            dispatch({
                                              type: 'courses/deleteUploadFile',
                                              payload: {
                                                pathParams: {
                                                  courseId: singleCourseDetail?.id,
                                                  contentId: item?.id,
                                                },
                                              },
                                            });
                                          }
                                          if (item?.id) {
                                            const deleteArray = [...fileList];
                                            deleteArray[Number(name)] = [
                                              ...deleteArray[Number(name)]?.filter(
                                                (items) => items?.id !== item?.id,
                                              ),
                                            ];

                                            setFileList(deleteArray);
                                          } else {
                                            const newArray = [...fileList];
                                            newArray[Number(name)] = [
                                              ...newArray[Number(name)]?.filter(
                                                (items) =>
                                                  items?.content?.uid !== item?.content?.uid,
                                              ),
                                            ];

                                            setFileList(newArray);
                                          }

                                          setIsFileDelete(false);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                      >
                                        <Button
                                          disabled={
                                            uploadContent?.upload_data[Number(name)]?.status ===
                                            'ok'
                                              ? true
                                              : null || (courseViewId && moduleViewId)
                                          }
                                          style={{ border: 'none' }}
                                        >
                                          <DeleteOutlined
                                            style={{
                                              color: 'red',
                                            }}
                                          />
                                        </Button>
                                      </Popconfirm>
                                      <div
                                        className="px-2 py-1"
                                        onClick={() => {
                                          if (
                                            item?.url ||
                                            item?.downloadUrl ||
                                            item?.thumbNailUrl
                                          ) {
                                            setPreviewModal(true);
                                            setPdfUrl(
                                              item?.url || item?.downloadUrl || item?.thumbNailUrl,
                                            );
                                            setPreview(item?.name || item?.thumbNailUrl);
                                          }
                                          // else {
                                          //   setPdfUrl(URL.createObjectURL(encodedList[index]));
                                          // }
                                        }}
                                      >
                                        <EyeTwoTone
                                          twoToneColor="#005be7"
                                          className=" cursor-pointer"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <Form.Item
                                name={[name, 'Additional_file']}
                                fieldKey={[fieldKey, 'fourth']}
                              >
                                <Popover
                                  getPopupContainer={(node) => node.parentElement}
                                  placement={'left'}
                                  content={
                                    <div>
                                      <div>
                                        <Form
                                          onFinish={(val) => {
                                            const values = val?.documentName.concat(
                                              '.',
                                              additionalFileName?.[1],
                                            );
                                            const newValues = values.replace(
                                              /\.(?=[^\\' ']+$)/,
                                              '.',
                                            );

                                            const content = [
                                              {
                                                id: additionalDocument?.contentId,

                                                name: newValues,
                                              },
                                            ];

                                            dispatch({
                                              type: 'courses/updateAdditionalFileName',
                                              payload: {
                                                body: [...content],
                                              },
                                            }).then(() => {
                                              const obj = {
                                                name: newValues,
                                                typeId: 'ADDITIONAL_FILE',
                                                url: additionalDocument?.url,
                                                id: additionalDocument?.contentId,
                                                // content,
                                              };

                                              setFileList((prev) => {
                                                const cdf = [...prev];
                                                const st = cdf?.findIndex(
                                                  (_, i) => i === Number(name),
                                                );
                                                const newState = [...(cdf[st] || []), obj];
                                                if (st !== -1) {
                                                  cdf[st] = newState;
                                                } else {
                                                  cdf[Number(name)] = newState;
                                                }

                                                return cdf;
                                              });
                                            });
                                            setAdditionalFileNameChange('');
                                          }}
                                          form={changeFileNameForm}
                                        >
                                          <Form.Item
                                            name="documentName"
                                            rules={[
                                              {
                                                required: true,
                                                message: "File name can't be blank",
                                              },
                                            ]}
                                          >
                                            <Input placeholder="Please enter file name" />
                                          </Form.Item>
                                        </Form>
                                      </div>
                                      <div className="flex gap-3   justify-end mt-4 mb-2">
                                        <Button
                                          size="small"
                                          type="primary"
                                          onClick={() => changeFileNameForm.submit()}
                                        >
                                          Done
                                        </Button>
                                      </div>
                                    </div>
                                  }
                                  visible={additionalFileNameChange === name}
                                  title={
                                    <span className="my-2">Do you want to change file name ?</span>
                                  }
                                >
                                  <div className="mt-2 " style={{ width: '85px' }}>
                                    <p className=" text-xs mb-3 font-medium"> Additional Files</p>
                                    <div className=" " style={{ overflowY: 'auto' }}>
                                      <Upload
                                        disabled={courseViewId && moduleViewId}
                                        style={{
                                          margin: '0',
                                          padding: '0',
                                        }}
                                        multiple={false}
                                        fileList={[]}
                                        onRemove={(val) => {
                                          setFileList((prev) => ({
                                            ...prev,
                                            [Number(name)]: prev?.[Number(name)]?.filter(
                                              (item) => item?.uid !== val?.uid,
                                            ),
                                          }));
                                        }}
                                        beforeUpload={async (file) => {
                                          // await popOver(file).then((res)=>{

                                          const formData = new FormData();
                                          formData.append('file', file);

                                          setAdditionalFileNameChange(name);
                                          setAdditionalFileName(file?.name.split(/\.(?=[^\\.]+$)/));

                                          const fileName = file?.name.split(/\.(?=[^\\.]+$)/);
                                          changeFileNameForm?.setFieldsValue({
                                            documentName: fileName?.[0],
                                          });
                                          // })
                                          dispatch({
                                            type: 'courses/uploadCourseContentFile',
                                            payload: {
                                              body: formData,
                                            },
                                          })
                                            .then((res) => {
                                              if (res?.contentId) {
                                                setAdditionalDocument(res);
                                              } else {
                                                message.error('Somthing went wrong ');
                                              }
                                            })
                                            .catch(() => {});

                                          return false;
                                        }}
                                      >
                                        <Button
                                          disabled={
                                            uploadContent?.upload_data[Number(name)]?.status ===
                                            'ok'
                                              ? true
                                              : null || (courseViewId && moduleViewId)
                                          }
                                          type="dashed"
                                          size="large"
                                        >
                                          {' '}
                                          <PlusOutlined className="text-xl font-extrabold px-2 pr-3 rounded-full" />
                                        </Button>
                                      </Upload>
                                    </div>
                                  </div>
                                </Popover>
                              </Form.Item>
                            </div>
                          </Col>
                          <Col
                            style={{
                              padding: '0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            lg={1}
                            xl={1}
                            md={1}
                            sm={1}
                            xs={1}
                          >
                            {uploadContent?.upload_data[Number(name)]?.status === 'Not Ok' ? (
                              <Button
                                htmlType="submit"
                                style={{ border: 'none', color: '#eab308' }}
                                disabled={courseViewId && moduleViewId}
                                onClick={() => {
                                  setstate(Number(name));

                                  if (
                                    secondForm.getFieldValue(['uploadCourse', name, 'topicName'])
                                  ) {
                                    if (fileList[Number(name)]) {
                                      const contentData = [
                                        {
                                          ...uploadContent?.upload_data[Number(name)],
                                          additionalDocuments: [...fileList[Number(name)]],
                                        },
                                      ];
                                      updateUoploadFile(contentData, name);
                                    } else {
                                      const contentData = [
                                        {
                                          ...uploadContent?.upload_data[Number(name)],
                                        },
                                      ];
                                      updateUoploadFile(contentData, name);
                                    }
                                  }
                                }}
                              >
                                Update
                              </Button>
                            ) : (
                              <div>
                                {uploadContent?.upload_data[Number(name)]?.status === 'ok' ? (
                                  <Button
                                    onClick={() => {
                                      const FilterContentData = { ...uploadContent };
                                      FilterContentData.upload_data[Number(name)].status = 'Not Ok';
                                      setUploadContent(FilterContentData);
                                    }}
                                    style={{
                                      border: 'none',
                                      backgroundColor: 'none',
                                      color: 'blue',
                                    }}
                                  >
                                    Edit
                                  </Button>
                                ) : (
                                  <Button
                                    htmlType="submit"
                                    style={{ border: 'none', backgroundColor: 'none' }}
                                    onClick={() => {
                                      setCheckValidation(false);
                                      setstate(Number(name));

                                      if (
                                        secondForm.getFieldValue([
                                          'uploadCourse',
                                          name,
                                          'topicName',
                                        ])
                                      ) {
                                        if (fileList[Number(name)]) {
                                          const contentData = [
                                            {
                                              ...uploadContent?.upload_data[Number(name)],
                                              additionalDocuments: [...fileList[Number(name)]],
                                            },
                                          ];
                                          courseContentUpload(contentData, name);
                                          setUploadAllFile([...uploadAllFile, ...contentData]);
                                        } else {
                                          const contentData = [
                                            {
                                              ...uploadContent?.upload_data[Number(name)],
                                            },
                                          ];
                                          courseContentUpload(contentData, name);
                                          setUploadAllFile([...uploadAllFile, ...contentData]);
                                        }
                                      }
                                    }}
                                  >
                                    save
                                  </Button>
                                )}
                              </div>
                            )}
                          </Col>
                          <Col
                            style={{
                              padding: '0',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            lg={1}
                            xl={1}
                            md={1}
                            sm={1}
                            xs={1}
                          >
                            <Popconfirm
                              disabled={courseViewId && moduleViewId}
                              title="Are you sure that you want to delete?"
                              className="text-red-600 cursor-pointer"
                              okButtonProps={{
                                onClick: () => {
                                  if (uploadContent?.upload_data[Number(name)]?.topicId) {
                                    dispatch({
                                      type: 'courses/deleteUploadCourseContents',
                                      payload: {
                                        pathParams: {
                                          courseId: singleCourseDetail?.id,
                                          moduleId: singleModules?.id,
                                          topicId: uploadContent?.upload_data[Number(name)].topicId,
                                        },
                                      },
                                    });
                                  }
                                  const contentState = { ...uploadContent };
                                  contentState.upload_data[Number(name)] = null;
                                  for (
                                    let i = Number(name);
                                    i < uploadContent?.upload_data?.length;
                                    i++
                                  ) {
                                    if (contentState?.upload_data[i]) {
                                      contentState.upload_data[i - 1] = contentState.upload_data[i];
                                      contentState.upload_data[i] = null;
                                    }
                                  }
                                  contentState.upload_data.length -= 1;
                                  setUploadContent(contentState);

                                  // for additonal files
                                  const contentDeleteRow = [...fileList];
                                  contentDeleteRow[Number(name)] = null;
                                  for (let i = Number(name); i < contentDeleteRow.length; i++) {
                                    if (contentDeleteRow[i]) {
                                      contentDeleteRow[i - 1] = contentDeleteRow[i];
                                      contentDeleteRow[i] = null;
                                    }
                                  }
                                  contentDeleteRow.length -= 1;
                                  setFileList(contentDeleteRow);
                                  remove(name);
                                },
                              }}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined
                                disabled={courseViewId && moduleViewId}
                                style={{ fontSize: '1rem', color: 'rgba(220, 38, 38)' }}
                              />
                            </Popconfirm>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button
                          disabled={courseViewId && moduleViewId}
                          type="dashed"
                          style={{ margin: '0px 10px 10px 0px' }}
                          onClick={() => add()}
                          block
                          icon={
                            <PlusOutlined
                              style={{ marginTop: '0px', paddingTop: '0px' }}
                              className="m-0 p-0"
                            />
                          }
                        >
                          Add field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                {(preview && preview?.includes('.docx')) || preview?.includes('.xlsx') ? (
                  <iframe
                    title="Document Preview"
                    src={pdfUrl}
                    className="h-full text-center w-full"
                    frameBorder="0"
                  />
                ) : (
                  <div>
                    <Modal
                      onCancel={() => setPreviewModal(false)}
                      visible={previewModal}
                      width="80%"
                      title="Document Preview"
                      footer={null}
                      bodyStyle={{ margin: 0, padding: 0, height: '75vh' }}
                    >
                      <iframe
                        title="Document Preview"
                        src={pdfUrl}
                        className="h-full text-center w-full"
                        frameBorder="0"
                      />
                    </Modal>
                  </div>
                )}
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingForUpload: loading?.effects['courses/uploadCourseContentFile'],
  loadingForAdditional: loading?.effects['courses/updateAdditionalFileName'],
}))(UploadContentFiles);
