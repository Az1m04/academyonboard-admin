import { AutoComplete, Button, Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import LeadEnquiryCourseDetails from './LeadEnquiryCourseDetails';
import LeadEnquiryVisaDetails from './LeadEnquiryVisaDetails';
import LeadEnquiryOtherServices from './LeadEnquiryOtherServices';
import { connect, useParams } from 'umi';
import {
  referredBy,
  socialMediaRef,
  onlineRef,
  printedMedia,
  referenceList,
  purposeList,
} from './LeadStaticData';

const AddLeadEnquiry = ({
  addEnquiryModal,
  setAddEnquiryModal,
  dispatch,
  loading,
  getLeadEnquiry,
  clientList,
  getOldStaffMembers,
  getAllEnabledStudentList,
  getAllDisabledStudentList,
}) => {
  const [purposeChange, setPurposeChange] = useState();
  const [visaCategory, setVisaCategory] = useState([]);
  const [displayOtherVisaDropBox, setDisplayOtherVisaDropBox] = useState(false);
  const [visaOption, setVisaOption] = useState([]);
  const [otherVisaSetting, setOtherVisaSetting] = useState(false);
  const [coursesSubCategory, setCoursesSubCategory] = useState([]);
  const [coursesFromSubCategory, setCoursesFromSubCategory] = useState([]);
  const [feePaymentLangSet, setFeePaymentLangSet] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [otherServiceOn, setOtherServiceOn] = useState(false);
  const [selectedService, setSelectedService] = useState([]);
  const [displayServicesDropBox, setDisplayServicesDropBox] = useState(false);
  const [referenceBy, setReferenceBy] = useState([]);
  const [renderReferred, setRenderReferred] = useState('');
  const [addEnquiryForm] = Form.useForm();
  const { leadId } = useParams();
  const { Option } = AutoComplete;
  const onPurposeChange = (purposes) => {
    setPurposeChange(purposes);
  };

  useEffect(() => {
    dispatch({
      type: 'leads/getClientList',
      payload: {
        query: {
          isAccepted: true,
          clientId: 'OMG',
          viewSize: 1000,
          startIndex: 0,
        },
      },
    });
    dispatch({
      type: 'student/getAllEnabledStudentList',
      payload: { query: { enabled: true } },
    });
    dispatch({
      type: 'student/getAllDisabledStudentList',
      payload: { query: { enabled: false } },
    });
    dispatch({
      type: 'leads/getStaffMembers',
      payload: {
        query: {
          statusId: 'PARTYINV_ACCEPTED',
        },
      },
    }).then((res) => {
      setReferenceBy(res?.records?.filter((items) => items?.id || items?.name));
    });
    dispatch({
      type: 'leads/getOldStaffMembers',
      payload: {
        query: {
          statusId: 'INV_ACCPTD_DSBLD',
        },
      },
    });
  }, [dispatch]);
  const getValues = () => addEnquiryForm.getFieldValue('visa');
  const addEnquiryValue = (values) => {
    const data = { ...values };
    data.needs = [];
    if (data?.language_course_category) {
      data?.items?.map((item) => {
        if (item?.addModulesCheckbox) {
          return data.needs.push({
            productId: item?.productId,
            subNeeds: item?.modulesList?.map((val) => ({ productId: val })),
          });
        }
        return data.needs.push({ productId: item?.productId });
      });
    }

    delete data?.language_course_category;

    delete data?.courses;

    if (data?.visa === 'STUDENT_VISA') {
      data.needs.push({ id: 'STUDENT_VISA', value: data?.country });
    }

    if (data?.visa === 'VISITOR_VISA') {
      data.needs.push({ id: 'VISITOR_VISA', value: data?.country });
    }

    delete data?.visa;

    if (data?.visa_category && data?.visa_category !== 'IMMIGRATION') {
      data.needs.push({ id: data?.visa_category });
    }

    if (data?.visa_category === 'IMMIGRATION') {
      data.needs.push({ id: 'IMMIGRATION', value: data?.country });
    }
    delete data?.visa_category;
    delete data?.country;

    if (data?.category_other) {
      data.needs.push({ id: 'OTHER_VISA', value: data?.category_other });
    }
    delete data?.category_other;
    delete data?.otherVisaCategory;

    if (data?.service_category) {
      data.needs.push({ id: data?.service_category, value: data?.emp_name });
    }
    delete data?.emp_name;
    if (data?.service_Other) {
      data.needs.push({ id: 'OTHERS', value: data?.service_Other });
    }
    dispatch({
      type: 'leads/addLeadEnquiry',
      payload: { body: data, pathParams: { leadId } },
    }).then((res) => {
      if (res?.responseMessage === 'success') {
        getLeadEnquiry();
        addEnquiryForm.resetFields();
        setAddEnquiryModal(false);
        setRenderReferred('');
        setPurposeChange();
        setCourseList([]);
        setCoursesSubCategory([]);
        setCoursesFromSubCategory([]);
        setVisaCategory([]);
        setVisaOption([]);
        setSelectedService([]);
        setDisplayServicesDropBox(false);
        message.success('Your lead enquiry added successfully');
      } else if (res?.data?.message) {
        message.error(res?.data?.message);
      } else {
        message.error(res?.message);
      }
    });
  };
  const purposeChangeHandler = (e) => {
    if (e === 'Courses') {
      const items = addEnquiryForm.getFieldValue('items') || [];

      items?.forEach((_, index) => {
        items[index] = {
          ...items[index],
          addModulesCheckbox: false,
          modulesItems: undefined,
          modulesList: undefined,
        };
      });
      addEnquiryForm.setFieldsValue({
        items,
        courses: [],
        language_course_category: [],
        courseCategory: [],
        subCourseCategory: [],
      });

      setCourseList([]);
      setCoursesSubCategory([]);
      setCoursesFromSubCategory([]);
    }

    if (e === 'Visa') {
      addEnquiryForm.setFieldsValue({
        visa: [],
        visa_category: [],
        category_other: [],
        country: [],
        other_country: [],
        otherCountryForAppliedVisa: [],
        otherVisaCategory: [],
      });
      setVisaCategory([]);
      setVisaOption([]);
    }

    if (e === 'Others') {
      setSelectedService([]);
      setDisplayServicesDropBox(false);
      addEnquiryForm.setFieldsValue({
        service_category: [],
        service_Other: [],
        emp_name: [],
        otherServices: [],
      });
    }
  };

  return (
    <div>
      <div>
        <Modal
          onCancel={() => {
            setAddEnquiryModal(false);
            addEnquiryForm.resetFields();
            setRenderReferred('');
            setPurposeChange('');
          }}
          footer={null}
          title={'Add lead enquiry here'}
          visible={addEnquiryModal}
          maskClosable={false}
        >
          <div>
            <Form
              form={addEnquiryForm}
              onFinish={(value) => {
                addEnquiryValue(value);
              }}
            >
              <div>
                <p className="font-medium mb-2">Select purpose</p>
                <Form.Item name="lookingFor">
                  <Select
                    size="large"
                    mode="tags"
                    placeholder="Please list down the purpose"
                    getPopupContainer={(node) => node.parentNode}
                    onDeselect={purposeChangeHandler}
                    style={{ width: '100%' }}
                    onChange={onPurposeChange}
                  >
                    {purposeList?.map((item) => (
                      <Select.Option value={item?.id} key={item?.id}>
                        {item?.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div>
                {purposeChange?.includes('Courses') && (
                  <LeadEnquiryCourseDetails
                    form={addEnquiryForm}
                    coursesSubCategory={coursesSubCategory}
                    setCoursesSubCategory={setCoursesSubCategory}
                    coursesFromSubCategory={coursesFromSubCategory}
                    setCoursesFromSubCategory={setCoursesFromSubCategory}
                    feePaymentLangSet={feePaymentLangSet}
                    setFeePaymentLangSet={setFeePaymentLangSet}
                    courseList={courseList}
                    setCourseList={setCourseList}
                  />
                )}
                {purposeChange?.includes('Visa') && (
                  <LeadEnquiryVisaDetails
                    getValues={getValues}
                    form={addEnquiryForm}
                    visaCategory={visaCategory}
                    setVisaCategory={setVisaCategory}
                    displayOtherVisaDropBox={displayOtherVisaDropBox}
                    setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
                    visaOption={visaOption}
                    setVisaOption={setVisaOption}
                    otherVisaSetting={otherVisaSetting}
                    setOtherVisaSetting={setOtherVisaSetting}
                  />
                )}

                {purposeChange?.includes('Others') && (
                  <LeadEnquiryOtherServices
                    form={addEnquiryForm}
                    otherServiceOn={otherServiceOn}
                    setOtherServiceOn={setOtherServiceOn}
                    selectedService={selectedService}
                    setSelectedService={setSelectedService}
                    displayServicesDropBox={displayServicesDropBox}
                    setDisplayServicesDropBox={setDisplayServicesDropBox}
                    referenceBy={referenceBy}
                    setReferenceBy={setReferenceBy}
                  />
                )}
                <Row gutter={24}>
                  <Col
                    xl={12}
                    lg={12}
                    // lg={refSize[0]?.lg}
                    // xl={refSize[1]?.xl}
                    // md={refSize[2]?.md}
                    // sm={refSize[3]?.sm}
                    // xs={refSize[4]?.xs}
                  >
                    <p className="font-medium text-gray-800 ">
                      Reference &#x00028;optional&#x00029;
                    </p>
                    <Form.Item name="source">
                      <Select
                        size="large"
                        placeholder="Please list down the Reference"
                        getPopupContainer={(node) => node.parentNode}
                        style={{ width: '100%' }}
                        onChange={(val) => {
                          setRenderReferred(val);
                          addEnquiryForm?.setFieldsValue({
                            leadReferencedBy: { id: undefined },
                            printedMedia: undefined,
                            onlineReference: undefined,
                            offlineReference: undefined,
                            SocialMedia: undefined,
                            branch: { id: undefined },
                            referredBy: undefined,
                          });
                        }}
                      >
                        {referenceList?.map((item) => (
                          <Option
                            labelFilter={item?.label}
                            key={item?.id}
                            value={item?.id}
                            title={item?.label}
                          >
                            {item?.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  {addEnquiryForm.getFieldValue('source')?.includes('Printed Media') && (
                    <Col
                      xl={12}
                      lg={12}
                      // lg={refSize[0]?.lg}
                      // xl={refSize[1]?.xl}
                      // md={refSize[2]?.md}
                      // sm={refSize[3]?.sm}
                      // xs={refSize[4]?.xs}
                    >
                      <span className="font-medium text-gray-800 ">Printed media</span>
                      <Form.Item name="printedMedia" style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Select printed media"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {printedMedia?.map((item) => (
                            <Option
                              labelFilter={item?.label}
                              key={item?.id}
                              value={item?.id}
                              title={item?.label}
                            >
                              {item?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {addEnquiryForm.getFieldValue('source')?.includes('Online') && (
                    <Col xl={12} lg={12}>
                      <span className="font-medium text-gray-800 mb-5">Online</span>
                      <Form.Item name="onlineReference" style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Select Online media"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {onlineRef?.map((item) => (
                            <Option
                              labelFilter={item?.label}
                              key={item?.id}
                              value={item?.id}
                              title={item?.label}
                            >
                              {item?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {addEnquiryForm.getFieldValue('source')?.includes('Offline') && (
                    <Col xl={12} lg={12}>
                      <span className="font-medium text-gray-800">Offline reference</span>
                      <Form.Item name="offlineReference" style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Select Offline reference"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          <Option
                            labelFilter="Office Visit"
                            key="Office Visit"
                            value="Office Visit"
                            title="Office visit"
                          >
                            Office visit
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {addEnquiryForm.getFieldValue('source')?.includes('Social Media') && (
                    <Col xl={12} lg={12}>
                      <span className="font-medium text-gray-800">Social media reference</span>
                      <Form.Item name="SocialMedia" style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Select social media reference"
                          getPopupContainer={(node) => node.parentNode}
                          // onChange={(val) => referred(val)}
                          onChange={(val) => setRenderReferred(val)}
                        >
                          {socialMediaRef?.map((item) => (
                            <Option
                              labelFilter={item?.label}
                              key={item?.id}
                              value={item?.id}
                              title={item?.label}
                            >
                              {item?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Others') && (
                    <Col xl={12} lg={12}>
                      <div className="">Other social media</div>
                      <Form.Item name={'referredName'} style={{ marginTop: '13px' }}>
                        <Input
                          type="text"
                          size="large"
                          placeholder="Enter social media name"
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {addEnquiryForm.getFieldValue('source')?.includes('Branch Reference') && (
                    <Col xl={12} lg={12}>
                      <div className="">Select branch</div>
                      <Form.Item name={['branch', 'id']} style={{ marginTop: '13px' }}>
                        <Select size="large" className="w-full" placeholder="Select branch here">
                          {clientList?.records?.map((val) => (
                            <Option key={val?.id} value={val?.id}>
                              {val?.clientName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {addEnquiryForm.getFieldValue('source')?.includes('Referred') && (
                    <Col xl={12} lg={12}>
                      <div className="">Referred by</div>
                      <Form.Item name="referredBy" style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          className="w-full"
                          placeholder="Select branch here"
                          // onChange={(val) => referred(val)}
                          onChange={(val) => setRenderReferred(val)}
                        >
                          {referredBy?.map((val) => (
                            <Option key={val?.id} value={val?.id}>
                              {val?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Current Staff') && (
                    <Col xl={12} lg={12}>
                      <div className="">Current staff</div>
                      <Form.Item name={['leadReferencedBy', 'id']} style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Reference by"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {referenceBy?.map((item) => (
                            <Option
                              labelFilter={item?.displayName}
                              key={item?.partyId}
                              title={item?.displayName}
                            >
                              {item?.displayName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Old Staff') && (
                    <Col xl={12} lg={12}>
                      <div className="">Old Staff</div>
                      <Form.Item name={['leadReferencedBy', 'id']} style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Reference by"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {getOldStaffMembers?.records?.map((item) => (
                            <Option
                              labelFilter={item?.displayName}
                              key={item?.id}
                              title={item?.displayName}
                            >
                              {item?.displayName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Friend') && (
                    <Col xl={12} lg={12}>
                      <div className="">Friend</div>
                      <Form.Item name={'referredName'} style={{ marginTop: '13px' }}>
                        <Input
                          type="text"
                          size="large"
                          placeholder="Enter friend name"
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Current Student') && (
                    <Col xl={12} lg={12}>
                      <div className="">Current student</div>
                      <Form.Item name={['leadReferencedBy', 'id']} style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Reference by"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {getAllEnabledStudentList?.records?.map((item) => (
                            <Option labelFilter={item?.name} key={item?.id} title={item?.name}>
                              {item?.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {renderReferred?.includes('Old Student') && (
                    <Col xl={12} lg={12}>
                      <div className="">Old student</div>
                      <Form.Item name={['leadReferencedBy', 'id']} style={{ marginTop: '13px' }}>
                        <Select
                          size="large"
                          placeholder="Reference by"
                          getPopupContainer={(node) => node.parentNode}
                        >
                          {getAllDisabledStudentList?.records?.map((item) => (
                            <Option labelFilter={item?.name} key={item?.id} title={item?.name}>
                              {item?.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="default"
                  onClick={() => {
                    addEnquiryForm.resetFields();
                    setAddEnquiryModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button loading={loading} htmlType="submit" type="primary">
                  Add
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default connect(({ loading, leads, student }) => ({
  loading: loading?.effects['leads/addLeadEnquiry'],
  clientList: leads?.clientList,
  getOldStaffMembers: leads.getOldStaffMembers,
  studentsList: student.studentsList,
  getAllEnabledStudentList: student.getAllEnabledStudentList,
  getAllDisabledStudentList: student.getAllDisabledStudentList,
}))(AddLeadEnquiry);
