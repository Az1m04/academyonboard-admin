import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Form, Input, DatePicker, Button, Select, Divider, InputNumber } from 'antd';

const Qualification = () => {
  const { Option } = Select;

  return (
    <div className="">
      <Form.List name="qualifications">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <>
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
                </div>{' '}
                <Row gutter={16} className="px-5">
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Qualification</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'qualificationTypeId']}
                      rules={[
                        {
                          whitespace: true,
                          message: 'Please enter qualification',
                        },
                        {
                          required: true,
                          message: 'Please enter qualification',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter qualification" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Stream</p>
                    <Form.Item {...restField} name={[name, 'description']}>
                      <Input size="large" placeholder="Enter stream" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Board/University</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter board/university',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter board/university" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
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
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Percentage (%age) / CGPA</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'percentage']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter marks',
                        },
                      ]}
                    >
                      <InputNumber
                        size="large"
                        min={1}
                        style={{ width: '100%' }}
                        placeholder="Enter marks"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Status</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'statusId']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter status',
                        },
                      ]}
                    >
                      <Select
                        size="large"
                        placeholder="Select status"
                        getPopupContainer={(node) => node.parentNode}
                      >
                        <Option value="STD_COMPLETED">Study Completed</Option>
                        <Option value="STD_ONGOING">Study Ongoing</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {fields.length > 1 && <Divider />}
              </>
            ))}

            <div className="px-5">
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ marginBottom: '25px', marginTop: '6px' }}
                >
                  Add field
                </Button>
              </Form.Item>
            </div>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default Qualification;
