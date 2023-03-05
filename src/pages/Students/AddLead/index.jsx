import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import Card from '@/components/Structure/Card';
import BasicDetails from '../BasicDetails';
import FixedFooter from '@/components/FixedFooter';
import { Form, Divider, Button, message, Spin, Col, Select } from 'antd';
import LeadEducationalDetails from './LeadEducationalDetails';
import LeadDetails from './LeadDetails';
import { connect, history } from 'umi';
import CourseDetails from './CourseDetails';
import VisaDetails from './VisaDetails';
import OtherServices from './OtherServices';
import ModalToRenderServices from './ModalToRenderServices';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Address from '@/components/Address';
import Styles from './index.less';

const AddLead = ({ dispatch, loadData }) => {
  const [refChange, setRefChange] = useState(false);
  const [checkUnmarried, setCheckUnmarried] = useState();
  const [gender, setGender] = useState();
  const [refSize, setRefSize] = useState([
    { lg: 24 },
    { xl: 24 },
    { md: 24 },
    { sm: 24 },
    { xs: 24 },
  ]);

  const [purposeChange, setPurposeChange] = useState([]);
  const [state, setValue] = useState(false);
  const [displayComputerDropBox, setDisplayComputerDropBox] = useState(false);
  const [displayLanguageDropBox, setDisplayLanguageDropBox] = useState(false);
  const [displayServicesDropBox, setDisplayServicesDropBox] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [compCourseCatg, setCompCourseCatg] = useState();
  const [langCourseCatg, setLangCourseCatg] = useState();
  const [otherServicesChange, setOtherServicesChange] = useState();
  const [selectedService, setSelectedService] = useState([]);
  const [visaCategory, setVisaCategory] = useState([]);
  const [visaOption, setVisaOption] = useState([]);
  const [displayOtherVisaDropBox, setDisplayOtherVisaDropBox] = useState(false);
  const [code, setCode] = useState('');
  const [contactTeleId, setContactTeleId] = useState();
  const [contactAddressId, setContactAddressId] = useState();
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [referenceBy, setReferenceBy] = useState([]);
  const [feePaymentLangSet, setFeePaymentLangSet] = useState(false);
  const [isServicesModalVisible, setIsServicesModalVisible] = useState(false);
  const [otherVisaSetting, setOtherVisaSetting] = useState(false);
  const [otherServiceOn, setOtherServiceOn] = useState(false);
  const { leadId } = useParams();
  const [renderReferred, setRenderReferred] = useState('');
  const [coursesSubCategory, setCoursesSubCategory] = useState([]);
  const [coursesFromSubCategory, setCoursesFromSubCategory] = useState([]);

  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const [isAddModule, setIsAddModule] = useState([]);

  useEffect(() => {
    if (leadId) {
      setIsServicesModalVisible(false);
    } else {
      setIsServicesModalVisible(true);
      setValue(true);
    }

    form.setFieldsValue({
      qualifications: [undefined],
    });
    dispatch({
      type: 'courses/getCourses',
      payload: {
        query: { viewSize: 1000 },
      },
    });
    dispatch({
      type: 'courses/getCoursesCategory',
      payload: {
        query: { viewSize: 1000 },
      },
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
    dispatch({
      type: 'leads/getQualificationsList',
      payload: {
        query: {
          viewSize: 1000,
          startIndex: 0,
        },
      },
    });
  }, [form, dispatch, leadId]);

  useEffect(() => {
    if (leadId)
      dispatch({
        type: 'leads/getParticularStudentLeadData',
        payload: {
          query: {
            leadTypeId: 'LEAD_STUDENT',
          },
          pathParams: {
            leadId,
          },
        },
      })
        .then((leadInfo) => {
          if (leadId || leadInfo?.id) {
            const categoryArray = leadInfo?.courses?.map((item) => item?.categoryId);
            const duplicateCategoryFinder = categoryArray?.filter((item, pos) => {
              return categoryArray?.indexOf(item) === pos;
            });

            const subCategoryArray = leadInfo?.courses?.map((item) => item?.subCategoryId);
            const duplicateSubCategoryFinder = subCategoryArray?.filter((item, pos) => {
              return subCategoryArray?.indexOf(item) === pos;
            });

            setContactTeleId(leadInfo?.personContactDetails?.partyTelecom?.contactMechId);
            setContactAddressId(leadInfo?.personContactDetails?.partyAddress?.contactMechId);
            setPurposeChange(leadInfo?.lookingFor?.map((info) => info?.description));
            if (leadInfo?.leadReference?.partyId) {
              setRefChange(true);
              setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
            }
            if (leadInfo?.courses?.length > 0) {
              dispatch({
                type: 'courses/getCoursesSubCategory',
                payload: {
                  query: {
                    categoryId: leadInfo?.courses?.map((item) => item?.categoryId)?.join(','),
                  },
                },
              });
              dispatch({
                type: 'courses/getCoursesFromSubCategory',
                payload: {
                  query: {
                    categoryId: leadInfo?.courses?.map((item) => item?.subCategoryId)?.join(','),
                  },
                },
              });
            }
            const items = form.getFieldValue('items') || [];

            setFeePaymentLangSet(true);
            const courses = leadInfo?.courses?.map((need, index) => {
              items[index] = {
                ...items[index],
                displayName: need?.name,
                productId: need?.id,
                courseCategory: need?.categoryName,
                categoryId: need?.categoryId,
                subCourseCategory: need?.subCategoryName,
                subCategoryId: need?.subCategoryId,
                addModulesCheckbox: need?.modules?.length > 0 ? true : undefined,
                modulesList: need?.modules?.map((val) => val?.id),
                courseModulesArray: need?.allModules?.map((val) => {
                  return { ...val, displayName: val?.name };
                }),
              };
              return {
                productId: need?.id,
                courseCategory: need?.categoryName,
                categoryId: need?.categoryId,
                subCategoryId: need?.subCategoryId,
                subCourseCategory: need?.subCategoryName,
                displayName: need?.name,
                modulesList: need?.modules?.map((val) => val?.id),
                courseModulesArray: need?.allModules?.map((val) => {
                  return { ...val, displayName: val?.name };
                }),
              };
            });
            setCourseList(courses);
            setCoursesSubCategory(leadInfo?.courses);
            setCoursesFromSubCategory(
              leadInfo?.courses?.map((need) => {
                return {
                  ...need,
                  displayName: need?.name,
                };
              }),
            );
            const otherServices = leadInfo?.needs?.filter((item) => item?.id === 'OTHER_SERVICES');
            setSelectedService(
              otherServices?.find((item) => item?.id === 'OTHER_SERVICES')?.subNeeds?.id,
            );

            const visaDetails = leadInfo?.needs?.filter((item) => item?.id === 'VISA');
            setVisaCategory(visaDetails?.find((item) => item?.id === 'VISA')?.subNeeds?.id);
            setVisaOption(
              visaDetails?.find((item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES')?.subNeeds
                ?.subNeeds?.id,
            );
            setOnCountryChange(leadInfo?.personContactDetails?.partyAddress?.countryGeoId);
            const qualificationDetails =
              (leadInfo?.qualifications &&
                leadInfo?.qualifications?.map((item) => {
                  return {
                    qualificationTypeId: item?.description?.toUpperCase(),
                    fromDate: moment(item?.fromDate),
                    thruDate: moment(item?.thruDate),
                  };
                })) ||
              [];
            if (
              leadInfo?.leadDataSource?.sourceType !== undefined ||
              leadInfo?.leadDataSource?.description === 'Branch Reference'
            ) {
              setRefSize([{ lg: 12 }, { xl: 12 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
            }
            if (
              leadInfo?.leadDataSource?.description === 'Others' ||
              leadInfo?.leadDataSource?.description === 'Current Staff' ||
              leadInfo?.leadDataSource?.description === 'Old Staff' ||
              leadInfo?.leadDataSource?.description === 'Friend' ||
              leadInfo?.leadDataSource?.description === 'Current Student' ||
              leadInfo?.leadDataSource?.description === 'Old Student'
            ) {
              setRenderReferred(leadInfo?.leadDataSource?.description);
              setRefSize([{ lg: 8 }, { xl: 8 }, { md: 12 }, { sm: 24 }, { xs: 24 }]);
            }
            form.setFieldsValue({
              items,
              prefix: leadInfo?.personalTitle,
              firstName: leadInfo?.firstName,
              middleName: leadInfo?.middleName,
              lastName: leadInfo?.lastName,
              primaryEmail: leadInfo?.email,
              dob: moment(leadInfo?.dob),
              gender: leadInfo?.gender?.toUpperCase(),
              maritalStatus: leadInfo?.maritalStatus === 'Married' ? 'MARRIED' : 'UNMARRIED',
              guardianName: leadInfo?.guardianName,
              source:
                leadInfo?.leadDataSource?.sourceType === undefined
                  ? leadInfo?.leadDataSource?.description
                  : leadInfo?.leadDataSource?.sourceType,
              referredBy: leadInfo?.leadDataSource?.description,
              referredName: leadInfo?.leadDataSource?.dataSourceId && leadInfo?.referredName,
              SocialMedia:
                leadInfo?.leadDataSource?.sourceType === 'Social Media'
                  ? leadInfo?.leadDataSource?.description
                  : undefined,
              onlineReference:
                leadInfo?.leadDataSource?.sourceType === 'Online'
                  ? leadInfo?.leadDataSource?.description
                  : undefined,
              offlineReference:
                leadInfo?.leadDataSource?.sourceType === 'Offline'
                  ? leadInfo?.leadDataSource?.description
                  : undefined,
              printedMedia:
                leadInfo?.leadDataSource?.sourceType !== undefined &&
                leadInfo?.leadDataSource?.description,
              branch:
                leadInfo?.leadDataSource?.description === 'Branch Reference'
                  ? { id: leadInfo?.branch?.id && leadInfo?.branch?.id }
                  : undefined,
              leadReferencedBy: { id: leadInfo?.leadReference?.partyId },
              phone: {
                countryCode: leadInfo?.personContactDetails?.partyTelecom?.countryCode,
                phone: leadInfo?.personContactDetails?.partyTelecom?.areaCode?.concat(
                  leadInfo?.personContactDetails?.partyTelecom?.contactNumber,
                ),
              },
              alternatePhone: {
                countryCode: leadInfo?.personContactDetails?.alternatePhone?.countryCode,
                phone: leadInfo?.personContactDetails?.alternatePhone?.areaCode?.concat(
                  leadInfo?.personContactDetails?.alternatePhone?.contactNumber,
                ),
              },
              lookingFor: leadInfo?.lookingFor?.map((info) => info?.description),
              language_course_category: leadInfo?.courses?.map((need) => need?.id),
              country: visaDetails?.find((item) => item?.id === 'VISA')?.subNeeds?.value,
              qualifications: [...qualificationDetails],
              inquiryDate: moment(leadInfo?.leadInquiryDate),
              address: {
                addressLine1:
                  leadInfo?.personContactDetails?.partyAddress?.address2 === 'false'
                    ? undefined
                    : leadInfo?.personContactDetails?.partyAddress?.address1,
                city: leadInfo?.personContactDetails?.partyAddress?.city,
                postalCode: leadInfo?.personContactDetails?.partyAddress?.postalCode,
                countryCode: leadInfo?.personContactDetails?.partyAddress?.countryGeoId,
                stateCode: leadInfo?.personContactDetails?.partyAddress?.stateProvinceGeoId,
              },
              courseCategory: duplicateCategoryFinder?.map((item) => item),
              subCourseCategory: duplicateSubCategoryFinder?.map((item) => item),
            });

            if (otherServices?.find((item) => item?.subNeeds?.id === 'OTHERS')) {
              setDisplayServicesDropBox(true);
              form.setFieldsValue({
                otherServices: 'OTHERS',
                service_Other: otherServices?.find((item) => item?.subNeeds?.id === 'OTHERS')
                  ?.subNeeds?.value,
              });
            }
            if (otherServices?.find((item) => item?.subNeeds?.id === 'MEETING_WITH')) {
              setSelectedService('MEETING_WITH');
              form.setFieldsValue({
                service_category: 'MEETING_WITH',
                emp_name: otherServices?.find((item) => item?.subNeeds?.id === 'MEETING_WITH')
                  ?.subNeeds?.value,
              });
            }

            if (
              visaDetails?.find((item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES')?.subNeeds
                ?.subNeeds?.id === 'OTHER_VISA'
            ) {
              setVisaCategory('OTHER_VISA_SERVICES');
              setDisplayOtherVisaDropBox(true);
              form.setFieldsValue({
                visa: visaDetails?.find((item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES')
                  ?.subNeeds?.id,
                visa_category: visaDetails?.find(
                  (item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES',
                )?.subNeeds?.subNeeds?.id,
                category_other: visaDetails?.find(
                  (item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES',
                )?.subNeeds?.subNeeds?.value,
              });
            }

            if (
              visaDetails?.find((item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES')?.subNeeds
                ?.subNeeds?.id === 'IMMIGRATION'
            ) {
              form.setFieldsValue({
                country: visaDetails?.find((item) => item?.subNeeds?.id === 'OTHER_VISA_SERVICES')
                  ?.subNeeds?.subNeeds?.value,
              });
            }

            if (leadInfo?.maritalStatus === 'Unmarried') {
              setCheckUnmarried('UNMARRIED');
            }
            if (leadInfo?.maritalStatus === 'Married') {
              setCheckUnmarried('MARRIED');
            }
            if (leadInfo?.gender === 'Female') {
              setGender('FEMALE');
            }
            if (leadInfo?.gender === 'Male') {
              setGender('MALE');
            }
          }
        })
        .finally(() => {
          setValue(true);
        });

    return () => {};
  }, [dispatch, form, leadId]);

  const getValues = () => form.getFieldValue('visa');

  const leadStudentFinishHandler = (values) => {
    const data = { ...values };

    data.leadTypeId = 'LEAD_STUDENT';
    if (data?.qualificationDetails) {
      const qualifications = data?.qualifications?.map((item) => ({
        ...item,
        fromDate: item?.fromDate.toISOString() || '',
        thruDate: item?.thruDate.toISOString() || '',
      }));

      data.qualifications = qualifications;
    }
    data.inquiryDate = data?.inquiryDate.toISOString() || '';

    data.needs = [];

    if (data?.address?.addressLine1 === '' || data?.address?.addressLine1 === undefined) {
      let text = [];
      text = [
        data?.address?.city,
        data?.address?.stateCode,
        data?.address?.postalCode,
        data?.address?.countryCode,
      ]
        .filter(Boolean)
        .join(',');
      data.address.addressLine1 = text;
      data.address.addressLine2 = 'false';
    } else {
      data.address.addressLine2 = data?.address?.addressLine1;
    }

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

    if (data?.printedMedia) {
      data.source = data?.printedMedia;
    }

    if (data?.onlineReference) {
      data.source = data?.onlineReference;
    }
    if (data?.offlineReference) {
      data.source = data?.offlineReference;
    }
    if (data?.SocialMedia) {
      data.source = data?.SocialMedia;
    }

    if (data?.referredBy) {
      data.source = data?.referredBy;
    }

    data.dob = data?.dob?.toISOString() || '';
    delete data?.service_category;
    delete data?.service_Other;
    delete data?.otherServices;
    delete data?.printedMedia;

    data.phone.areaCode = data?.phone?.phone?.split('')?.slice(0, 3)?.join('');
    data.phone.phone = data?.phone?.phone?.split('')?.slice(3)?.join('');
    data.phone.countryCode = `+${code}`;

    data.alternatePhone.areaCode = data?.alternatePhone?.phone?.split('')?.slice(0, 3)?.join('');
    data.alternatePhone.phone = data?.alternatePhone?.phone?.split('')?.slice(3)?.join('');
    if (data?.alternatePhone?.phone === undefined) {
      delete data.alternatePhone;
    }

    if (leadId) {
      data.phone.id = contactTeleId;
      data.address.id = contactAddressId;
      dispatch({
        type: 'leads/updateParticularStudentLeadData',
        payload: {
          body: data,
          pathParams: {
            leadId,
          },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          form.resetFields();
          setRefSize([{ lg: 24 }, { xl: 24 }, { md: 24 }, { sm: 24 }, { xs: 24 }]);
          history.push('/leads/students/leads');
          message.success('Record has been updated successfully');
        }
        if (res?.data?.message.includes('exists')) {
          message.error('Student with same email is already exists please enter different email');
        }
        if (res?.status === 'notok') {
          message.error(res?.data?.message);
        }
      });
    } else {
      dispatch({
        type: 'student/addLead',
        payload: { body: data },
      }).then((res) => {
        if (res?.status === 'ok') {
          form.resetFields();
          setRefSize([{ lg: 24 }, { xl: 24 }, { md: 24 }, { sm: 24 }, { xs: 24 }]);
          history.push('/leads/students/leads');
          message.success('You have submitted your details successfully');
        }
        if (res?.data?.message.includes('exists')) {
          message.error('Student with same email is already exists please enter different email');
        }
        if (res?.status === 'notok') {
          message.error(res?.data?.message);
        }
      });
    }
  };
  const purposeList = [
    {
      id: 'Courses',
      label: 'Courses',
    },
    {
      id: 'Visa',
      label: 'Visa',
    },
    {
      id: 'Others',
      label: 'Other Service.',
    },
  ];
  const onPurposeChange = (purposes) => {
    setPurposeChange(purposes);
  };

  // function to reset the fields of purposes when deselecting
  const purposeChangeHandler = (e) => {
    if (e === 'Courses') {
      const items = form.getFieldValue('items') || [];
      const modalItems = modalForm.getFieldValue('items') || [];

      items?.forEach((_, index) => {
        items[index] = {
          ...items[index],
          addModulesCheckbox: false,
          modulesItems: undefined,
          modulesList: undefined,
        };
      });
      form.setFieldsValue({
        items,
        courses: [],
        language_course_category: [],
        courseCategory: [],
        subCourseCategory: [],
      });

      modalItems?.forEach((_, index) => {
        modalItems[index] = {
          ...modalItems[index],
          addModulesCheckbox: false,
          modulesItems: undefined,
          modulesList: undefined,
        };
      });
      modalForm.setFieldsValue({
        items: modalItems,
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
      form.setFieldsValue({
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
      form.setFieldsValue({
        service_category: [],
        service_Other: [],
        emp_name: [],
        otherServices: [],
      });
    }
  };

  const modalOnClose = () => {
    setPurposeChange([]);
    setIsServicesModalVisible(false);
    const items = form.getFieldValue('items');
    items?.forEach((_, index) => {
      items[index] = {
        ...items[index],
        addModulesCheckbox: false,
        modulesItems: undefined,
        modulesList: undefined,
      };
    });
    form.setFieldsValue({
      items,
      courses: [],
      language_course_category: [],
      visa: [],
      visa_category: [],
      category_other: [],
      country: [],
      other_country: [],
      otherCountryForAppliedVisa: [],
      otherVisaCategory: [],
      service_category: [],
      service_Other: [],
      emp_name: [],
      otherServices: [],
      lookingFor: undefined,
    });
    setCourseList([]);
    setVisaCategory([]);
    setVisaOption([]);
    setSelectedService([]);
    setDisplayServicesDropBox(false);
    history.push('/leads/students/leads');
  };
  return (
    <Page
      title={
        <h1 className="text-xl font-semibold text-blue-900 capitalize">
          {leadId ? 'Edit' : 'Add'} student lead
        </h1>
      }
      subTitle={
        <p className="text-sm font-normal text-gray-800">
          {leadId ? 'Edit' : 'Add'} your student lead here.
        </p>
      }
      PrevNextNeeded="N"
      loading={loadData}
    >
      <Form form={form} onFinish={leadStudentFinishHandler}>
        <Spin spinning={Boolean(loadData)}>
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800 "> Purpose</h2>
            <Divider style={{ margin: '0' }} />
            <Col lg={24} xl={24} md={24} sm={24} xs={24} className="mx-5">
              <p className="font-medium text-gray-800 ">Purpose</p>
              <Form.Item
                name="lookingFor"
                rules={[{ required: true, message: 'Please enter purpose' }]}
              >
                <Select
                  size="large"
                  mode="tags"
                  placeholder="Please list down the purpose"
                  getPopupContainer={(node) => node.parentNode}
                  onDeselect={purposeChangeHandler}
                  style={{ width: '100%', marginBottom: '20px' }}
                  onChange={onPurposeChange}
                >
                  {purposeList?.map((item) => (
                    <Select.Option value={item?.id} key={item?.id}>
                      {item?.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {purposeChange?.includes('Courses') && (
              // {/* the state is added so that form only renders after the data is set in the form from API  */}
              <div>
                <h2 className="pb-5 px-5 text-base font-semibold text-gray-800 ">Course details</h2>

                {state && (
                  <CourseDetails
                    form={form}
                    displayComputerDropBox={displayComputerDropBox}
                    setDisplayComputerDropBox={setDisplayComputerDropBox}
                    courseList={courseList}
                    setCourseList={setCourseList}
                    compCourseCatg={compCourseCatg}
                    setCompCourseCatg={setCompCourseCatg}
                    langCourseCatg={langCourseCatg}
                    setLangCourseCatg={setLangCourseCatg}
                    displayLanguageDropBox={displayLanguageDropBox}
                    setDisplayLanguageDropBox={setDisplayLanguageDropBox}
                    feePaymentLangSet={feePaymentLangSet}
                    setFeePaymentLangSet={setFeePaymentLangSet}
                    isAddModule={isAddModule}
                    coursesSubCategory={coursesSubCategory}
                    setCoursesSubCategory={setCoursesSubCategory}
                    coursesFromSubCategory={coursesFromSubCategory}
                    setCoursesFromSubCategory={setCoursesFromSubCategory}
                  />
                )}
              </div>
            )}
            {/* </Card> */}

            {purposeChange?.includes('Visa') && (
              <div>
                {/* // <Card> */}
                <h2 className="p-5 text-base font-semibold text-gray-800 ">Visa details</h2>
                <Divider style={{ margin: '0' }} />
                {/* //   <Card.Section> */}
                <VisaDetails
                  form={form}
                  getValues={getValues}
                  visaCategory={visaCategory}
                  setVisaCategory={setVisaCategory}
                  displayOtherVisaDropBox={displayOtherVisaDropBox}
                  setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
                  visaOption={visaOption}
                  setVisaOption={setVisaOption}
                  otherVisaSetting={otherVisaSetting}
                  setOtherVisaSetting={setOtherVisaSetting}
                />
                {/* //   </Card.Section>
              // </Card> */}
              </div>
            )}

            {purposeChange?.includes('Others') && (
              // <Card>
              <div>
                <h2 className="p-5 text-base font-semibold text-gray-800 ">Other services</h2>
                <Divider style={{ margin: '0' }} />
                {/* // <Card.Section> */}
                <OtherServices
                  form={form}
                  displayServicesDropBox={displayServicesDropBox}
                  setDisplayServicesDropBox={setDisplayServicesDropBox}
                  otherServicesChange={otherServicesChange}
                  setOtherServicesChange={setOtherServicesChange}
                  selectedService={selectedService}
                  setSelectedService={setSelectedService}
                  referenceBy={referenceBy}
                  otherServiceOn={otherServiceOn}
                  setOtherServiceOn={setOtherServiceOn}
                />
                {/* // </Card.Section> */}
              </div>
            )}
          </Card>
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800">Basic details</h2>
            <Divider style={{ margin: '0' }} />
            <Card.Section>
              <BasicDetails
                form={form}
                checkUnmarried={checkUnmarried}
                setCheckUnmarried={setCheckUnmarried}
                gender={gender}
                setGender={setGender}
                setCode={setCode}
                leadId={leadId}
              />
            </Card.Section>
          </Card>
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800">Address details</h2>
            <Divider style={{ margin: '0' }} />
            <Card.Section>
              <div className="mt-5">
                <Address
                  form={form}
                  mainHeading="Street/Village (Optional)"
                  type={'address'}
                  pinCodeHeading="PIN code"
                  onCountryChange={onCountryChange}
                  setOnCountryChange={setOnCountryChange}
                />
              </div>
            </Card.Section>
          </Card>
          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800 ">Other details</h2>
            <Divider style={{ margin: '0' }} />
            <Card.Section>
              <LeadDetails
                form={form}
                setRefSize={setRefSize}
                refSize={refSize}
                refChange={refChange}
                setRefChange={setRefChange}
                purposeChange={purposeChange}
                setPurposeChange={setPurposeChange}
                referenceBy={referenceBy}
                setReferenceBy={setReferenceBy}
                purposeChangeHandler={purposeChangeHandler}
                renderReferred={renderReferred}
                setRenderReferred={setRenderReferred}
              />
            </Card.Section>
          </Card>

          <Card>
            <h2 className="p-5 text-base font-semibold text-gray-800 ">Educational details</h2>
            <Divider style={{ margin: '0' }} />
            <Card.Section>
              <LeadEducationalDetails form={form} />
            </Card.Section>
          </Card>

          <FixedFooter classes="text-right  ">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '80rem',
              }}
            >
              <div className="w-full ">
                <Button type="primary" htmlType="submit" size="large" loading={loadData}>
                  {leadId ? 'Update' : 'Add lead'}
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Spin>
      </Form>
      <Card>
        <Card.Section>
          {/* Modal to render services to be selected by lead */}
          <div className={`${Styles.modalOveride}`}>
            <ModalToRenderServices
              isServicesModalVisible={isServicesModalVisible}
              modalOnClose={modalOnClose}
              purposeList={purposeList}
              setIsServicesModalVisible={setIsServicesModalVisible}
              purposeChangeHandler={purposeChangeHandler}
              Styles={Styles}
              setPurposeChange={setPurposeChange}
              purposeChange={purposeChange}
              form={form}
              modalForm={modalForm}
              courseList={courseList}
              setCourseList={setCourseList}
              feePaymentLangSet={feePaymentLangSet}
              setFeePaymentLangSet={setFeePaymentLangSet}
              getValues={getValues}
              visaCategory={visaCategory}
              setVisaCategory={setVisaCategory}
              displayOtherVisaDropBox={displayOtherVisaDropBox}
              setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
              visaOption={visaOption}
              setVisaOption={setVisaOption}
              displayServicesDropBox={displayServicesDropBox}
              setDisplayServicesDropBox={setDisplayServicesDropBox}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              referenceBy={referenceBy}
              otherVisaSetting={otherVisaSetting}
              setOtherVisaSetting={setOtherVisaSetting}
              otherServiceOn={otherServiceOn}
              setOtherServiceOn={setOtherServiceOn}
              isAddModule={isAddModule}
              setIsAddModule={setIsAddModule}
              coursesSubCategory={coursesSubCategory}
              setCoursesSubCategory={setCoursesSubCategory}
              coursesFromSubCategory={coursesFromSubCategory}
              setCoursesFromSubCategory={setCoursesFromSubCategory}
            />
          </div>
        </Card.Section>
      </Card>
    </Page>
  );
};
export default connect(({ loading, courses }) => ({
  loadData:
    loading.effects['student/addLead'] ||
    loading.effects['leads/updateParticularStudentLeadData'] ||
    loading.effects['leads/getParticularStudentLeadData'],
  allCourses: courses?.allCourses,
}))(AddLead);
