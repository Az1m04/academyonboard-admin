import { PlusOutlined } from '@ant-design/icons';
import { Select, Form, Row, Col, Radio, Input, DatePicker, Button } from 'antd';
import React from 'react';

const { Option } = Select;

const OtherQualification = ({ form }) => {
  return (
    <div>
      <Row className="px-5">
        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
          <Form.Item name={['certifications', 'qualificationName']}>
            <Radio.Group
              onChange={() =>
                form.setFieldsValue({ certifications: { qualificationTypeId: undefined } })
              }
            >
              <Radio value="englishExam">English exam</Radio>
              <Radio value="otherQualification">Other</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: '1rem' }}>
        {form.getFieldsValue()?.certifications?.qualificationName === 'englishExam' && (
          <Col xs={12} sm={12} md={6} lg={6} xl={6} className="px-5">
            <p className="font-medium text-gray-800">English exams</p>
            <Form.Item
              name={['certifications', 'qualificationTypeId']}
              rules={[
                {
                  required: true,
                  message: 'Please select exam',
                },
              ]}
            >
              <Select
                size="large"
                placeholder="select exam"
                getPopupContainer={(node) => node.parentNode}
              >
                <Option value="ielts">IELTS</Option>
                <Option value="pte">PTE</Option>
                <Option value="gre">GRE</Option>
                <Option value="toefl">TOEFL</Option>
                <Option value="gmat">GMAT</Option>
              </Select>
            </Form.Item>
          </Col>
        )}
        {form.getFieldsValue()?.certifications?.qualificationName === 'otherQualification' && (
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form.List name="otherQualifications">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                    <div className="" key={key}>
                      <div className="flex px-5 py-2 mb-2 border-b bg-gray-100 justify-between">
                        <div className="font-semibold">Qualification {index + 1}</div>

                        {fields?.length > 1 && (
                          <div>
                            <span
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                remove(name);
                              }}
                            >
                              Remove qualification
                            </span>
                          </div>
                        )}
                      </div>
                      <Row gutter={16} key={key} className="px-5">
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <p className="font-medium text-gray-800">Name of qualification</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'qualificationTypeId']}
                            rules={[{ required: true, message: 'Please enter qualification' }]}
                          >
                            <Input size="large" placeholder="Enter qualification" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <p className="font-medium text-gray-800">Year of passing</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'fromDate']}
                            rules={[
                              {
                                required: true,
                                message: 'Please enter year of passing',
                              },
                            ]}
                          >
                            <DatePicker size="large" picker="year" style={{ width: '100%' }} />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <p className="font-medium text-gray-800">Percentage (%age) / CGPA</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'percentage']}
                            rules={[{ required: true, message: 'Please enter marks' }]}
                          >
                            <Input size="large" type="number" placeholder="Enter marks" />
                          </Form.Item>
                        </Col>
                        <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                          <p className="font-medium text-gray-800">Status</p>
                          <Form.Item
                            {...restField}
                            name={[name, 'statusId']}
                            rules={[{ required: true, message: 'Please enter status' }]}
                          >
                            <Select
                              size="large"
                              placeholder="select exam"
                              getPopupContainer={(node) => node.parentNode}
                            >
                              <Option value="STD_COMPLETED">Study Completed</Option>
                              <Option value="STD_ONGOING">Study Ongoing</Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  ))}
                  <div className="px-5">
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        size="small"
                        icon={<PlusOutlined />}
                        style={{ marginBottom: '25px', marginTop: '6px' }}
                      >
                        Add qualification
                      </Button>{' '}
                    </Form.Item>
                  </div>
                </>
              )}
            </Form.List>
          </Col>
        )}
      </Row>
      {form.getFieldsValue()?.certifications?.qualificationTypeId &&
        form.getFieldsValue()?.certifications?.qualificationName === 'englishExam' && (
          <Row gutter={16} className="px-5">
            <Col xs={6} sm={6} md={3} lg={3} xl={3}>
              <p className="font-medium text-gray-800">Test date</p>
              <Form.Item
                name={['certifications', 'fromDate']}
                rules={[
                  {
                    required: true,
                    message: 'Please select test date',
                  },
                ]}
              >
                <DatePicker format="YYYY/MM/DD" size="large" />
              </Form.Item>
            </Col>
            {form.getFieldsValue()?.certifications?.qualificationTypeId !== 'gmat' &&
              form.getFieldsValue()?.certifications?.qualificationTypeId !== 'gre' && (
                <>
                  <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">Overall score</p>
                    <Form.Item
                      name={['certifications', 'examScore', 'overallScore']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter overall marks',
                        },
                      ]}
                    >
                      <Input size="large" type="number" placeholder="Enter marks" />
                    </Form.Item>
                  </Col>
                  <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">Listening</p>
                    <Form.Item
                      name={['certifications', 'examScore', 'listening']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter listening marks',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter score " />
                    </Form.Item>
                  </Col>
                  <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">Reading</p>
                    <Form.Item
                      name={['certifications', 'examScore', 'reading']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter reading marks',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter score " />
                    </Form.Item>
                  </Col>
                  <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">Writing</p>
                    <Form.Item
                      name={['certifications', 'examScore', 'writing']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter writing marks',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter score " />
                    </Form.Item>
                  </Col>
                  <Col xs={6} sm={6} md={3} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">Speaking</p>
                    <Form.Item
                      name={['certifications', 'examScore', 'speaking']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter speaking marks',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter score " />
                    </Form.Item>
                  </Col>
                </>
              )}
            {(form.getFieldsValue()?.certifications?.qualificationTypeId === 'gre' ||
              form.getFieldsValue()?.certifications?.qualificationTypeId === 'gmat') && (
              <>
                <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                  <p className="font-medium text-gray-800">Verbal</p>
                  <Form.Item
                    name={['certifications', 'examScore', 'verbal']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter verbal marks',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter score " />
                  </Form.Item>
                </Col>
                <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                  <p className="font-medium text-gray-800">Quantitative</p>
                  <Form.Item
                    name={['certifications', 'examScore', 'reasoning']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter quantitative marks',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter score" />
                  </Form.Item>
                </Col>
                <Col xs={8} sm={8} md={4} lg={4} xl={4}>
                  <p className="font-medium text-gray-800">Analytical</p>
                  <Form.Item
                    name={['certifications', 'examScore', 'analytical']}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter analytical marks',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter score" />
                  </Form.Item>
                </Col>
              </>
            )}
          </Row>
        )}
    </div>
  );
};

export default OtherQualification;
