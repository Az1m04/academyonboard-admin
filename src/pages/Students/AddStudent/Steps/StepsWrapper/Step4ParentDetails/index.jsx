import React from 'react';
import { Form, Row, Col, Input, Button, Popconfirm, Select, Divider, AutoComplete } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PhoneNumber from '@/components/PhoneNumber';
import { currencyFormatter, currencyParser } from '@/utils/utils';
import EmergencyStudentContact from '../../../EmergencyStudentContact';
import Card from '@/components/Structure/Card';
import { connect } from 'umi';

const parentList = [
  {
    id: 'father',
    name: 'Father',
  },
  {
    id: 'mother',
    name: 'Mother',
  },
  {
    id: 'brother',
    name: 'Brother',
  },
  {
    id: 'sister',
    name: 'Sister',
  },
  {
    id: 'uncle',
    name: 'Uncle',
  },
  {
    id: 'aunt',
    name: 'Aunt',
  },
  {
    id: 'others',
    name: 'Others',
  },
];
const Step4ParentDetails = ({
  onNextClick,
  parentDetailsForm,
  currentStepForStudent,
  className,
  studentsParentOccupationList,
}) => {
  const { Option } = Select;

  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={parentDetailsForm}
        onFinish={() => {
          onNextClick();
        }}
        name="parentsForm"
      >
        <div className="">
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800">Parent details</h2>
            <Divider style={{ margin: '0' }} />
            <div className="mt-4 px-4">
              <Form.List name="ParentDetails">
                {(fields, { add, remove }) => (
                  <>
                    {fields?.map(({ key, name, fieldKey, ...restField }) => (
                      <>
                        {name > 0 && <Divider />}
                        <Row gutter={12} key={key}>
                          <Col lg={22} xl={22} md={24} sm={24} xs={24}>
                            <Row gutter={12}>
                              <Col lg={6} xl={6} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Relation</p>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'relation']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please select relation first',
                                    },
                                  ]}
                                >
                                  <Select
                                    size="large"
                                    getPopupContainer={(node) => node.parentNode}
                                    placeholder="Select a parent"
                                    optionFilterProp="children"
                                  >
                                    {parentList?.map((item) => (
                                      <Option value={item?.id} key={item?.id}>
                                        {item?.name}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col lg={9} xl={9} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Name</p>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'firstName']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter your parent's name first",
                                    },
                                    {
                                      pattern: /^[a-zA-Z ]*$/,
                                      message: 'Please enter text only',
                                    },
                                  ]}
                                >
                                  <Input
                                    autoComplete="off"
                                    placeholder="Enter your parent name"
                                    size="large"
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={9} xl={9} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Phone</p>
                                <PhoneNumber
                                  {...restField}
                                  countryCode={[name, 'phone', 'countryCode']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Phone number can't be blank",
                                      min: 10,
                                      len: 10,
                                    },
                                  ]}
                                  form={parentDetailsForm}
                                  name={[name, 'phone', 'phone']}
                                  placeholder="#####-#####"
                                  formType={parentDetailsForm && 'parentDetailsForm'}
                                />
                              </Col>
                            </Row>
                            <Row gutter={12}>
                              <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Email</p>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'primaryEmail']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please enter a valid email!',
                                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    },
                                  ]}
                                >
                                  <Input
                                    autocomplete="off"
                                    size="large"
                                    placeholder="john.doe@domain.com"
                                  />
                                </Form.Item>
                              </Col>
                              <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Occupation</p>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'occupation']}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Please enter parent occupation first',
                                    },
                                  ]}
                                >
                                  <AutoComplete
                                    size="large"
                                    options={studentsParentOccupationList?.occupations?.map(
                                      (val) => ({
                                        label: val,
                                        value: val,
                                      }),
                                    )}
                                  >
                                    <Input
                                      size="large"
                                      placeholder="Enter parent's occupation here"
                                    />
                                  </AutoComplete>
                                </Form.Item>
                              </Col>
                              <Col lg={8} xl={8} md={12} sm={24} xs={24}>
                                <p className="font-medium text-gray-800 ">Income</p>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'income']}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please enter parent's income first",
                                    },
                                  ]}
                                >
                                  <Input
                                    size="large"
                                    onFocus={(e) => e.target.select()}
                                    placeholder="₹0.00"
                                    autoComplete="off"
                                    className="text-right"
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
                                        res =
                                          res[0] === '₹'
                                            ? res.substring(1, res.length).trim()
                                            : res;
                                        mod = Number(res).toFixed(2);
                                      } else {
                                        mod = event.target.value;
                                      }

                                      const ParentDetails = parentDetailsForm.getFieldValue(
                                        'ParentDetails',
                                      );
                                      ParentDetails[name] = {
                                        ...ParentDetails[name],
                                        income: currencyFormatter.format(currencyParser(mod)),
                                      };
                                      parentDetailsForm.setFieldsValue({
                                        ParentDetails,
                                      });
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          {fields?.length > 1 && (
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
                                title="Are you sure you want to delete?"
                                okButtonProps={{
                                  onClick: () => {
                                    remove(name);
                                  },
                                }}
                                okText="Yes"
                                cancelText="No"
                              >
                                <DeleteOutlined
                                  style={{ fontSize: '1rem', color: 'rgba(220, 38, 38)' }}
                                />
                              </Popconfirm>
                            </Col>
                          )}
                        </Row>
                      </>
                    ))}

                    <Form.Item>
                      <Button
                        style={{ marginBottom: '1.5rem' }}
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
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
          </Card>
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800">Emergency contact</h2>
            <Divider style={{ margin: '0' }} />
            <EmergencyStudentContact form={parentDetailsForm} parentList={parentList} />
          </Card>
        </div>
      </Form>
    </div>
  );
};

export default connect(({ student }) => ({
  studentsParentOccupationList: student?.studentsParentOccupationList,
}))(Step4ParentDetails);
