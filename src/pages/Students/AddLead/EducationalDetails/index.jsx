import React, { useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Popconfirm,
  AutoComplete,
  Select,
  InputNumber,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const EducationalDetails = ({
  disabled,
  getQualificationsList,
  dispatch,
  getInstituteList,
  firstForm,
}) => {
  // Removing duplicate qualifications from API response
  const qualificationDescription = getQualificationsList?.records?.map((item) => item?.description);
  const duplicateQualificationFinder = qualificationDescription?.filter((item, pos) => {
    return qualificationDescription?.indexOf(item) === pos;
  });

  const { Option } = Select;

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      const context = this;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(context, args);
      }, wait);
    };
  }
  const action = (val) => {
    dispatch({
      type: 'leads/getQualificationsList',
      payload: {
        query: {
          viewSize: 1000,
          startIndex: 0,
          keyword: val,
        },
      },
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = React.useCallback(debounce(action, 400), []);

  // eslint-disable-next-line no-unused-vars
  const [startValue, setStartValue] = useState(null);

  return (
    <div className="mt-5">
      <Form.List name="qualifications">
        {(fields, { add, remove }) => (
          <>
            {fields?.map(({ key, name, fieldKey, ...restField }) => (
              <>
                <Row gutter={16} key={key}>
                  <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Name of the degree/course</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'qualificationTypeId']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your qualification',
                        },
                      ]}
                    >
                      <AutoComplete
                        size="large"
                        getPopupContainer={(node) => node.parentNode}
                        onSearch={debounceSearch}
                        options={duplicateQualificationFinder?.map((val) => ({
                          label: val,
                          value: val,
                        }))}
                        disabled={disabled}
                      >
                        <Input
                          autoComplete="off"
                          size="large"
                          placeholder="Name of the degree/course"
                          style={{ width: '100%', marginRight: 8 }}
                          disabled={disabled}
                        />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">University/Board</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select your institute',
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        disabled={disabled}
                        placeholder="Select institute"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(val) => {
                          dispatch({
                            type: 'leads/getInstituteList',
                            payload: {
                              query: {
                                type: val,
                                viewSize: 1000,
                                startIndex: 0,
                              },
                            },
                          });
                        }}
                      >
                        <Option value="UNIVERSITY_OR_BOARD">University & board</Option>

                        <Option value="SCHOOL_OR_COLG">School & college</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">School/College/ University</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your institute name',
                        },
                      ]}
                    >
                      <AutoComplete
                        size="large"
                        getPopupContainer={(node) => node.parentNode}
                        options={getInstituteList?.records?.map((val) => ({
                          label: val?.description,
                          value: val?.description,
                        }))}
                        disabled={disabled}
                      >
                        <Input
                          autoComplete="off"
                          size="large"
                          placeholder="Institute name"
                          style={{ width: '100%', marginRight: 8 }}
                          disabled={disabled}
                        />
                      </AutoComplete>
                    </Form.Item>
                  </Col>
                  <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Status</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'statusId']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your education status',
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        disabled={disabled}
                        placeholder="Select a education status"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="STD_ONGOING">Pursuing</Option>
                        <Option value="STD_COMPLETED">Completed</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col lg={4} xl={4} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Marks obtained %</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'percentage']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter obtained marks',
                        },
                      ]}
                    >
                      <InputNumber
                        defaultValue={
                          firstForm.getFieldValue(['qualifications', name, 'percentage']) || 0
                        }
                        min={0}
                        max={100}
                        disabled={disabled}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value.replace('%', '')}
                        placeholder="0%"
                        style={{ width: '100%', marginRight: 8 }}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={3} xl={3} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Year of passing</p>

                    <Form.Item
                      {...restField}
                      name={[name, 'fromDate']}
                      rules={[
                        {
                          required: true,
                          message: 'Please select passing year',
                        },
                      ]}
                    >
                      <DatePicker
                        getPopupContainer={(node) => node.parentNode}
                        disabledDate={(current) => current && current.valueOf() > Date.now()}
                        onChange={(current) => current && setStartValue(current.valueOf())}
                        size="large"
                        picker="year"
                        style={{ width: '100%' }}
                        disabled={disabled}
                      />
                    </Form.Item>
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
                    sm={2}
                    xs={2}
                  >
                    {fields?.length > 1 && (
                      <Popconfirm
                        title="Are you sure that you want to delete?"
                        okButtonProps={{ onClick: () => remove(name) }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined style={{ fontSize: '1rem', color: 'rgba(220, 38, 38)' }} />
                      </Popconfirm>
                    )}
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
                disabled={disabled}
              >
                Add another field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default connect(({ leads }) => ({
  getQualificationsList: leads?.getQualificationsList,
  getInstituteList: leads?.getInstituteList,
}))(EducationalDetails);
