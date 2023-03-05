import Address from '@/components/Address';
import PhoneNumber from '@/components/PhoneNumber';
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { getPhoneObject } from '@/utils/utils';

const { Option } = Select;
const StaffEdit = ({
  staffId,
  setVisibleDrawer,
  dispatch,
  setOption,
  loadingForGetStaffDetails,
  departmentList,
}) => {
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [staffDetails, setstaffDetails] = useState();
  const [selectedDepartment, setselectedDepartment] = useState();
  const [staffEditForm] = Form.useForm();
  useEffect(() => {
    if (staffId) {
      dispatch({
        type: 'staff/getTeacherDetails',
        payload: {
          pathParams: {
            TeacherId: staffId,
          },
        },
      }).then((res) => {
        setstaffDetails(res);
        staffEditForm.setFieldsValue({
          ...res,
          prefix: res?.personalTitle,
          firstName: res?.firstName,
          lastName: res?.lastName,
          middleName: res?.middleName,
          email: res?.email,
          phone: res?.formattedPhoneNumber,
          dateOfBirth: moment(res?.dob),
          maritalStatus: res?.maritalStatus,
          gender: res?.gender,
          address: {
            addressLine1: res?.address?.address1,
            city: res?.address?.city,
            postalCode: res?.address?.postalCode,
            country: res?.address?.countryGeoId,
          },
          jobInformation: {
            designation: res?.jobInformation?.designation,
            workLocation: res?.jobInformation?.location,
            department: { id: res?.jobInformation?.departmentId },
          },
        });
        if (res?.alternatePhone?.areaCode && res?.alternatePhone?.contactNumber) {
          staffEditForm.setFieldsValue({
            alternatePhone: {
              countryCode: res?.alternatePhone?.countryCode,
              phoneFormatted: res?.alternatePhone?.areaCode.concat(
                res?.alternatePhone?.contactNumber,
              ),
            },
          });
        }
        if (res?.phone?.areaCode && res?.phone?.contactNumber) {
          staffEditForm.setFieldsValue({
            primaryPhone: {
              countryCode: res?.phone?.countryCode,
              phoneFormatted: res?.phone?.areaCode.concat(res?.phone?.contactNumber),
            },
          });
        }
        if (res?.jobInformation?.phone?.areaCode && res?.jobInformation?.phone?.contactNumber) {
          staffEditForm.setFieldsValue({
            workPhone: {
              countryCode: res?.jobInformation?.phone?.countryCode,
              phoneFormatted: res?.jobInformation?.phone?.areaCode.concat(
                res?.jobInformation?.phone?.contactNumber,
              ),
            },
          });
        }
      });
    }
  }, [staffId, dispatch, staffEditForm]);
  const updateStaff = (val) => {
    const jobInformation = {
      ...val?.jobInformation,
      startDate: val?.jobInformation?.startDate?.toISOString(),
      department: {
        id: selectedDepartment,
      },

      phone: getPhoneObject(
        val?.jobInformation?.phone?.phone,
        val?.jobInformation?.phone?.countryCode,
      ),
    };
    const newValues = {
      ...jobInformation,
      ...val,
      phone: {
        countryCode: val?.primaryPhone?.countryCode,
        areaCode: val?.primaryPhone?.phoneFormatted?.split('')?.slice(0, 3)?.join(''),
        phone: val?.primaryPhone?.phoneFormatted?.split('')?.slice(3)?.join(''),
        id: staffDetails?.phone?.contactMechId,
        contactMechPurposeTypeId: staffDetails?.phone?.contactMechPurposeTypeId,
      },
      alternatePhone: {
        areaCode: val?.alternatePhone?.phoneFormatted?.split('')?.slice(0, 3)?.join(''),
        contactMechPurposeTypeId: val?.alternatePhone?.contactMechPurposeTypeId,
        countryCode: val?.alternatePhone?.countryCode,
        phone: val?.alternatePhone?.phoneFormatted?.split('')?.slice(3)?.join(''),
        id: staffDetails?.alternatePhone?.contactMechId,
      },
    };
    dispatch({
      type: 'staff/updateEditStaffDetails',
      payload: {
        body: newValues,
        pathParams: { staffId },
      },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        message.success('Your staff  update successfully');
        setVisibleDrawer(false);
        setOption();
      } else {
        message.error('Something went wrong');
      }
    });
  };
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
  }, []);

  return (
    <div className="px-0 -mx-5">
      <Form form={staffEditForm} onFinish={(val) => updateStaff(val)}>
        <Spin spinning={Boolean(loadingForGetStaffDetails)}>
          <div className="">
            <div className="text-base text-lg pl-6 pb-2 shadow-md  pt-2.5 border border-b-2 border-t-2 bg-gray-100  font-semibold w-full text-gray-800">
              Personal details
            </div>
            <div className="px-6 mt-3 ">
              <Row gutter={16}>
                <Col lg={4} xl={4} md={4} sm={18} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Title</span>

                  <Form.Item
                    name="prefix"
                    rules={[
                      {
                        required: true,
                        message: 'Please select Title!',
                      },
                    ]}
                    initialValue="Mr"
                  >
                    <Select
                      size="medium"
                      placeholder="Title"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      <Option value="Mr">Mr</Option>
                      <Option value="Miss">Miss</Option>
                      <Option value="Mrs">Mrs</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col lg={7} xl={7} md={7} sm={18} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">First name</span>
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter first name! ',
                      },
                    ]}
                  >
                    <Input size="medium" placeholder="Enter first name " />
                  </Form.Item>
                </Col>
                <Col lg={6} xl={6} md={6} sm={18} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Middle name</span>
                  <Form.Item name="middleName">
                    <Input size="medium" placeholder="Enter middle name " />
                  </Form.Item>
                </Col>
                <Col lg={7} xl={7} md={7} sm={18} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Last name </span>
                  <Form.Item name="lastName">
                    <Input size="medium" placeholder="Enter last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}></Row>
              <Row gutter={16}>
                <Col
                  xl={12}
                  lg={12}
                  md={12}
                  sm={18}
                  xs={24}
                  style={{ marginBottom: 0, paddingBottom: 0 }}
                >
                  <span className=" mb-2 font-medium text-gray-800">Email </span>
                  <Form.Item
                    name={'email'}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a valid email!',
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      },
                    ]}
                  >
                    <Input disabled size="medium" type="email" placeholder="john.doe@domain.com" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={18} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Phone</span>
                  <PhoneNumber
                    typeEdit={true}
                    disabled={true}
                    countryCode={['primaryPhone', 'countryCode']}
                    form={staffEditForm}
                    name={['primaryPhone', 'phoneFormatted']}
                    placeholder="#####-#####"
                    rules={[
                      {
                        required: true,
                        message: "Phone number can't be blank!",
                      },
                    ]}
                  />
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Alternate (Optional)</span>
                  <PhoneNumber
                    typeEdit={true}
                    rules={[
                      {
                        required: false,
                        message: 'Please enter phone no!',
                      },
                    ]}
                    countryCode={['alternatePhone', 'countryCode']}
                    form={staffEditForm}
                    name={['alternatePhone', 'phoneFormatted']}
                    placeholder="#####-#####"
                  />
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <div className="w-full">
                    <span className=" mb-2 font-medium text-gray-800">D.B.O</span>

                    <Form.Item name={'dateOfBirth'}>
                      <DatePicker size="medium" style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Gender</span>
                  <Form.Item name="gender">
                    <Select
                      getPopupContainer={(node) => node.parentNode}
                      size="medium"
                      placeholder="Select gender"
                    >
                      <Option key="Male" value="Male">
                        Male
                      </Option>
                      <Option key="Female" value="Female">
                        Female
                      </Option>
                      <Option key="Other" value="Other">
                        Other
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Marital status</span>
                  <Form.Item name="maritalStatus">
                    <Select
                      size="medium"
                      getPopupContainer={(node) => node.parentNode}
                      placeholder="Select marital status"
                    >
                      <Option key="Married" value="Married">
                        Married
                      </Option>
                      <Option key="Unmarried" value="Unmarried">
                        Unmarried
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="text-base text-lg pl-6 shadow-md pb-2 pt-2.5 border border-b-2 border-t-2 bg-gray-100  font-semibold w-full text-gray-800">
              Address details
            </div>
            <div className="px-6 mt-3">
              <Row gutter={16}>
                <Col lg={24} xl={24} md={24} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">
                    <Address
                      staffEdit={true}
                      form={staffEditForm}
                      mainHeading="Street/Village (Optional)"
                      type={'address'}
                      pinCodeHeading="PIN code"
                      onCountryChange={onCountryChange}
                      setOnCountryChange={setOnCountryChange}
                    />
                  </span>
                </Col>
              </Row>
            </div>
            <div className="text-base text-lg pl-6 pb-2 pt-2.5 shadow-md border border-b-2 border-t-2 bg-gray-100  font-semibold w-full text-gray-800">
              Job information
            </div>
            <div className="px-6 mt-3">
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Title/Designation</span>
                  <Form.Item name={['jobInformation', 'designation']}>
                    <Input size="medium" placeholder="Enter Title/Designation" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Department</span>
                  <Form.Item name={['jobInformation', 'department', 'id']}>
                    <AutoComplete
                      size="large"
                      placeholder="Please select or enter department"
                      onChange={(ev) => {
                        setselectedDepartment(ev);
                        if (
                          departmentList?.records?.find((data) => data?.id === ev)?.id === undefined
                        )
                          staffEditForm.setFieldsValue({
                            jobInformation: {
                              department: {
                                id: ev,
                              },
                            },
                            departmentInput: ev,
                          });
                      }}
                      onSelect={(ev) => {
                        staffEditForm.setFieldsValue({
                          jobInformation: {
                            department: {
                              id: ev,
                            },
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
              </Row>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Supervisor/Manager</span>
                  <Form.Item name={['jobInformation', 'reportsTo', 'id']}>
                    <Input size="medium" placeholder="Select Supervisor/Manager" />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Work location</span>
                  <Form.Item name={['jobInformation', 'workLocation']}>
                    <Input size="medium" placeholder="Enter Work location" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                  <span className=" mb-2 font-medium text-gray-800">Start date</span>
                  <Form.Item name={['jobInformation', 'startDate']}>
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      format={'YYYY/MM'}
                      picker="month"
                      getPopupContainer={(node) => node.parentNode}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="flex justify-end mx-6">
              <Button htmlType="submit" type="primary">
                Update
              </Button>
            </div>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default connect(({ staff, loading }) => ({
  getTeacherDetails: staff?.getTeacherDetails,
  loadingForGetStaffDetails: loading?.effects['staff/getTeacherDetails'],
  departmentList: staff?.departmentList,
}))(StaffEdit);
