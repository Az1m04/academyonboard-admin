/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import {
  Form,
  Row,
  Col,
  Collapse,
  Radio,
  Select,
  Divider,
  Input,
  Button,
  Checkbox,
  Space,
  message,
} from 'antd';
import Breadcrumbs from '@/components/BreadCrumbs';
import Card from '@/components/Structure/Card';
import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditorConfig from '@/config/appConfig';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Trash } from 'react-bootstrap-icons';
import AddQuestionModal from './AddQuestionModal/index';
import FixedFooter from '@/components/FixedFooter';
import { connect, history } from 'umi';
import MultipleSelectModules from './MultipleSelectModules/index';
import CourseDetails from '@/pages/Courses/CourseDetails';
import { Attachment } from '@/utils/AppIcons';

const AddTest = (props) => {
  const {
    testRecord,

    dispatch,
    allCourses,
    singleCourseDetail,
    location,
    match: {
      params: { testId },
    },
  } = props;
  const [form] = Form.useForm();
  const { Option } = Select;
  const { TextArea } = Input;
  const { Panel } = Collapse;
  const [allValues, setAllValues] = useState(null);
  const [allModalValues, setAllModalValues] = useState([]);
  const [audioContent, setAudioContent] = useState({
    attachment: false,
    attachted: false,
    file: {},
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModulesVisible, setIsModulesVisible] = useState(false);
  const [multipleModulesVisible, setMultipleModulesVisible] = useState(false);
  const [descriptionText, setDescriptionText] = useState('');
  const [isTimerPause, setIsTimerPause] = useState(false);
  const [correctOptions, setCorrectOptions] = useState([]);
  const [modalType, setModalType] = useState('');
  const [editModuleValues, setEditModuleValues] = useState(null);
  const [editModuleRecordIndex, setEditModuleRecordIndex] = useState(null);
  const [formType, setFormType] = useState(undefined);

  useEffect(() => {
    if (testId) {
      dispatch({ type: 'courses/getTestById', payload: { pathParams: { testId } } }).then((res) => {
        form.setFieldsValue({
          ...res,
          course: res?.course?.courseId,
        });

        setAllModalValues(
          res?.questions?.map((rec) => ({
            ...rec,
            A: {
              option: rec?.option1,

              justification: rec?.answers?.filter((item) => item.value === rec.option1)[0]
                ?.description,
            },
            B: {
              option: rec?.option2,
              justification: rec?.answers?.filter((item) => item.value === rec.option2)[0]
                ?.description,
            },
            C: {
              option: rec?.option3,
              justification: rec?.answers?.filter((item) => item.value === rec.option3)[0]
                ?.description,
            },
            D: {
              option: rec?.option4,
              justification: rec?.answers?.filter((item) => item.value === rec.option4)[0]
                ?.description,
            },
          })),
        );
        setDescriptionText(res?.description);
        setIsTimerPause(res?.isPauseAllowed);
      });
    }
  }, [testId]);

  function onSearch() {
    // console.log('search:', val);
  }
  const testType = [
    {
      id: 'ASSESS_TST',
      value: 'Assessment Test',
    },
    {
      id: 'DAILY_TST',
      value: 'Daily Test',
    },
    {
      id: 'SPECIAL_TST',
      value: 'Special Test',
    },
    {
      id: 'MOCK_TST',
      value: 'Mock Test',
    },
    {
      id: 'FINAL_TST',
      value: 'Final Test',
    },
  ];

  useEffect(() => {
    dispatch({ type: 'courses/getCourses', payload: { query: '' } });
    form.resetFields();
  }, [dispatch]);

  useEffect(() => {
    if (singleCourseDetail?.courseModules?.length > 0) {
      setIsModulesVisible(true);
      form.setFieldsValue({
        multipleModule: singleCourseDetail?.courseModules?.map((item) => item.id),
      });
    } else {
      setIsModulesVisible(false);

      form.setFieldsValue({
        multipleModule: [],
      });
    }
    if (singleCourseDetail?.categoryName) {
      form.setFieldsValue({ courseCategory: singleCourseDetail?.categoryName });
    }
    if (singleCourseDetail?.subCategoryName) {
      form.setFieldsValue({ courseSubCategory: singleCourseDetail?.subCategoryName });
    }
  }, [singleCourseDetail]);

  const editQuestAnsHandler = (recordIndex) => (
    <Button
      type="link"
      onClick={(event) => {
        event.stopPropagation();
        const file = allModalValues.find((item, index) => index === recordIndex)?.content;
        setAudioContent(file);
        setEditModuleValues(allModalValues.filter((item, index) => index === recordIndex));

        setModalType('edit');
        setIsModalVisible(true);
        setEditModuleRecordIndex(recordIndex);
      }}
    >
      <EditOutlined />
    </Button>
  );

  const onTestFinish = (values) => {
    const data = [
      {
        ...values,
        course: {
          productId: values?.course,
        },
        modules: values?.multipleModule?.map((item) => {
          return { productId: item };
        }),
        // resultTypeId: resultType,
        isTimerPauseAllowed: isTimerPause,
        description: descriptionText.replace(/(<([^>]+)>)/gi, ''),
        questions: allModalValues?.map((item) => {
          return {
            ...item,
            contentId: item?.content?.file?.contentId,
            option1: item?.A?.option,
            option2: item?.B?.option,
            option3: item?.C?.option,
            option4: item?.D?.option,
          };
        }),
      },
    ];
    delete data[0].multipleModule;
    data[0]?.questions?.forEach((item) => {
      delete item.content;
      delete item?.A;
      delete item?.B;
      delete item?.C;
      delete item?.D;
      delete item?.answers?.forEach((ans) => delete ans?.option);
    });
    delete data[0].descriptionText;

    const [testData] = data;

    if (testId) {
      dispatch({
        type: 'courses/updateTest',
        payload: {
          body: testData,
          pathParams: { courseId: testId },
        },
      }).then((res) => {
        if (res) {
          message.success('You have updated your test successfully');
          history.push('/test');
        }
      });
      return;
    }
    dispatch({
      type: 'courses/addTest',
      payload: {
        body: data,
      },
    }).then((res) => {
      if (res) {
        form?.resetFields();
        setIsModulesVisible(false);
        message.success('You have added your test successfully');
        history.push('/tests');
      }
    });
  };

  return (
    <div className="container mx-auto">
      <Page
        title="Add test"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All tests',
                path: '/tests',
              },
              {
                name: 'Add test',
                path: '/tests/new',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          onFinish={onTestFinish}
          onValuesChange={(_, allFormValues) => {
            setAllValues({ ...allFormValues });
          }}
        >
          <AddQuestionModal
            setEditModuleValues={setEditModuleValues}
            isModalVisible={isModalVisible}
            setAudioContent={setAudioContent}
            audioContent={audioContent}
            setIsModalVisible={setIsModalVisible}
            setAllModalValues={setAllModalValues}
            allModalValues={allModalValues}
            correctOptions={correctOptions}
            setCorrectOptions={setCorrectOptions}
            modalType={modalType}
            editModuleValues={editModuleValues}
            editModuleRecordIndex={editModuleRecordIndex}
          />
          <Card>
            <h2 className="p-5 text-xl font-semibold text-gray-800">Course details</h2>
            <Divider style={{ marginTop: '0' }} />
            <Card.Section>
              <div className="block px-5 pb-3 mx-auto">
                <div className="mb-4">
                  <div className="flex ">
                    <Checkbox
                      // disabled={formType}
                      onChange={(e) => {
                        setMultipleModulesVisible(e.target.checked);
                        setIsModulesVisible(e.target.checked);
                      }}
                      checked={isModulesVisible}
                    >
                      <p className="mb-1 font-medium text-gray-800">Select modules</p>
                    </Checkbox>
                  </div>
                </div>

                <Row gutter={24}>
                  <Col xl={6} lg={8} md={8} sm={8} xs={24}>
                    <p className="font-medium text-gray-800">Course</p>
                    <Form.Item name="course" rules={[{ required: true, message: 'Course' }]}>
                      <Select
                        // disabled={formType}
                        size="middle"
                        showSearch
                        placeholder="Select"
                        optionFilterProp="children"
                        onChange={(value) => {
                          return dispatch({
                            type: 'courses/getCourseDetails',
                            payload: {
                              pathParams: {
                                courseId: value,
                              },
                            },
                          });
                        }}
                        onSearch={onSearch}
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
                  {singleCourseDetail?.categoryName ? (
                    <Col xl={6} lg={6} md={8} sm={8} xs={24}>
                      <p className="font-medium text-gray-800 ">Category</p>
                      <Form.Item
                        name="courseCategory"
                        // rules={[{ required: true }]}
                        initialValue={singleCourseDetail?.categoryName}
                      >
                        <Input
                          size="middle"
                          placeholder=""
                          disabled={!singleCourseDetail?.categoryName}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {singleCourseDetail?.subCategoryName ? (
                    <Col xl={6} lg={6} md={8} sm={8} xs={24}>
                      <p className="font-medium text-gray-800 ">Subcategory</p>
                      <Form.Item
                        name="courseSubCategory"
                        initialValue={singleCourseDetail?.subCategoryName}
                      >
                        <Input
                          placeholder=""
                          size="middle"
                          disabled={!singleCourseDetail?.subCategoryName}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {/* course module */}
                  <Col xl={6} lg={6} md={8} sm={8} xs={24}>
                    {isModulesVisible && (
                      <>
                        <p className="font-medium text-gray-800 ">Select module</p>
                        <Form.Item name="multipleModule">
                          <Select
                            disabled={formType}
                            mode="multiple"
                            showSearch
                            size="middle"
                            placeholder="Select"
                          >
                            {singleCourseDetail?.courseModules?.map((module) => (
                              <Option key={module?.id} value={module?.id}>
                                {module?.displayName || ''}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </>
                    )}
                  </Col>
                </Row>
              </div>
            </Card.Section>
          </Card>

          <Card>
            <div className="flex justify-between p-5">
              <h2 className="text-xl font-semibold text-gray-800">Test details</h2>
            </div>
            <Divider style={{ marginTop: '0' }} />
            <Card.Section>
              <div className="block px-5 pb-3 mx-auto">
                <div className="flex flex-wrap justify-between mb-4">
                  <div>
                    <p className="mb-1 font-medium text-gray-800 capitalize">name</p>
                    <Form.Item name="name" rules={[{ required: true, message: 'Test name' }]}>
                      <Input
                        // disabled={formType}
                        size="middle"
                        style={{ width: '8rem' }}
                        placeholder="Enter test name"
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-800 capitalize">type</p>
                    <Form.Item name="testTypeId" rules={[{ required: true, message: 'Test Type' }]}>
                      <Select
                        // disabled={formType}
                        size="middle"
                        getPopupContainer={(node) => node.parentNode}
                        style={{ width: '8rem' }}
                        showSearch
                        placeholder="Select"
                        onChange={(value) => form.setFieldsValue({ marksRange: [undefined] })}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {testType?.map((item) => {
                          return (
                            <Option value={item.id} key={item.id}>
                              {item.value}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-800">Difficulty level</p>
                    <Form.Item
                      noStyle
                      initialValue="EASY"
                      name="difficultyLevelId"
                      rules={[{ required: true }]}
                    >
                      <Radio.Group
                        disabled={formType}
                        style={{ maxWidth: '16rem' }}
                        size="middle"
                        // defaultValue="EASY"
                        buttonStyle="solid"
                        rules={[{ required: true, message: 'Please select difficulty level' }]}
                      >
                        {/* {!formType && (
                          <> */}
                        <Radio.Button value="EASY">Easy </Radio.Button>
                        <Radio.Button value="INTERMEDIATE">Intermediate</Radio.Button>
                        <Radio.Button value="HARD">Hard</Radio.Button>{' '}
                        {/* </>
                        )} */}
                        {/* {formType && (
                          <Radio.Button value={testRecord?.difficultyLevelId}>
                            {testRecord?.difficultyLevel}
                          </Radio.Button>
                        )} */}
                      </Radio.Group>
                    </Form.Item>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-800 capitalize">time</p>
                    <Form.Item
                      style={{ display: 'inline-block' }}
                      name="testTime"
                      rules={[{ required: true, message: 'Time' }]}
                    >
                      <Input
                        // disabled={formType}
                        size="middle"
                        style={{ width: '5rem' }}
                        placeholder="Time"
                        min={0}
                        type="number"
                      />
                    </Form.Item>
                    <Form.Item noStyle name="testTimeUomId" initialValue="TF_hr">
                      <Select
                        // disabled={formType}
                        style={{ width: '6rem' }}
                        size="middle"
                        getPopupContainer={(node) => node.parentNode}
                      >
                        <Option value="TF_hr">Hours</Option>
                        <Option value="TF_min">Minutes</Option>
                      </Select>
                    </Form.Item>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-800">Total marks</p>
                    <Form.Item
                      name="totalMarks"
                      rules={[{ required: true, message: 'Total marks' }]}
                      initialValue={''}
                    >
                      <Input
                        // disabled={formType}
                        size="middle"
                        style={{ width: '7rem' }}
                        placeholder="Total marks"
                        type="number"
                        min="0"
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="mb-1 font-medium text-gray-800">Passing marks</p>
                    <Form.Item
                      name="passingMarks"
                      rules={[{ required: true, message: 'Passing marks' }]}
                    >
                      <Input
                        // disabled={formType}
                        size="middle"
                        style={{ width: '7rem' }}
                        placeholder="Enter marks"
                        type="number"
                        min="0"
                      />
                    </Form.Item>
                  </div>

                  <div>
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        // disabled={formType}
                        onChange={(e) => {
                          setIsTimerPause(e.target.checked);
                        }}
                        checked={isTimerPause}
                      >
                        <p className="mb-1 font-medium text-gray-800">Is timer pause allowed</p>
                      </Checkbox>
                    </div>
                  </div>
                </div>

                {/* text rich editor start  */}
                <Row gutter={24}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <p className="mb-1 font-medium text-gray-800">
                      Description &#x00028;optional&#x00029;
                    </p>
                    <div>
                      <Form.Item name="descriptionText">
                        <CKEditor
                          style={{ border: 2 }}
                          onInit={(editor) => {
                            editor.ui
                              .getEditableElement()
                              .parentElement.insertBefore(
                                editor.ui.view.toolbar.element,
                                editor.ui.getEditableElement(),
                              );
                          }}
                          onChange={(event, editor) => {
                            const editorData = editor.getData();
                            setDescriptionText(editorData);
                          }}
                          editor={DecoupledEditor}
                          data={descriptionText || ''}
                          config={
                            CKEditorConfig.editor &&
                            CKEditorConfig.editor.toolbarType &&
                            CKEditorConfig.editor.toolbarType.email
                          }
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className="flex justify-end pb-8">
                      <Button
                        // disabled={formType}
                        icon={<PlusOutlined />}
                        type="primary"
                        size="middle"
                        onClick={() => {
                          setModalType('add');
                          setIsModalVisible(!isModalVisible);
                        }}
                      >
                        Add questions
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Section>
          </Card>

          {allModalValues?.length > 0 && (
            <>
              <Card>
                <h2 className="p-5 text-xl font-semibold text-gray-800">Questions and answers</h2>
                <Divider style={{ marginTop: '0' }} />
                <Card.Section>
                  <div style={{ padding: '20px' }}>
                    {allModalValues?.length >= 1 ? (
                      <Collapse className="p-5 mb-5">
                        {allModalValues.map((item, index) => {
                          const key = `${item?.categoryId + (index + 1)}`;

                          return (
                            <Panel
                              header={`${index + 1} : ${item?.name}`}
                              key={key}
                              extra={editQuestAnsHandler(index)}
                            >
                              <p className="mb-2 font-semibold">
                                Answer:
                                {item?.answers?.map((answer, i, arr) => (
                                  <span key="" className="font-semibold">
                                    {` ${answer?.value}${i < arr.length - 1 ? ',' : ''}`}
                                  </span>
                                ))}
                              </p>

                              <div className="flex flex-wrap justify-between wrap">
                                <div>
                                  <p className="font-semibold">
                                    Option A: <span> {item?.A?.option}</span>
                                  </p>
                                  {item?.A?.justification && (
                                    <p className="mb-2 font-semibold">
                                      Justification: <span>{item?.A?.justification}</span>
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    Option B: <span> {item?.B?.option}</span>
                                  </p>
                                  {item?.B?.justification && (
                                    <p className="mb-2 font-semibold">
                                      Justification: <span>{item?.B?.justification}</span>
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    Option C: <span> {item?.C?.option}</span>
                                  </p>
                                  {item?.C?.justification && (
                                    <p className="mb-2 font-semibold">
                                      Justification: <span>{item?.C?.justification}</span>
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">
                                    Option D: <span> {item?.D?.option}</span>
                                  </p>
                                  {item?.D?.justification && (
                                    <p className="mb-2 font-semibold">
                                      Justification: <span>{item?.D?.justification}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              {item?.content?.file?.url && (
                                <div className=" border-t pt-3 mt-3">
                                  <h1 className="text-blue-600 font-medium mt-5 flex items-center ">
                                    <Attachment />
                                    <span className="pl-2">Attached audio</span>
                                  </h1>
                                  <audio controls src={item?.content?.url}>
                                    Your browser does not support the audio element.
                                  </audio>
                                </div>
                              )}
                            </Panel>
                          );
                        })}
                      </Collapse>
                    ) : null}
                  </div>
                </Card.Section>
              </Card>
            </>
          )}

          <Card>
            <h2 className="p-5 text-xl font-semibold text-gray-800">Result details</h2>
            <Divider style={{ marginTop: '0' }} />
            <Card.Section>
              <Row gutter={24}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                  <div className="flex-col justify-between py-4">
                    <Form.Item name="resultTypeId" initialValue="BAND_WISE">
                      <Radio.Group>
                        <Radio value={'BAND_WISE'}>Band wise</Radio>
                        <Radio value={'MARKS_WISE'}>Marks wise</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <p className="mt-4 font-medium text-gray-800">Remarks (Optional)</p>
                    <Form.Item name="resultRemarks" className="mb-8">
                      <TextArea
                        placeholder="Enter remarks here"
                        style={{ marginTop: '10px' }}
                        rows={4}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              {allValues?.testTypeId === 'ASSESS_TST' && (
                <div className="py-4 ">
                  <p className="mb-2 font-medium text-gray-800">Add suggestions</p>
                  <Form.List name="marksRange">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <>
                            <Row key={key} gutter={12}>
                              <Col lg={12} md={12} sm={12} xs={12} className="">
                                <div className="flex space-x-3">
                                  <Form.Item
                                    {...restField}
                                    label={<p>Marks</p>}
                                    name={[name, 'minMarks']}
                                    rules={[{ required: true, message: 'Enter minimum marks!' }]}
                                  >
                                    <Input
                                      size="middle"
                                      placeholder="Minimum"
                                      min="0"
                                      type="number"
                                      style={{ width: 250 }}
                                    />
                                  </Form.Item>

                                  <div className="w-8 h-8 flex items-center justify-center bg-gray-100 font-bold p-4 rounded">
                                    to
                                  </div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'maxMarks']}
                                    rules={[{ required: true, message: 'Enter maximum marks!' }]}
                                  >
                                    <Input
                                      size="middle"
                                      placeholder="Maximum"
                                      min="0"
                                      type="number"
                                      style={{ width: 250 }}
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              <Col lg={12} md={12} sm={12} xs={12}>
                                <div className="flex items-center w-full">
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'remarks']}
                                    label={<p>Remarks (Optional)</p>}
                                  >
                                    <TextArea
                                      size="middle"
                                      placeholder="Enter a remark here"
                                      style={{ width: 500 }}
                                      row={4}
                                    />
                                  </Form.Item>

                                  {fields?.length > 1 && (
                                    <Button
                                      type="link"
                                      disabled={formType}
                                      onClick={() => remove(name)}
                                      className="mb-2"
                                    >
                                      <Trash className=" text-red-700 " />
                                    </Button>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </>
                        ))}

                        <Form.Item>
                          <Button
                            // disabled={formType}
                            type="dashed"
                            onClick={() => add()}
                            block
                            icon={<PlusOutlined />}
                          >
                            Add another row
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
              )}
            </Card.Section>
          </Card>
          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '95rem',
              }}
            >
              <div className="w-full cursor-pointer">
                <Button type="primary" htmlType="submit" size="middle">
                  {testId ? 'Update' : 'Add Test'}
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Form>
      </Page>
    </div>
  );
};

export default connect(({ courses }) => ({
  allCourses: courses.allCourses,
  singleCourseDetail: courses.singleCourseDetail,
  testRecord: courses.testRecordById,
}))(AddTest);
