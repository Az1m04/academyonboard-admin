import React, { useState, useEffect } from 'react';
import { useDispatch, connect, history } from 'umi';
import PhoneNumber from '@/components/PhoneNumber';
import { Form, Input, Row, Col, Select, Button, notification } from 'antd';
// import AlternateMobileNo from '@/pages/Leads/BasicDetailsInviteClient/AlternateMobileNo';
import Address from '@/components/Address';
import StudentParentDetails from './StudentParentDetails';
import { currencyFormatter, decodeDollarsToDigits } from '@/utils/utils';

const Edit = ({ id, updating, studentDetails, setShowDrawer, showDrawer }) => {
  const [code, setCode] = useState('');
  const { Option } = Select;
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const button = (
    <Button
      onClick={() => {
        form.submit();
      }}
      type="primary"
      size="large"
      loading={updating}
    >
      {'Update'}
    </Button>
  );

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'student/getStudentDetails',
        payload: {
          pathParams: {
            studentId: id,
          },
        },
      })
        .then((res) => {
          const newRes = res;
          const parentDetails = newRes?.parents?.map((val) => ({
            ...val,
            income: currencyFormatter.format(val?.income.toString()),
            primaryPhone: {
              phoneFormatted: val?.primaryPhone?.areaCode.concat(val?.primaryPhone?.phone),
            },
          }));
          form?.setFieldsValue({
            ...res,
            primaryPhone: {
              ...res.primaryPhone,
              phoneFormatted: res?.primaryPhone?.areaCode.concat(res?.primaryPhone?.phone),
            },
            alternatePhone: {
              ...res.alternatePhone,
              phoneFormatted: res?.alternatePhone?.areaCode.concat(res?.alternatePhone?.phone),
            },
            parentDetails,
          });
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const updateStudent = (values) => {
    const newValues = values;
    const parents = newValues?.parentDetails?.map((val) => ({
      ...val,
      income: Number(parseFloat(decodeDollarsToDigits(val?.income))),
      primaryPhone: {
        phone: val?.primaryPhone?.phoneFormatted.slice(3),
        areaCode: val?.primaryPhone?.phoneFormatted.slice(0, 3),
        phoneFormatted: val?.primaryPhone?.phoneFormatted,
        countryCode: val?.primaryPhone?.countryCode,
      },
    }));
    const data = {
      ...values,
      primaryPhone: {
        id: studentDetails?.primaryPhone?.id,
        phone: values?.primaryPhone?.phoneFormatted.slice(3),
        areaCode: values?.primaryPhone?.phoneFormatted.slice(0, 3),
        countryCode: `+${code}`,
      },

      alternatePhone: {
        phone: values?.alternatePhone?.phoneFormatted.slice(3),
        areaCode: values?.alternatePhone?.phoneFormatted.slice(0, 3),
        countryCode: `+${code}`,
      },
      parents,
      address: {
        ...values?.address,
        id: studentDetails?.address?.id,
      },
      qualifications: [
        {
          description: values?.lastQualification?.description,
          qualificationTypeId: studentDetails?.lastQualification?.qualificationTypeId,
        },
      ],
    };
    delete data.parentDetails;
    delete data.emailAddresses;

    dispatch({
      type: 'student/updateStudentDetails',
      payload: {
        body: {
          ...data,
        },
        studentId: id,
      },
    })
      .then((res) => {
        if (res) {
          notification.success({
            message: 'Student details updated successfully!',
            duration: 3,
          });
          history.push(`/students/${id}`);
        }
      })
      .catch(() => {
        // log error silently
      });
  };

  const getClientData = (key) =>
    dispatch({
      type: 'leads/getClientLeadData',
      payload: {
        query: {
          leadTypeId: 'LEAD_CUSTOMER',
          isLeadExpired: false,
          isAppointment: false,
          isCallBack: false,
          contactDataSourceId: '',
          keyword: key,
          viewSize: 1000,
        },
      },
    });

  useEffect(() => {
    getClientData('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" -m-8 ">
      <div className="">
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            if (id) {
              updateStudent(values);
            }
          }}
        >
          <div className="  ">
            <div className="text-base text-xl pl-8 pb-2 pt-3 border border-b-2 border-t-2 bg-gray-100  font-semibold w-full text-gray-800">
              Personal details
            </div>

            <div className="px-8 mt-3 ">
              <Row gutter={16}>
                <Col lg={4} xl={4} md={4} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Title</span>

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
                  <span className="block mb-2 font-medium text-gray-800">First name</span>
                  <Form.Item
                    name="firstName"
                    rules={[
                      {
                        required: true,
                        message: 'Please enter first name! ',
                      },
                    ]}
                  >
                    <Input size="medium" placeholder="First name of contact person" />
                  </Form.Item>
                </Col>
                <Col lg={6} xl={6} md={6} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Middle name</span>
                  <Form.Item name="middleName">
                    <Input size="medium" placeholder="Middle name of contact person" />
                  </Form.Item>
                </Col>
                <Col lg={7} xl={7} md={7} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Last name </span>
                  <Form.Item name="lastName">
                    <Input size="medium" placeholder="Last name of contact person" />
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
                  <span className="block mb-2 font-medium text-gray-800">Email </span>
                  <Form.Item
                    name={['emailAddresses', 0, 'email']}
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
                  <span className="block mb-2 font-medium text-gray-800">Phone</span>
                  <PhoneNumber
                    typeEdit={true}
                    disabled={true}
                    countryCode={['primaryPhone', 'countryCode']}
                    setCode={setCode}
                    code={code}
                    form={form}
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
                  <span className="block mb-2 font-medium text-gray-800">Alternate (Optional)</span>
                  <PhoneNumber
                    typeEdit={true}
                    setCode={setCode}
                    rules={[
                      {
                        required: false,
                        message: 'Please enter phone no!',
                      },
                    ]}
                    code={code}
                    countryCode={['alternatePhone', 'countryCode']}
                    form={form}
                    name={['alternatePhone', 'phoneFormatted']}
                    placeholder="#####-#####"
                  />
                </Col>
                <Col xl={12} lg={12} md={12} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Reg By</span>
                  <Form.Item name={['registeredBy', 'id']}>
                    <Input disabled size="medium" placeholder="Registered by" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          <div className="">
            <div className=" py-2 text-base pl-8 text-xl font-semibold text-gray-800 bg-gray-100 border ">
              Address details
            </div>
            <div className=" pl-8 mt-3 pr-8">
              <Row gutter={16}>
                <Col lg={24} xl={24} md={24} sm={18} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">
                    <Address
                      studentEdit={true}
                      form={form}
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
          </div>
          <div className="">
            <div className=" py-2 text-base pl-8 text-xl font-semibold text-gray-800 bg-gray-100 border ">
              Parents details
            </div>

            <div className=" px-5 mt-3">
              <Row gutter={16}>
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <StudentParentDetails setCode={setCode} code={code} name={'parent'} form={form} />
                </Col>
              </Row>
            </div>
            <div className="border-b-2 "> </div>
            <div style={{ justifyContent: 'flex-end' }} className="flex flex-end mt-5 mb-10 pr-8">
              <Button
                size="large"
                onClick={() => {
                  setShowDrawer(!showDrawer);
                }}
                className="mr-4"
              >
                Cancel
              </Button>
              {button}
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ leads, loading, student }) => ({
  leadData: leads?.leadData,
  updating: loading.effects['student/updateStudentDetails'],
  studentDetails: student?.studentDetails,
  studentsParentOccupationList: student?.studentsParentOccupationList,
}))(Edit);
