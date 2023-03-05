import { Col, Form, Input, Row, AutoComplete, Select, Button, Spin, message } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { currencyFormatter, currencyParser } from '@/utils/utils';
import { decodeDollarsToDigits } from '@/utils/utils';

const { Option } = Select;
const PromoteStaff = ({
  dispatch,
  departmentList,
  staffId,
  setVisibleDrawer,
  setOption,
  loadingForUploadForm,
  loadingForGetData,
}) => {
  const [selectedDepartment, setselectedDepartment] = useState();
  const [isSalaryFormatted, setIsSalaryFormatted] = useState(false);
  const [form] = Form.useForm();
  const getDepartmentList = () =>
    dispatch({
      type: 'staff/getDepartmentList',
      payload: {
        query: {
          viewSize: 10000,
        },
      },
    }).catch(() => {});
  useEffect(() => {
    getDepartmentList();
    if (staffId) {
      dispatch({
        type: 'staff/getTeacherDetails',
        payload: {
          pathParams: {
            TeacherId: staffId,
          },
        },
      }).then((res) => {
        form.setFieldsValue({
          branch: res?.jobInformation?.branch,
          designation: res?.jobInformation?.designation,
          salary: {
            amount: res?.jobInformation?.salary.map((item) => item?.amount),
            durationTypeId: res?.jobInformation?.salary.map((item) => item?.durationTypeId),
          },
          departmentInput: res?.jobInformation?.department,
        });
        setselectedDepartment(res?.jobInformation?.departmentId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const promoteStaffDetails = (val) => {
    const newValues = {
      branch: {
        id: val?.branch?.id,
      },
      designation: val?.designation,
      department: {
        id: selectedDepartment,
      },
      salary: [
        {
          amount:
            isSalaryFormatted === false
              ? val?.salary?.amount.toString()
              : decodeDollarsToDigits(val?.salary?.amount),
          salaryTypeId: 'BASIC',
          durationTypeId: val?.salary?.durationTypeId,
        },
      ],
    };

    dispatch({
      type: 'staff/promoteStaff',
      payload: { pathParams: { staffId }, body: newValues },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        setVisibleDrawer(false);
        setOption();
      } else {
        message.error('Something went wrong');
      }
    });
  };

  return (
    <div>
      <div className="-mx-4">
        <Form
          form={form}
          onFinish={(val) => {
            promoteStaffDetails(val);
          }}
        >
          {' '}
          <Spin spinning={Boolean(loadingForUploadForm || loadingForGetData)}>
            <div className="text-base text-lg pl-6 pb-2 pt-2.5 border shadow-md border-b-2 border-t-2 bg-gray-100 font-semibold w-full text-gray-800">
              Job details
            </div>
            <div className="mt-5 px-6 bg-gray-50 border py-4 shadow-md rounded-sm">
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Branch</span>
                  <Form.Item
                    name={['branch', 'id']}
                    rules={[{ required: true, message: 'Please enter branch ' }]}
                  >
                    <Input size="medium" placeholder="Enter or select Department" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Title/Designation</span>
                  <Form.Item name={'designation'}>
                    <Input size="medium" placeholder="Enter Title/Designation" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Department</span>
                  <Form.Item
                    name={'departmentInput'}
                    rules={[{ required: true, message: 'Please enter or select department' }]}
                  >
                    <AutoComplete
                      size="medium"
                      placeholder="Please select or enter department"
                      onChange={(ev) => {
                        setselectedDepartment(ev);
                        if (
                          departmentList?.records?.find((data) => data?.id === ev)?.id === undefined
                        )
                          form.setFieldsValue({
                            department: {
                              id: ev,
                            },

                            departmentInput: ev,
                          });
                      }}
                      onSelect={(ev) => {
                        form.setFieldsValue({
                          department: {
                            id: ev,
                          },

                          departmentInput: departmentList?.records?.find((data) => data?.id === ev)
                            ?.name,
                        });
                      }}
                      options={departmentList?.records?.map((data) => ({
                        label: data?.name,
                        value: data?.id,
                      }))}
                      filterOption="label"
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <div className="flex">
                    <div>
                      <span className=" mb-2 font-medium text-gray-800">salary</span>
                      <Form.Item
                        name={['salary', 'amount']}
                        rules={[{ required: true, message: 'Please enter salary' }]}
                      >
                        <Input
                          size="mediumx"
                          placeholder="₹0.00"
                          autoComplete="off"
                          className="text-right"
                          onBlur={(event) => {
                            setIsSalaryFormatted(true);
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
                            form.setFieldsValue({
                              salary: {
                                amount: currencyFormatter.format(currencyParser(mod)),
                              },
                            });
                          }}
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-5 pt-0.5">
                      <Form.Item name={['salary', 'durationTypeId']}>
                        <Select
                          size="medium"
                          getPopupContainer={(node) => node.parentNode}
                          placeholder="Select time"
                        >
                          <Option value="TF_hr">Hour</Option>
                          <Option value="TF_wk">Week</Option>
                          <Option value="TF_mon">Month</Option>
                          <Option value="TF_qr">Quarter</Option>
                          <Option value="TF_hy">Half year</Option>
                          <Option value="TF_yr">Year</Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="flex justify-end mt-5">
                <Row>
                  <Col>
                    <Button
                      style={{ marginRight: '15px' }}
                      onClick={() => {
                        setVisibleDrawer(false);
                        setOption();
                      }}
                    >
                      Cancle
                    </Button>
                    <Button htmlType="submit" type="primary">
                      Update
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  departmentList: staff?.departmentList,
  loadingForUploadForm: loading?.effects['staff/promoteStaff'],
  loadingForGetData: loading?.effects['staff/getTeacherDetails'],
}))(PromoteStaff);
