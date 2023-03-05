import React from 'react';
import { Form, Row, Col, Input, Button, Popconfirm, Select, Divider, AutoComplete } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import PhoneNumber from '@/components/PhoneNumber';
import { connect } from 'umi';
import { currencyParser } from '@/utils/utils';
import { currencyFormatter } from '@/utils/common';

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
];
const StudentParentsDetails = ({ form, studentsParentOccupationList, setCode, code }) => {
  const { Option } = Select;

  return (
    <div className=" overflow-y-auto" style={{ maxHeight: '450px' }}>
      <div className="mt-4 px-4 ">
        <Form.List name="parentDetails">
          {(fields, { add, remove }) => (
            <>
              {fields?.map(({ key, name, fieldKey, ...restField }) => (
                <>
                  {name > 0 && <Divider />}
                  <Row gutter={12} key={key}>
                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                      <div className="flex justify-between w-full border-b-2 mb-2 pb-2 ">
                        <div className="font-semibold text-xl">{`  Parent ${name + 1}`}</div>
                        <div>
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
                        </div>
                      </div>
                    </Col>
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 ">Relation</p>
                      <Form.Item
                        name={[name, 'relation']}
                        rules={[
                          {
                            required: true,
                            message: 'Please select relation first',
                          },
                        ]}
                      >
                        <Select
                          size="medium"
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
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 ">Name</p>
                      <Form.Item
                        name={[name, 'firstName']}
                        rules={[
                          {
                            required: true,
                            message: "Please enter your parent's name first",
                          },
                        ]}
                      >
                        <Input
                          autoComplete="off"
                          placeholder="Enter your parent name"
                          size="medium"
                        />
                      </Form.Item>
                    </Col>
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 ">Phone</p>
                      <PhoneNumber
                        typeEdit={true}
                        setCode={setCode}
                        code={code}
                        countryCode={[name, 'primaryPhone', 'countryCode']}
                        form={form}
                        name={[name, 'primaryPhone', 'phoneFormatted']}
                        placeholder="#####-#####"
                      />
                    </Col>

                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 ">Email</p>
                      <Form.Item
                        name={[name, 'primaryEmail']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a valid email!',
                            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          },
                        ]}
                      >
                        <Input autocomplete="off" size="medium" placeholder="john.doe@domain.com" />
                      </Form.Item>
                    </Col>
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                      <p className="font-medium text-gray-800 ">Occupation</p>
                      <Form.Item
                        name={[name, 'occupation']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter parent occupation first',
                          },
                        ]}
                      >
                        <AutoComplete
                          size="medium"
                          options={studentsParentOccupationList?.occupations?.map((val) => ({
                            label: val,
                            value: val,
                          }))}
                        >
                          <Input size="medium" placeholder="Enter parent's occupation here" />
                        </AutoComplete>
                      </Form.Item>
                    </Col>
                    <Col lg={12} xl={12} md={12} sm={24} xs={24}>
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
                          size="medium"
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
                              res = res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                              mod = Number(res).toFixed(2);
                            } else {
                              mod = event.target.value;
                            }

                            const parentDetails = form?.getFieldValue('parentDetails');
                            parentDetails[name] = {
                              ...parentDetails[name],
                              income: currencyFormatter?.format(currencyParser(mod)),
                            };
                            form?.setFieldsValue({
                              parentDetails,
                            });
                          }}
                        />
                      </Form.Item>
                    </Col>
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
    </div>
  );
};

// export default Step4ParentDetails;
export default connect(({ student }) => ({
  studentsParentOccupationList: student?.studentsParentOccupationList,
}))(StudentParentsDetails);
