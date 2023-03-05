import React from 'react';
import { Form, Row, Col, Input, Button, Popconfirm, Divider } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PhoneNumber from '@/components/PhoneNumber';

const Step3StudentReferences = ({
  onNextClick,
  studentReferencesForm,
  currentStepForStudent,
  className,
}) => {
  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={studentReferencesForm}
        onFinish={() => {
          onNextClick();
        }}
        name="stdReferencesForm"
      >
        <h2 className="p-5 text-base font-semibold text-gray-800">Student references</h2>
        <Divider style={{ margin: '0' }} />
        <div className="mt-4 px-4">
          <Form.List name="References">
            {(fields, { add, remove }) => (
              <>
                {fields?.map(({ key, name, fieldKey, ...restField }) => (
                  <>
                    {name > 0 && <Divider />}
                    <Row gutter={16} key={key}>
                      <Col lg={8} xl={8} md={24} sm={24} xs={24}>
                        <p className="font-medium text-gray-800">Relation</p>
                        <Form.Item {...restField} name={[name, 'relation']}>
                          <Input
                            autoComplete="off"
                            placeholder="Enter relation with the person"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                        <p className="font-medium text-gray-800">Name</p>
                        <Form.Item
                          rules={[
                            {
                              pattern: /^[a-zA-Z ]*$/,
                              message: 'Please enter text only',
                            },
                          ]}
                          {...restField}
                          name={[name, 'firstName']}
                        >
                          <Input
                            autoComplete="off"
                            placeholder="Enter name of the person"
                            size="large"
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={7} xl={7} md={24} sm={24} xs={24}>
                        <p className="font-medium text-gray-800">Phone</p>
                        <PhoneNumber
                          {...restField}
                          rules={[
                            {
                              message: 'Please enter valid phone number',
                              min: 10,
                              len: 10,
                            },
                          ]}
                          countryCode={[name, 'phone', 'countryCode']}
                          form={studentReferencesForm}
                          name={[name, 'phone', 'phone']}
                          placeholder="#####-#####"
                          formType={studentReferencesForm && 'studentReferencesForm'}
                        />
                      </Col>
                      <Col
                        style={{
                          padding: '0',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        lg={2}
                        xl={2}
                        md={2}
                        sm={3}
                        xs={3}
                      >
                        <Popconfirm
                          title="Are you sure that you want to delete?"
                          okButtonProps={{ onClick: () => remove(name) }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteOutlined
                            style={{ fontSize: '1rem', color: 'rgba(220, 38, 38)' }}
                          />
                        </Popconfirm>
                      </Col>
                    </Row>
                  </>
                ))}

                <Form.Item>
                  <Button
                    style={{ marginBottom: '1.5rem' }}
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add another field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </div>
      </Form>
    </div>
  );
};

export default Step3StudentReferences;
