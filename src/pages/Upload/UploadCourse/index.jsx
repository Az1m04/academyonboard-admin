/* eslint-disable no-unused-vars */
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import { Form, Row, Col, Input, Button, Radio, notification, Spin, Select, message } from 'antd';
import React, { useState } from 'react';
import { useParams, useDispatch, connect, history } from 'umi';

import Breadcrumbs from '@/components/BreadCrumbs';
import { useEffect } from 'react';
import EmptyState from '@/components/EmptyState';
import CheckValidation from '@/components/CheckValidation';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import UploadContentFiles from './uploadContentFiles';

const UploadCourse = ({
  addingCourse,
  allCourses,
  singleCourseDetail,
  uploadCourseLoading,
  getUpdateCourseContents,
  uploadCoursedetails,
  updateCourseDetails,
}) => {
  const [form] = Form.useForm();
  const [secondForm] = Form.useForm();

  const [uploadAllFile, setUploadAllFile] = useState([]);
  const [isFilesSave, setIsFilesSave] = useState(false);
  const [formType, setFormType] = useState(undefined);
  const [allValues, setAllValues] = useState(null);
  const { courseId, moduleId, assocId } = useParams();
  const { courseViewId, moduleViewId, assoViewId } = useParams();

  const [singleModules, setSingleModules] = useState([]);
  const [uploadContent, setUploadContent] = useState({
    upload_data: [],
  });
  const [fileList, setFileList] = useState([]);
  const [uploadModule, setuploadModule] = useState(false);
  const [updateFiles, setUpdateFiles] = useState();
  const [forSingleModule, setForSingleModule] = useState();
  const [dLevel, setDLevel] = useState();
  const [state, setstate] = useState('');
  const [checkValidation, setCheckValidation] = useState(false);
  const [forCourseId, setforCourseId] = useState();
  const [singleUploadCourseDetails, setSingleUploadCourseDetails] = useState();
  const [isDLevelExist, setIsDLevelExist] = useState();

  const dispatch = useDispatch();
  const errorMessage = () => {
    message.info('Record already exist for this module , please add another module');
  };
  const courseContentUpload = (contentData, name) => {
    // setIsFilesSave(true);
    let filteredTopics = [];
    let contents = [];
    let courseTopics = [];
    filteredTopics = contentData?.map((item) => {
      return {
        ...item,
        // ...item?.additionalDocuments,
        contents: [
          { id: item?.TEST_FILE?.id, typeId: item?.TEST_FILE?.document?.typeId },
          { id: item?.ANSWER_FILE?.id, typeId: item?.ANSWER_FILE?.document?.typeId },
          { id: item?.DISCUSSION_FILE?.id, typeId: item?.DISCUSSION_FILE?.document?.typeId },
        ],
        additionalDocuments: [
          {
            id: item?.additionalDocuments?.id,
            typeId: item?.additionalDocuments,
          },
        ],
      };
    });
    contents = filteredTopics?.map((item) => item?.contents?.filter((val) => val?.typeId))[0];

    courseTopics = filteredTopics?.map((item) => {
      if (contents.length > 0) {
        return {
          ...item,
          contents,
        };
      }
      return {
        ...item,
        contents: [],
      };
    });
    delete courseTopics?.[0]?.ANSWER_FILE;
    delete courseTopics?.[0]?.DISCUSSION_FILE;
    delete courseTopics?.[0]?.TEST_FILE;

    dispatch({
      type: 'courses/uploadCourseContentDetails',
      payload: {
        body: { courseTopics },
        pathParams: {
          courseId: singleCourseDetail?.id || forCourseId,
          moduleId: singleModules?.id,
          assocId: singleUploadCourseDetails?.assocId || assocId,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('your course content create successfully');
        const contentNewData = { ...uploadContent };
        const resPItem = res?.courseTopics;
        resPItem?.forEach((val) => {
          val?.contents?.forEach((el) => {
            contentNewData.upload_data[Number(name)][el?.typeId].id = el?.id;
          });
        });
        const topicsID = resPItem?.map((item) => item?.topicId);
        contentNewData.upload_data[Number(name)] = {
          ...uploadContent?.upload_data[Number(name)],
          topicId: topicsID?.toString(),
          status: 'ok',
        };
        setUploadContent(contentNewData);
        const contentFileList = [...fileList];

        resPItem?.forEach((value) => {
          // eslint-disable-next-line consistent-return
          value?.additionalDocuments?.forEach((el, idx) => {
            if (contentFileList[Number(name)][idx].id === undefined) {
              contentFileList[Number(name)][idx].id = el?.id;
            } else {
              return { ...contentFileList[Number(name)][idx] };
            }
          });
        });
        setFileList(contentFileList);
      } else {
        message.error('Something went wrong');
      }
      setIsFilesSave(false);
    });
  };
  const updateUoploadFile = (contentData, name) => {
    setIsFilesSave(true);
    let filteredTopics = [];
    let contents = [];
    let courseTopics = [];
    filteredTopics = contentData?.map((item) => {
      return {
        ...item,

        contents: [
          { id: item?.TEST_FILE?.id, typeId: item?.TEST_FILE?.document?.typeId },
          { id: item?.ANSWER_FILE?.id, typeId: item?.ANSWER_FILE?.document?.typeId },
          { id: item?.DISCUSSION_FILE?.id, typeId: item?.DISCUSSION_FILE?.document?.typeId },
        ],
      };
    });
    contents = filteredTopics?.map((item) => item?.contents?.filter((val) => val?.typeId))[0];

    courseTopics = filteredTopics?.map((item) =>
      contents.length > 0
        ? {
            ...item,
            contents,
          }
        : {
            ...item,
            contents: [],
          },
    );
    delete courseTopics?.[0]?.ANSWER_FILE;
    delete courseTopics?.[0]?.DISCUSSION_FILE;
    delete courseTopics?.[0]?.TEST_FILE;

    dispatch({
      type: 'courses/updateCourseContentFile',
      payload: {
        body: { courseTopics },
        pathParams: {
          courseId: singleCourseDetail?.id || courseId,
          moduleId: singleModules?.id || moduleId,
          assocId: singleUploadCourseDetails?.assocId || assocId,
          // topicId: uploadContent?.upload_data[Number(name)].topicId,
        },
      },
    })
      .then((res) => {
        if (
          !uploadContent.upload_data[Number(name)].DISCUSSION_FILE?.id ||
          !uploadContent.upload_data[Number(name)].ANSWER_FILE?.id ||
          !uploadContent.upload_data[Number(name)].TEST_FILE?.id
        ) {
          const contentNewUpdateData = { ...uploadContent };
          const resPItem = res?.courseTopics;
          resPItem?.forEach((val) => {
            val?.contents?.forEach((el) => {
              contentNewUpdateData.upload_data[Number(name)][el?.typeId].id = el?.id;
            });
          });
          setUploadContent(contentNewUpdateData);
          const contentFileList = [...fileList];

          resPItem?.forEach((value) => {
            // eslint-disable-next-line consistent-return
            value?.additionalDocuments?.forEach((el, idx) => {
              if (contentFileList[Number(name)][idx].id === undefined) {
                contentFileList[Number(name)][idx].id = el?.id;
              } else {
                return { ...contentFileList[Number(name)][idx] };
              }
            });
          });
          setFileList(contentFileList);
        }
      })
      .catch((error) => {
        message.info('something went wrong please try again');
      });
    const newUpdateData = { ...uploadContent };

    newUpdateData.upload_data[Number(name)].status = 'ok';
    setUploadContent(newUpdateData);
    setIsFilesSave(false);
  };
  const courseContentUploadAll = (contentData, AdditionalDocument) => {
    setIsFilesSave(true);
    let filteredTopics = [];
    let contents2 = [];

    let filteredContent2 = [];

    filteredTopics = contentData?.map((item, idx) => {
      return {
        ...item,
        additionalDocuments: AdditionalDocument[idx],
        contents: [
          { id: item?.TEST_FILE?.id, typeId: item?.TEST_FILE?.document?.typeId },
          { id: item?.ANSWER_FILE?.id, typeId: item?.ANSWER_FILE?.document?.typeId },
          { id: item?.DISCUSSION_FILE?.id, typeId: item?.DISCUSSION_FILE?.document?.typeId },
        ],
      };
    });

    contents2 = filteredTopics?.map((item, idx) => item?.contents?.filter((val) => val?.typeId));

    filteredContent2 = filteredTopics?.map((item, idx) => {
      return {
        ...item,
        contents: contents2[idx],
      };
    });

    dispatch({
      type: 'courses/uploadCourseContentDetails',
      payload: {
        body: { courseTopics: filteredContent2 },
        pathParams: {
          courseId: singleCourseDetail?.id,
          moduleId: singleModules?.id,
          assocId: singleUploadCourseDetails?.assocId,
        },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        history.push(`/upload/course-content`);
      }
    });
    setIsFilesSave(false);
  };
  const onFinish = (values) => {
    const course = {
      difficultyLevel: values?.difficultyLevelId,
    };
    course.module = {
      id: values?.moduleId,
    };
    dispatch({
      type: 'courses/uploadCoursedetails',
      payload: {
        body: course,
        pathParams: { courseId: singleCourseDetail?.id, moduleId: singleModules?.id },
      },
    })
      .then((res) => {
        setuploadModule(true);
        setSingleUploadCourseDetails(res);
      })
      .catch((error) => {
        errorMessage();
        setuploadModule(false);
      });

    if (values?.isModule) {
      if (
        values?.isFeeModuleWise === 'TRUE_' &&
        Object.values(values?.moduleWise)?.filter((val) => val)?.length === 0
      ) {
        notification.error({
          message: 'Fee not provided!',
          description: 'Please add at least one type of module fee',
        });
        return;
      }
      if (
        values?.isFeeModuleWise === 'FALSE_' &&
        values?.courseModules?.filter((module_) => {
          return (
            module_?.daywise ||
            module_?.weekly ||
            module_?.monthly ||
            module_?.quaterly ||
            module_?.semester?.yearly
          );
        })?.length === 0
      ) {
        notification.error({
          message: 'Fee not provided for all modules!',
          description: 'Please add at least one type of module fee for all modules',
        });
      }
    }
  };
  const { Option } = Select;
  React.useEffect(() => {
    dispatch({ type: 'courses/getCourses', payload: { query: { viewSize: 1000 } } });
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      courseSubCategory: forSingleModule?.subCategoryName,
      courseCategory: forSingleModule?.categoryName,
      moduleId: undefined,
    });
  }, [forSingleModule, form]);

  const UpdateCourseContentDetails = () => {
    if (courseId || courseViewId) {
      dispatch({
        type: 'courses/getUpdateCourseContents',
        payload: {
          pathParams: {
            courseId: courseId || courseViewId,
            moduleId: moduleId || moduleViewId,
            assocId: assocId || assoViewId,
          },
        },
      }).then((res) => {
        setforCourseId(res?.courseDetails?.courseId);
        setUpdateFiles(res);
        setSingleUploadCourseDetails(res);

        setSingleModules({ id: res?.courseDetails?.moduleId });
        if (res?.courseDetails?.topicsDetails) {
          // eslint-disable-next-line array-callback-return
          res?.courseDetails?.topicsDetails.map((items, idx) => {
            let TEST_FILE = {};
            let ANSWER_FILE = {};
            let DISCUSSION_FILE = {};
            let AdditionalFilesUpdate = [];
            // eslint-disable-next-line no-unused-expressions
            // eslint-disable-next-line no-return-assign
            items?.contents?.filter((item) =>
              // eslint-disable-next-line no-nested-ternary
              item?.contentTypeId === 'TEST_FILE'
                ? (TEST_FILE = {
                    ...item,
                    document: { name: item?.name, url: item?.downloadUrl, typeId: 'TEST_FILE' },
                  })
                : // eslint-disable-next-line no-nested-ternary
                {} && item?.contentTypeId === 'DISCUSSION_FILE'
                ? (DISCUSSION_FILE = {
                    ...item,
                    document: {
                      name: item?.name,
                      url: item?.downloadUrl,
                      typeId: 'DISCUSSION_FILE',
                    },
                  })
                : {} && item?.contentTypeId === 'ANSWER_FILE'
                ? (ANSWER_FILE = {
                    ...item,
                    document: {
                      name: item?.name,
                      url: item?.downloadUrl,
                      typeId: 'ANSWER_FILE',
                    },
                  })
                : {},
            );

            if (items?.additionalContents) {
              AdditionalFilesUpdate = items?.additionalContents?.map((vals) => {
                return { ...vals };
              });
              const Additional = [...fileList];
              setFileList((prev) => {
                const cdf = [...prev];
                const st = cdf?.findIndex((_, i) => i === idx);
                const newState = [...(cdf[st] || []), ...AdditionalFilesUpdate];
                if (st !== -1) {
                  cdf[st] = newState;
                } else {
                  cdf[idx] = newState;
                }

                return cdf;
              });
            }

            const updateNewData = { ...uploadContent };
            updateNewData.upload_data[idx] = {
              ...items,
              topicId: items?.id,
              status: 'Not Ok',
              TEST_FILE,
              ANSWER_FILE,
              DISCUSSION_FILE,
            };
            setUploadContent(updateNewData);
          });
        }
        form.setFieldsValue({
          course: res?.courseDetails?.courseName,
          courseCategory: res?.courseDetails?.categoryName,
          courseSubCategory: res?.courseDetails?.subCategoryName,
          moduleId: res?.courseDetails?.moduleName,
          difficultyLevelId: res?.courseDetails?.difficultyLevel,
        });
      });
    }
  };
  const updateCourseDLevelDetails = () => {
    if (courseId !== undefined) {
      const UpdateDlevel = {
        difficultyLevel: dLevel?.target?.value,
      };
      dispatch({
        type: 'courses/updateCourseDLevelDetails',
        payload: {
          body: UpdateDlevel,
          pathParams: { courseId, moduleId, assocId },
        },
      }).then((res) => {
        if (res?.responseMessage === 'success') {
          message.success('course has been updated');
        } else if (
          res?.message ===
          'This course module already has same difficult level so cannot update this one, Please provide another difficulty level or module.'
        ) {
          message.error(res?.message);
        } else {
          message.error('Something went wrong ');
        }
      });
    }
  };
  useEffect(() => {
    UpdateCourseContentDetails();
  }, []);

  return (
    <Page
      title={
        (courseViewId && moduleViewId && 'View Course') ||
        (courseId && moduleId && 'Update') ||
        'Upload'
      }
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'Upload',
              path: '/upload/course-content',
            },
            {
              name:
                (courseViewId && moduleViewId && 'View Course') ||
                (courseId && moduleId && 'Update Course') ||
                'Upload Course',
              path: '#',
            },
          ]}
        />
      }
    >
      <Spin spinning={Boolean(uploadCourseLoading || uploadCoursedetails || updateCourseDetails)}>
        <Form
          form={form}
          onFinish={onFinish}
          onValuesChange={(values) => {
            setAllValues(values);
          }}
          hideRequiredMark
          scrollToFirstError
        >
          <div className=" bg-white rounded-lg mb-5 shadow">
            <div className="text-base text-gray-800 font-semibold px-5 py-5 border-b">
              <p>Test details</p>
            </div>
            <div className="px-5 pb-3">
              <div className="py-4">
                <div className="flex justify-between p-3 rounded  mb-8 bg-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">Select course options</h2>
                </div>
                <Row gutter={24} className="pb-5 px-4">
                  <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 mb-3">Course</p>
                    <Form.Item name="course" rules={[{ required: true, message: 'Course' }]}>
                      <Select
                        size="large"
                        showSearch
                        placeholder="Please select course"
                        disabled={courseId || (courseViewId && moduleViewId)}
                        optionFilterProp="children"
                        onChange={(value) => {
                          dispatch({
                            type: 'courses/getCourseDetails',
                            payload: {
                              pathParams: {
                                courseId: value,
                              },
                              // query: { moduleHasContent: true },
                            },
                          }).then((response) => {
                            setForSingleModule(response);
                          });
                          form.setFieldsValue({
                            difficultyLevelId: undefined,
                          });
                        }}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {allCourses &&
                          allCourses?.records?.length > 0 &&
                          allCourses?.records.map((item) => {
                            return (
                              <Option value={item.id} key={item?.id}>
                                {item?.displayName}
                              </Option>
                            );
                          })}
                      </Select>
                    </Form.Item>
                  </Col>
                  {forSingleModule?.categoryName || getUpdateCourseContents ? (
                    <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3">Category</p>
                      <Form.Item name="courseCategory">
                        <Input size="large" placeholder="Course category" disabled={true} />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {forSingleModule?.subCategoryName || getUpdateCourseContents ? (
                    <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3">Subcategory</p>
                      <Form.Item name="courseSubCategory">
                        <Input placeholder="Course sub category" size="large" disabled={true} />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {/* course module */}
                  {forSingleModule?.subCategoryName || getUpdateCourseContents ? (
                    <Col xl={6} lg={8} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-3">Select module</p>
                      <Form.Item
                        name="moduleId"
                        rules={[
                          {
                            required: true,
                            message: 'Please select module ',
                          },
                        ]}
                      >
                        <Select
                          disabled={courseId || (courseViewId && moduleViewId)}
                          mode="single"
                          showSearch
                          size="large"
                          placeholder="Select"
                          onChange={(value) => {
                            setSingleModules(
                              forSingleModule?.courseModules?.find((fil) => fil?.id === value),
                            );
                            form.setFieldsValue({
                              difficultyLevelId: undefined,
                            });
                          }}
                        >
                          {forSingleModule?.courseModules?.map((module) => (
                            <Option key={module?.id} value={module?.id}>
                              {module?.displayName || ''}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Col>
                    <p className="mb-1 font-medium text-gray-800 mb-3">Difficulty level</p>
                    <Form.Item
                      name="difficultyLevelId"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please select difficulty level ',
                        },
                      ]}
                    >
                      <Radio.Group
                        disabled={formType || (courseViewId && moduleViewId)}
                        style={{ maxWidth: '16rem' }}
                        size="large"
                        buttonStyle="solid"
                        rules={[{ required: true, message: 'Please select difficulty level' }]}
                        onChange={(value) => {
                          const isCourseId = form.getFieldValue('course');
                          const isModuleId = form.getFieldValue('moduleId');
                          if (isCourseId && isModuleId) {
                            dispatch({
                              type: 'courses/getCourseContentDLevel',
                              payload: {
                                pathParams: {
                                  courseId: courseId || isCourseId,
                                  moduleId: moduleId || isModuleId,
                                  dLevel: value.target.value,
                                },
                              },
                            }).then((res) => {
                              setIsDLevelExist(res?.isDifficultyLevelExist);
                              if (res?.isDifficultyLevelExist) {
                                message.info('This level is already created for this course');
                              }
                            });
                          }
                          setDLevel(value);
                        }}
                      >
                        <Radio.Button value="EASY">Easy </Radio.Button>
                        <Radio.Button value="INTERMEDIATE">Intermediate</Radio.Button>
                        <Radio.Button value="HARD">Hard</Radio.Button>{' '}
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '15px' }}>
                  <Col>
                    <div>
                      {courseId === undefined ? (
                        <div>
                          {singleModules?.length !== 0 ? (
                            <div>
                              {uploadModule === false ? (
                                <Button
                                  type="primary"
                                  size="large"
                                  disabled={courseViewId || isDLevelExist}
                                  htmlType="submit"
                                >
                                  save
                                </Button>
                              ) : (
                                <Button type="primary" disabled={true} size="large">
                                  saved
                                </Button>
                              )}
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <Button
                          disabled={courseViewId || isDLevelExist}
                          size="large"
                          type="primary"
                          onClick={() => {
                            updateCourseDLevelDetails();
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <CheckValidation
            show={uploadModule !== false || updateFiles}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No upload details</span>}
              />
            }
          >
            {uploadModule === true || updateFiles ? (
              <div className=" bg-white rounded-lg mb-5 shadow ">
                <div className="text-base text-gray-800 font-semibold px-5 py-4 border-b">
                  <p>Upload details</p>
                </div>
                <div className="px-5 pb-3">
                  <div className="flex justify-between   mt-4 rounded p-3 bg-gray-100 mb-6 ">
                    <h2 className="text-xl font-semibold ">
                      {' '}
                      {singleModules?.displayName || updateFiles?.courseDetails?.moduleName}
                    </h2>
                  </div>
                </div>
                <Spin spinning={isFilesSave}>
                  <UploadContentFiles
                    courseContentUpload={courseContentUpload}
                    setUploadAllFile={setUploadAllFile}
                    uploadAllFile={uploadAllFile}
                    setUploadContent={setUploadContent}
                    uploadContent={uploadContent}
                    singleCourseDetail={singleCourseDetail}
                    updateUoploadFile={updateUoploadFile}
                    singleModules={singleModules}
                    setFileList={setFileList}
                    fileList={fileList}
                    courseId={courseId}
                    getUpdateCourseContents={getUpdateCourseContents}
                    updateFiles={updateFiles}
                    secondForm={secondForm}
                    setstate={setstate}
                    state={state}
                    courseContentUploadAll={courseContentUploadAll}
                    checkValidation={checkValidation}
                    setCheckValidation={setCheckValidation}
                    courseViewId={courseViewId}
                    moduleViewId={moduleViewId}
                    singleUploadCourseDetails={singleUploadCourseDetails}
                  />
                </Spin>
              </div>
            ) : null}
          </CheckValidation>

          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '80rem',
              }}
            >
              <div className="w-full text-black">
                {courseId === undefined && courseViewId === undefined ? (
                  <Button
                    disabled={singleModules?.length === 0 || isDLevelExist}
                    type="primary"
                    size="large"
                    loading={addingCourse}
                    onClick={() => {
                      setstate('');
                      setCheckValidation(true);

                      secondForm.submit();
                    }}
                  >
                    Upload Course
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    loading={addingCourse}
                    onClick={() => {
                      history.push(`/upload/course-content`);
                    }}
                  >
                    Return to Table
                  </Button>
                )}
              </div>
            </div>
          </FixedFooter>
        </Form>
      </Spin>
    </Page>
  );
};

export default connect(({ courses, loading }) => ({
  allCourses: courses?.allCourses,
  singleCourseDetail: courses?.singleCourseDetail,
  updateCourseContentRes: courses?.updateCourseContentRes,
  uploadCourseLoading: loading?.effects['courses/getCourseDetails'],
  uploadCoursedetails: loading?.effects['courses/uploadCoursedetails'],
  updateCourseDetails: loading?.effects['courses/getUpdateCourseContents'],
  getUpdateCourseContents: courses?.getUpdateCourseContents,
}))(UploadCourse);
