import React from 'react';
import { Form, Row, Col, Input, Radio, Select, Divider, Checkbox, DatePicker, Spin } from 'antd';
import PhoneNumber from '@/components/PhoneNumber';
// import StudentUploadAvatar from '../../../StudentUploadAvatar';
import Address from '@/components/Address';
import EducationalDetails from '@/pages/Students/AddLead/EducationalDetails';
import CheckValidation from '@/components/CheckValidation';
import Card from '@/components/Structure/Card';
import { callApi } from '@/utils/apiUtils';
import { connect } from 'umi';
import moment from 'moment';

const { Option } = Select;

const Step1BasicDetails = ({
  // leadId,
  firstForm,
  checkUnmarried,
  currentStepForStudent,
  className,
  setCheckUnmarried,
  onOptionChange,
  addStudentOption,
  studentLeadList,
  setLeadId,
  setFormDisabled,
  setLeadPartyId,
  gender,
  setGender,
  type,
  purpose,
  formDisabled,
  // onBackClick,
  onNextClick,
  // Address details states
  onCountryChange,
  setOnCountryChange,
  getParticularLeadLoading,
}) => {
  const onChange = (e) => {
    setCheckUnmarried(e.target.value);
    if (gender === 'FEMALE') {
      firstForm.setFieldsValue({
        guardianName: '',
      });
    }
  };
  const onGenderChange = (e) => {
    setGender(e.target.value);
    firstForm.setFieldsValue({
      guardianName: '',
    });
  };

  return (
    <div className={className} key={currentStepForStudent}>
      <Form
        hideRequiredMark
        size="large"
        form={firstForm}
        onFinish={() => {
          onNextClick();
        }}
        name="basicDetails"
      >
        <Spin spinning={Boolean(getParticularLeadLoading)}>
          <div>
            <Card>
              <div className={`flex justify-between px-5 pt-5 ${!addStudentOption && 'pb-5'}`}>
                <h2 className="text-base font-semibold text-gray-800 w-full">Basic details</h2>

                {!addStudentOption ? (
                  <div className="flex justify-end w-full">
                    <Checkbox
                      onChange={(e) => {
                        onOptionChange(e);
                      }}
                      style={{ paddingTop: '4px' }}
                      checked={addStudentOption}
                      className="absolute z-10"
                    >
                      Choose from lead
                    </Checkbox>
                    <span className="animate-ping relative inline-flex h-3 w-3 bg-yellow-500 opacity-100 mr-32 mt-2"></span>
                  </div>
                ) : (
                  <Checkbox
                    onChange={(e) => {
                      onOptionChange(e);
                    }}
                    style={{ paddingTop: '4px', width: '15%' }}
                    checked={addStudentOption}
                  >
                    Choose from lead
                  </Checkbox>
                )}

                {addStudentOption && (
                  <CheckValidation show={addStudentOption}>
                    <Form.Item
                      name="selectStudentLead"
                      rules={[
                        {
                          required: true,
                          message: 'Please select student lead first',
                        },
                      ]}
                      className="pb-0"
                      style={{ paddingBottom: null }}
                    >
                      <Select
                        style={{ width: '100%', paddingBottom: 0, marginBottom: 0 }}
                        placeholder="Select a student lead"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(StudentLeadId) => {
                          setLeadId(StudentLeadId);
                          setFormDisabled(false);
                          setLeadPartyId('');
                        }}
                      >
                        {studentLeadList?.map((item) => (
                          <Option value={item?.id} key={item?.id}>
                            {item?.displayName}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </CheckValidation>
                )}
              </div>
              <Divider style={{ margin: '0' }} />
              <div className="px-4 rounded-md">
                <Row gutter={12} className="pt-4  ">
                  <Col xl={3} lg={3} md={3} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Title</p>
                    <Form.Item
                      name="prefix"
                      rules={[
                        {
                          required: true,
                          message: 'Please select title',
                        },
                      ]}
                    >
                      <Select
                        getPopupContainer={(node) => node.parentNode}
                        size="large"
                        placeholder="Select title"
                        disabled={formDisabled}
                      >
                        <Option value="Mr">Mr</Option>
                        <Option value="Miss">Miss</Option>
                        <Option value="Mrs">Mrs</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">First name</p>
                    <Form.Item
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your first name',
                        },
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: 'Please enter text only',
                        },
                      ]}
                    >
                      <Input
                        autocomplete="off"
                        size="large"
                        placeholder="First name of student"
                        disabled={formDisabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">
                      Middle name &#x00028;optional&#x00029;
                    </p>
                    <Form.Item
                      name="middleName"
                      rules={[
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: 'Please enter text only',
                        },
                      ]}
                    >
                      <Input
                        autocomplete="off"
                        size="large"
                        placeholder="Middle name of student"
                        disabled={formDisabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={7} lg={7} md={7} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Last name</p>
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter your Last name',
                        },
                        {
                          pattern: /^[a-zA-Z ]*$/,
                          message: 'Please enter text only',
                        },
                      ]}
                    >
                      <Input
                        autocomplete="off"
                        size="large"
                        placeholder="Last name of student"
                        disabled={formDisabled}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[12]}>
                  <Col xl={9} lg={9} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800 ">Phone</p>
                    <PhoneNumber
                      countryCode={['primaryPhone', 'countryCode']}
                      rules={[
                        {
                          required: true,
                          message: "Phone number can't be blank",
                          min: 10,
                          len: 10,
                        },
                      ]}
                      form={firstForm}
                      name={['primaryPhone', 'phone']}
                      placeholder="#####-#####"
                      purpose={purpose}
                      disabled={formDisabled}
                    />
                  </Col>
                  <Col xl={8} lg={8} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">Email</p>
                    <Form.Item
                      name="primaryEmail"
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "Email can't be blank!",
                        },
                        ({ getFieldError }) => ({
                          validator(rule, value) {
                            const a = getFieldError('email');
                            if (
                              a.includes("'email' is not a valid email") ||
                              !value ||
                              value.length < 2
                            ) {
                              return Promise.resolve();
                            }
                            return callApi(
                              {
                                uriEndPoint: {
                                  uri: '/user/isExistingLoginId',
                                  method: 'GET',
                                  version: '/xapi/v1',
                                },
                                query: {
                                  user_id: value,
                                },
                              },
                              {
                                disableNotifications: true,
                              },
                            )
                              .then(() => Promise.resolve())

                              .catch(() =>
                                Promise.reject(
                                  new Error('Email already exists. Try again with another email!'),
                                ),
                              );
                          },
                        }),
                        {
                          message: 'Please enter a valid email address!',
                          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        },
                      ]}
                    >
                      {type === 'Edit' ? (
                        <Input
                          autocomplete="off"
                          size="large"
                          placeholder="john.doe@domain.com"
                          disabled
                        />
                      ) : (
                        <Input
                          autocomplete="off"
                          size="large"
                          placeholder="john.doe@domain.com"
                          disabled={formDisabled}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col lg={7} xl={7} md={12} sm={24} xs={24}>
                    <p className="font-medium text-gray-800">D.O.B</p>
                    <Form.Item
                      name="dob"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter D.O.B',
                        },
                      ]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Enter D.O.B"
                        getPopupContainer={(node) => node.parentNode}
                        disabled={formDisabled}
                        disabledDate={(current) => current && current.valueOf() > moment()}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[12]}>
                  <Col xl={7} lg={7} md={12} sm={24} xs={24}>
                    <div className="inline-flex">
                      <div className="">
                        <p className="font-medium text-gray-800">Gender</p>
                        <Form.Item
                          name="gender"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your gender',
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={onGenderChange}
                            value={gender}
                            disabled={formDisabled}
                          >
                            <Radio value="MALE">Male</Radio>
                            <Radio value="FEMALE">Female</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                      <div className="">
                        <p className="font-medium text-gray-800">Marital status</p>
                        <Form.Item
                          shouldUpdate
                          name="maritalStatus"
                          rules={[
                            {
                              required: true,
                              message: 'Please select your marital status',
                            },
                          ]}
                        >
                          <Radio.Group
                            onChange={onChange}
                            value={checkUnmarried}
                            disabled={formDisabled}
                          >
                            <Radio value="MARRIED">Married</Radio>
                            <Radio value="UNMARRIED">Unmarried</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </div>
                  </Col>
                  {gender && checkUnmarried === 'UNMARRIED' && (
                    <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                      <p className="font-medium text-gray-800">Father name</p>
                      <Form.Item
                        name="guardianName"
                        rules={[
                          {
                            required: true,
                            message: 'Please enter father name',
                          },
                        ]}
                      >
                        <Input
                          autocomplete="off"
                          size="large"
                          placeholder="Please enter father name"
                          disabled={formDisabled}
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {gender && checkUnmarried === 'MARRIED' && (
                    <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                      <p className="font-medium text-gray-800">
                        {gender === 'MALE' ? 'Father name' : 'Husband name'}
                      </p>
                      <Form.Item
                        name="guardianName"
                        rules={[
                          {
                            required: true,
                            message: `Please enter guardian name`,
                          },
                        ]}
                      >
                        <Input
                          size="large"
                          autocomplete="off"
                          placeholder={`Please enter ${
                            gender === 'MALE' ? 'father' : 'husband'
                          } name`}
                          disabled={formDisabled}
                        />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </div>
            </Card>
            <Card>
              <h2 className="p-5 text-base font-semibold text-gray-800">Address details</h2>
              <Divider style={{ margin: '0' }} />
              <div className="px-4 mt-4">
                <Address
                  form={firstForm}
                  mainHeading="Street/Village"
                  pinCodeHeading="PIN code (Optional)"
                  type="address"
                  onCountryChange={onCountryChange}
                  setOnCountryChange={setOnCountryChange}
                  purpose={purpose}
                  disabled={formDisabled}
                />
              </div>
            </Card>
            <Card>
              <h2 className="p-5 text-base font-semibold text-gray-800">Educational details</h2>
              <Divider style={{ margin: '0' }} />
              <div className="px-4 mt-4">
                <EducationalDetails firstForm={firstForm} disabled={formDisabled} type="Student" />
              </div>
            </Card>
          </div>
        </Spin>
      </Form>
    </div>
  );
};

export default connect(({ loading }) => ({
  getParticularLeadLoading: loading?.effects['leads/getParticularStudentLeadData'],
}))(Step1BasicDetails);
