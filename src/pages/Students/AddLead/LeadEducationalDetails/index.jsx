import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, DatePicker, Popconfirm, AutoComplete } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'umi';

const LeadEducationalDetails = ({ disabled, getQualificationsList, dispatch }) => {
  // Removing duplicate qualifications from API response
  const qualificationDescription = getQualificationsList?.records?.map((item) => item?.description);
  const duplicateQualificationFinder = qualificationDescription?.filter((item, pos) => {
    return qualificationDescription?.indexOf(item) === pos;
  });

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

  const [startValue, setStartValue] = useState(null);

  return (
    <div className="mt-5">
      <Form.List name="qualifications">
        {(fields, { add, remove }) => (
          <>
            {fields?.map(({ key, name, fieldKey, ...restField }) => (
              <>
                <Row gutter={16} key={key}>
                  <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Name of the degree/course</p>
                    <Form.Item
                      {...restField}
                      name={[name, 'qualificationTypeId']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please enter your qualification',
                      //   },
                      // ]}
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
                  <Col lg={5} xl={5} md={5} sm={10} xs={10}>
                    <p className="font-medium text-gray-800 ">Start year</p>

                    <Form.Item
                      {...restField}
                      name={[name, 'fromDate']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select start year',
                      //   },
                      // ]}
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
                  <Col lg={5} xl={5} md={5} sm={10} xs={10}>
                    <p className="font-medium text-gray-800 ">End year</p>

                    <Form.Item
                      {...restField}
                      name={[name, 'thruDate']}
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Please select end year',
                      //   },
                      // ]}
                    >
                      <DatePicker
                        getPopupContainer={(node) => node.parentNode}
                        disabledDate={(current) => current && current.valueOf() < startValue}
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
                      <DeleteOutlined style={{ fontSize: '1rem', color: 'rgba(220, 38, 38)' }} />
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
}))(LeadEducationalDetails);
