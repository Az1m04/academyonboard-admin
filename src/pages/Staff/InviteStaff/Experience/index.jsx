import { Input, Row, Col, Form, DatePicker } from 'antd';
import { currencyFormatter, currencyParser } from '@/utils/utils';
import React from 'react';
import { Button } from 'antd-mobile';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const Experience = ({ form }) => {
  return (
    <div>
      <Form.List name="experiences">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <div key={key}>
                <div className="flex px-5 py-2 mb-2 border-b bg-gray-100 justify-between">
                  <div className="font-semibold">Experience {index + 1}</div>

                  {fields?.length > 1 && (
                    <div>
                      <span
                        className="text-red-600 cursor-pointer"
                        onClick={() => {
                          remove(name);
                        }}
                      >
                        Remove experience
                      </span>
                    </div>
                  )}
                </div>
                <Row className="px-5" gutter={16}>
                  <Col xs={24} sm={18} md={12} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">From</p>
                    <Form.Item {...restField} name={[name, 'fromDate']}>
                      <DatePicker
                        format={'YYYY/MM'}
                        picker="month"
                        size="large"
                        disabledDate={(current) => current && current.valueOf() > moment()}
                        getPopupContainer={(node) => node.parentNode}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={3} xl={3}>
                    <p className="font-medium text-gray-800">To</p>
                    <Form.Item name={[name, 'thruDate']}>
                      <DatePicker
                        format={'YYYY/MM'}
                        picker="month"
                        size="large"
                        getPopupContainer={(node) => node.parentNode}
                        disabledDate={(current) => current && current.valueOf() > moment()}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Company name</p>
                    <Form.Item name={[name, 'companyName']}>
                      <Input size="large" placeholder="Enter your company name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Location</p>
                    <Form.Item name={[name, 'location']}>
                      <Input size="large" placeholder="Enter your location" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Starting designation</p>
                    <Form.Item name={[name, 'startDesignation']}>
                      <Input size="large" placeholder="Enter your start designation" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Last designation</p>
                    <Form.Item name={[name, 'lastDesignation']}>
                      <Input size="large" placeholder="Enter your last designation" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={18} md={12} lg={6} xl={6}>
                    <p className="font-medium text-gray-800">Last salary</p>
                    <Form.Item name={[name, 'salary']}>
                      <Input
                        size="large"
                        placeholder="₹0.00"
                        autoComplete="off"
                        className="text-right"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter salary',
                          },
                        ]}
                        onBlur={(event) => {
                          let i = 0;
                          let res = event.target.value
                            // replace the dots with empty string if value contains more than one dot
                            // leave first decimal
                            .replace(/\./g, () => {
                              i += 1;
                              return i >= 2 ? '' : '.';
                            })
                            // replace the commas too with empty string if have any
                            .replace(/,/g, '');
                          let mod;
                          if (res) {
                            res = res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                            mod = Number(res).toFixed(2);
                          } else {
                            mod = event.target.value;
                          }

                          const experiences = form.getFieldValue('experiences');
                          experiences[index] = {
                            ...experiences[index],
                            salary: currencyFormatter.format(currencyParser(mod)),
                          };
                          form.setFieldsValue({
                            experiences,
                          });
                        }}
                      />
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
                  Add experience
                </Button>{' '}
              </Form.Item>
            </div>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default Experience;
