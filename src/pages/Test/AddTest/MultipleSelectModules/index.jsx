/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Collapse, Radio, Select, Divider, Input, Switch, Button } from 'antd';
import Card from '@/components/Structure/Card';
import CKEditor from '@ckeditor/ckeditor5-react';
import CKEditorConfig from '@/config/appConfig';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
import { add } from 'lodash';
import { connect } from 'umi';

const MultipleSelectModules = ({
  questionsAnswers,
  singleCourseDetail,
  AddQuestionModalVisible,
  dispatch,
  getModuleName,
}) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const { Panel } = Collapse;
  const [showModules, setShowModules] = useState(true);
  const [showSelectedModules, setShowSelectedModules] = useState(false);
  const [moduleName, setModuleName] = useState(null);
  const { isModalVisible, setIsModalVisible } = AddQuestionModalVisible;
  const [body, setBody] = useState('');
  function onChange(value) {
    // console.log(`selected ${value}`);
  }

  function onSearch(val) {
    // console.log('search:', val);
  }
  const testType = ['Assessment Test', 'Daily Test', 'Special Test', 'Mock Test', 'Final Test'];
  const marks = ['90%', '70%', '40%'];
  const questions = [];
  useEffect(() => {
    if (singleCourseDetail?.courseModules?.length >= 1) {
      form.setFieldsValue({
        modules: singleCourseDetail?.courseModules,
      });
    }
  }, [singleCourseDetail, questionsAnswers]);

  return (
    <>
      {/* Selected modules show  */}
      {showModules ? (
        <Card>
          <div className="flex p-5 justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Selected Modules</h2>
            <Switch
              type="primary"
              size="large"
              onChange={() => {
                setShowSelectedModules(!showSelectedModules);
              }}
            ></Switch>
          </div>
          <Divider style={{ marginTop: '0' }} />
          {showSelectedModules ? (
            <Card.Section>
              <Form form={form} onClick={add()} hideRequiredMark>
                <div className="block mx-auto px-5 pb-3">
                  <Row gutter={24}>
                    <Col xl={4} lg={4} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Test Name</p>
                      <Form.Item valuePropName="" name="testName" rules={[{ required: false }]}>
                        <Input placeholder="Enter Test Name" />
                      </Form.Item>
                    </Col>

                    <Col xl={4} lg={4} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Test Type</p>
                      <Form.Item name="testType" rules={[{ required: false }]} initialValue={false}>
                        <Select
                          showSearch
                          //   style={{ width: 200 }}
                          placeholder="Select"
                          optionFilterProp="children"
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {testType.map((item) => {
                            return (
                              <Option value={item} key={item}>
                                {item}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={5} lg={8} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Difficulty Level</p>
                      <Form.Item valuePropName="" name="difficultyLevel" required={false}>
                        <Radio.Group defaultValue="a" buttonStyle="solid">
                          <Radio.Button value="a">Easy </Radio.Button>
                          <Radio.Button value="b">Intermediate</Radio.Button>
                          <Radio.Button value="c">Hard</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col xl={5} lg={4} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Time Of Test</p>
                      <Form.Item
                        valuePropName=""
                        name="timeOfTest"
                        rules={[{ required: false }]}
                        initialValue={false}
                      >
                        <Input placeholder="Enter Time Of Test" />
                      </Form.Item>
                    </Col>
                    <Col xl={4} lg={4} md={24} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Total Marks</p>
                      <Form.Item
                        valuePropName=""
                        name="editMarks"
                        rules={[{ required: false }]}
                        initialValue={false}
                      >
                        <Select
                          showSearch
                          //   style={{ width: 200 }}
                          placeholder="Select marks"
                          optionFilterProp="children"
                          onChange={onChange}
                          onSearch={onSearch}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {marks.map((item) => {
                            return (
                              <Option value={item} key={item}>
                                {item}
                              </Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* text rich editor start  */}
                  <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 mb-1">Test Description</p>
                      <Form.Item name={'description'}>
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
                            setBody(editorData);
                            // console.log('fhdfdaslj');
                          }}
                          editor={DecoupledEditor}
                          data={body || ''}
                          config={
                            CKEditorConfig.editor &&
                            CKEditorConfig.editor.toolbarType &&
                            CKEditorConfig.editor.toolbarType.email
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Row gutter={24}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className="flex justify-between px-5 pb-8">
                      <div></div>
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        size="large"
                        onClick={() => setIsModalVisible(!isModalVisible)}
                      >
                        Add Questions
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className="block mx-auto px-5 pb-5">
                      {questionsAnswers?.length >= 1 ? (
                        <Collapse defaultActiveKey={['1']}>
                          {questionsAnswers.map((item, index) => {
                            return (
                              <Panel header={`${index + 1} : ${item?.questions}`} key="">
                                <p className="mb-2">
                                  <span className="font-semibold">Answer: </span> {item?.answers}
                                </p>
                                <p className="mb-2">
                                  <span className="font-semibold">Justification: </span>{' '}
                                  {item?.justification}
                                </p>
                                <div className="flex wrap justify-between flex-wrap">
                                  <p>
                                    <span className="font-semibold">Option A: </span>{' '}
                                    {item?.optionA}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Option B: </span>{' '}
                                    {item?.optionB}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Option C: </span>{' '}
                                    {item?.optionC}
                                  </p>
                                  <p>
                                    <span className="font-semibold">Option D: </span>{' '}
                                    {item?.optionC}
                                  </p>
                                </div>
                              </Panel>
                            );
                          })}
                        </Collapse>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Divider style={{ marginTop: '0' }} />

                {/* })}
                    </>
                  )}
                </Form.List> */}
              </Form>
            </Card.Section>
          ) : null}
        </Card>
      ) : null}
      {/* Selected modules show  */}
    </>
  );
};

export default connect(({ courses }) => ({
  allCourses: courses.allCourses,
  singleCourseDetail: courses.singleCourseDetail,
}))(MultipleSelectModules);
