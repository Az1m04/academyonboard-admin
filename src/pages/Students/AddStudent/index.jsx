import React, { useEffect } from 'react';
import Page from '@/components/Page';
import FixedFooter from '@/components/FixedFooter';
import { Form, Button, Row, Col, message, Spin } from 'antd';
import { useState } from 'react';
import { connect, history, useParams } from 'umi';
import { decodeDollarsToDigits } from '@/utils/utils';
import moment from 'moment';
import style from './index.less';
import StepsWrapper from './Steps/StepsWrapper';
import Breadcrumbs from '@/components/BreadCrumbs';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

const AddStudent = ({
  dispatch,
  studentLeadData,
  loadData,
  studentLeadRecord,
  getCoursesCategory,
  loadingForGetLead,
}) => {
  const [firstForm] = Form.useForm();
  const [courseDetailsForm] = Form.useForm();
  const [feesDetailsForm] = Form.useForm();
  const [studentReferencesForm] = Form.useForm();
  const [parentDetailsForm] = Form.useForm();
  const [uploadDocumentForm] = Form.useForm();
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [addStudentOption, setAddStudentOption] = useState(false);
  const [checkUnmarried, setCheckUnmarried] = useState();
  const [gender, setGender] = useState();
  const [purposeChange, setPurposeChange] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [visaCategory, setVisaCategory] = useState([]);
  const [visaOption, setVisaOption] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [displayServicesDropBox, setDisplayServicesDropBox] = useState(false);
  const [displayOtherVisaDropBox, setDisplayOtherVisaDropBox] = useState(false);
  const [otherServicesChange, setOtherServicesChange] = useState();
  const [referenceBy, setReferenceBy] = useState([]);
  const [contents, setContents] = useState([]);
  const [leadId, setLeadId] = useState('');
  const [feePaymentLangSet, setFeePaymentLangSet] = useState(false);
  const [formDisabled, setFormDisabled] = useState(true);
  const [installmentsLevel, setInstallmentsLevel] = useState([0]);
  const [paymentMode, setPaymentMode] = useState();
  // eslint-disable-next-line no-unused-vars
  const [allValues, setAllValues] = useState(null);
  const [currentStepForStudent, setCurrentStepForStudent] = useState(0);
  const [contactMacId, setContactMacId] = useState({ partyAddressId: '', partyTelecomId: '' });
  const { partyId } = useParams();
  const [leadPartyId, setLeadPartyId] = useState(partyId);
  // const [incompletedSteps, setIncompletedSteps] = useState([]);
  const [isFirstFormValidate, setIsFirstFormValidate] = useState(false);
  const [colorState, setColorState] = useState([]);
  const [checkComplete, setCheckComplete] = useState([]);
  // const [loadingForForms, setLoadingForForms] = useState(false);
  const [coursesSubCategory, setCoursesSubCategory] = useState([]);
  const [coursesFromSubCategory, setCoursesFromSubCategory] = useState([]);

  const [resizePurposeDetails, setResizePurposeDetails] = useState([
    { lg: 24 },
    { xl: 24 },
    { md: 24 },
    { sm: 24 },
    { xs: 24 },
  ]);
  const addStudentSteps = [
    {
      stepNo: 1,
      name: 'Basic details',
      value: 'basicDetails',
      color: currentStepForStudent === 0 ? 'bg-blue-300 shadow-md text-white' : '',
    },
    {
      stepNo: 2,
      name: 'Course details',
      value: 'purposeDetails',
      color: currentStepForStudent === 1 ? 'bg-blue-300 shadow-md text-white' : '',
    },
    {
      stepNo: 3,
      name: 'Fees details',
      value: 'feesDetails',
      color: currentStepForStudent === 2 ? 'bg-blue-300 shadow-md text-white' : '',
    },
    {
      stepNo: 4,
      name: 'Student references',
      value: 'studentReferences',
      color: currentStepForStudent === 3 ? 'bg-blue-300 shadow-md text-white' : '',
    },
    {
      stepNo: 5,
      name: 'Parent details',
      value: 'parentDetails',
      color: currentStepForStudent === 4 ? 'bg-blue-300 shadow-md text-white' : '',
    },
    {
      stepNo: 6,
      name: 'Upload documents',
      value: 'uploadDocuments',
      color: currentStepForStudent === 5 ? 'bg-blue-300 shadow-md text-white' : '',
    },
  ];

  const onNextClick = () => {
    if (currentStepForStudent !== 5) {
      setCurrentStepForStudent((prev) => prev + 1);
    }
  };

  const onBackClick = () => {
    setCurrentStepForStudent((prev) => prev - 1);
  };

  const onOptionChange = (e) => {
    setAddStudentOption(e.target.checked);
    if (!e.target.checked) {
      setFormDisabled(true);
      setLeadId('');
      firstForm.resetFields();
      courseDetailsForm.resetFields();
      feesDetailsForm.resetFields();
      studentReferencesForm.resetFields();
      parentDetailsForm.resetFields();
      uploadDocumentForm.resetFields();
      courseDetailsForm.setFieldsValue({
        courses: [],
        language_course_category: [],
        lookingFor: [],
      });
      setCourseList([]);
      setPurposeChange([]);
      setResizePurposeDetails([{ lg: 24 }, { xl: 24 }, { md: 24 }, { sm: 24 }, { xs: 24 }]);
      feesDetailsForm.setFieldsValue({
        feePayments: [],
      });
      setInstallmentsLevel([0]);
    }
  };

  const getValues = () => courseDetailsForm.getFieldValue('visa');

  const payloadFunction = (value) => {
    const newValues = value;
    const references = newValues?.References?.map((val) => ({
      ...val,
      primaryPhone: {
        phone: val?.phone?.phone && val?.phone?.phone.slice(3, 10),
        areaCode: val?.phone?.phone && val?.phone?.phone.slice(0, 3),
        countryCode: val?.phone?.countryCode,
      },
    }));

    const emergencyContact = {
      ...newValues.emergencyContact,
      primaryPhone: {
        phone: newValues?.emergencyContact?.primaryPhone?.phone.slice(3, 10),
        areaCode: newValues?.emergencyContact?.primaryPhone?.phone.slice(0, 3),
        countryCode: newValues?.emergencyContact?.primaryPhone?.countryCode,
      },
    };

    const parents = newValues?.ParentDetails?.map((val) => ({
      ...val,
      income: Number(decodeDollarsToDigits(val?.income)),
      primaryPhone: {
        phone: val?.phone?.phone.slice(3, 10),
        areaCode: val?.phone?.phone.slice(0, 3),
        countryCode: val?.phone?.countryCode,
      },
    }));

    const qualifications = newValues?.qualifications?.map((val) => ({
      ...val,
      typeId: 'DEGREE',
      fromDate: val?.fromDate?.toISOString(),
      thruDate: val?.thruDate?.toISOString(),
    }));
    const items = newValues?.items?.map((val, index) => ({
      product: {
        courseTypeId: val?.courseType,
        id: val?.productId,
        amount: Number(decodeDollarsToDigits(newValues?.feeDetailsFormItems[index]?.basicAmount)),
        durationUnitId: newValues?.feeDetailsFormItems[index]?.durationUnitId,
        numOfDays: val?.noOfDays,
        startDate: val?.startDate?.toISOString(),
        endDate: val?.endDate?.toISOString(),
        courseModules: val?.addModulesCheckbox
          ? newValues?.feeDetailsFormItems[index]?.modulesItems?.map((item, idx) => ({
              id: val?.modulesList[idx],
              startDate: item?.moduleStartDate?.toISOString(),
              endDate: item?.moduleEndDate?.toISOString(),
              numOfDays: item?.moduleNoOfDays,
              amount: Number(decodeDollarsToDigits(item?.moduleBasicAmount)),
              durationUnitId: item?.moduleDurationUnitId,
            }))
          : null,
        partyFees: [
          {
            amount: newValues?.feeDetailsFormItems[index]?.feeTypeIdAdjustment
              ? Number(
                  decodeDollarsToDigits(newValues?.feeDetailsFormItems[index]?.adjustmentAmount),
                )
              : 0,
            feeTypeId: newValues?.feeDetailsFormItems[index]?.feeTypeIdAdjustment
              ? 'ADJUSTMENTS'
              : null,
            purpose: newValues?.feeDetailsFormItems[index]?.feeTypeIdAdjustment
              ? newValues?.feeDetailsFormItems[index]?.adjustmentPurpose
              : null,
            remarks: newValues?.feeDetailsFormItems[index]?.feeTypeIdAdjustment
              ? newValues?.feeDetailsFormItems[index]?.adjustmentRemarks
              : null,
          },
          {
            amount: newValues?.feeDetailsFormItems[index]?.feeTypeIdOtherCharges
              ? Number(decodeDollarsToDigits(newValues?.feeDetailsFormItems[index]?.otherAmount))
              : 0,
            feeTypeId: newValues?.feeDetailsFormItems[index]?.feeTypeIdOtherCharges
              ? 'OTHER_CHARGES'
              : null,
            purpose: newValues?.feeDetailsFormItems[index]?.feeTypeIdOtherCharges
              ? newValues?.feeDetailsFormItems[index]?.otherPurpose
              : null,
            remarks: newValues?.feeDetailsFormItems[index]?.feeTypeIdOtherCharges
              ? newValues?.feeDetailsFormItems[index]?.otherRemarks
              : null,
          },
        ],
      },
    }));
    const feePayments = newValues?.feePayments?.map((val) => ({
      totalFees: Number(decodeDollarsToDigits(newValues?.feePayment?.totalFees)),
      numOfInstallments: newValues?.feePayment?.numOfInstallments,
      dueDate: val?.dueDate?.toISOString(),
      amount: Number(decodeDollarsToDigits(val?.amount)),
    }));
    delete newValues?.feePayment;
    const body = {
      ...newValues,

      primaryPhone: {
        id: contactMacId?.partyTelecomId,
        phone: newValues?.primaryPhone?.phone.slice(3, 10),
        areaCode: newValues?.primaryPhone?.phone.slice(0, 3),
        countryCode: newValues?.primaryPhone?.countryCode,
      },
      address: { ...newValues?.address, id: contactMacId?.partyAddressId },
      dob: newValues?.dob?.toISOString(),
      references,
      feePayments,
      emergencyContact,
      parents,
      qualifications,
      lookingFor: newValues?.lookingFor,
      contents,
      items,
      issueDate: newValues?.issueDate?.toISOString(),
      expDate: newValues?.expDate?.toISOString(),
    };

    dispatch({
      type: 'student/addStudent',
      payload: {
        body,
        pathParams: {
          leadId,
        },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        history.push('/students/all');
        message.success('You have submitted your details successfully');
      }
      if (res?.data?.message?.includes('exists')) {
        message.error('Student with same email is already exists please enter different email');
      }
      if (res?.status === 'notok') {
        message.error(res?.data?.message);
      }
    });
  };

  const firstFormSubmit = (value) => {
    const newValuesFirstForm = value;

    setAllValues((prev) => {
      return { ...prev, ...newValuesFirstForm };
    });
  };

  const secondFormSubmit = (value) => {
    setAllValues((prev) => {
      return { ...prev, ...value };
    });
  };
  const ThirdFormSubmit = (value) => {
    setAllValues((prev) => {
      return { ...prev, ...value };
    });
  };
  const fourFormSubmit = (value) => {
    setAllValues((prev) => {
      return { ...prev, ...value };
    });
  };
  const fifthFormSubmit = (value) => {
    setAllValues((prev) => {
      return { ...prev, ...value };
    });
  };
  const sixthFormSubmit = (value) => {
    payloadFunction({ ...allValues, ...value });
  };

  useEffect(() => {
    if (isFirstFormValidate === true) {
      const FirstVal = { ...allValues };
      const findedKeys = Object.keys(allValues);
      if (findedKeys?.includes('primaryEmail')) {
        firstForm
          .validateFields()
          .then(() => {
            if (colorState.includes(0)) {
              setColorState((prev) => prev?.filter((items) => items !== 0));
            }
          })
          .catch(() => {
            if (!colorState.includes(0)) {
              if (colorState.length > 0) {
                setColorState((prev) => [...prev, 0]);
              } else {
                setColorState([0]);
              }
            }

            setAllValues(() => {
              return { ...FirstVal };
            });
          });
      }

      if (findedKeys?.includes('lookingFor')) {
        courseDetailsForm
          .validateFields()
          .then(() => {
            if (colorState.includes(1)) {
              setColorState((prev) => {
                return prev?.filter((items) => items !== 1);
              });
            }
          })
          .catch(() => {
            if (!colorState.includes(1)) {
              if (colorState.length > 0) {
                setColorState((prev) => [...prev, 1]);
              } else {
                setColorState([1]);
              }
            }
          });
      }
      if (allValues?.feePayment?.totalFees) {
        feesDetailsForm
          .validateFields()

          .then(() => {
            setColorState((prev) => prev?.filter((item) => item !== 2));
          })
          .catch(() => {
            if (!colorState.includes(2)) {
              if (colorState.length > 0) {
                setColorState((prev) => [...prev, 2]);
              } else {
                setColorState([2]);
              }
            }

            setAllValues(() => {
              return { ...FirstVal };
            });
          });
      }
      if (allValues?.References?.length >= 0) {
        studentReferencesForm
          .validateFields()
          .then(() => {
            setColorState(colorState?.filter((item) => item !== 3));
          })
          .catch(() => {
            if (!colorState.includes(3)) {
              if (colorState.length > 0) {
                setColorState((prev) => [...prev, 3]);
              } else {
                setColorState([3]);
              }
            }
          });
      }
      if (findedKeys?.includes('emergencyContact')) {
        parentDetailsForm
          .validateFields()
          .then(() => {
            setColorState((prev) => prev?.filter((item) => item !== 4));
          })
          .catch(() => {
            if (!colorState.includes(4)) {
              if (colorState.length > 0) {
                setColorState((prev) => [...prev, 4]);
              } else {
                setColorState([4]);
              }
            }
          });
      }
      setIsFirstFormValidate(false);
    }
    // setLoadingForForms(false);
  }, [currentStepForStudent]);

  const addStudentSubmitHandler = (values) => {
    // setLoadingForForms(true);
    setIsFirstFormValidate(true);
    const copyValue = values;
    // onCheckValidate(values);

    //     firstForm.validateFields().then((res) => {

    //       // setIncompletedSteps([(incompletedSteps[steps] = 'bg-green-600 text-white')]);
    //       // return 'bg-green-600 text-white'
    //       // copyValue.incompletedSteps = [0];
    //       if (allValues?.completedSteps !== undefined) {
    //         copyValue.completedSteps = [...allValues?.completedSteps, 0];
    //       } else {
    //         copyValue.completedSteps = [0];
    //       }
    //       setAllValues((prev) => {
    //         return { ...prev, ...copyValue };
    //       });
    //     }).catch((errrr)=>{

    //     })
    //  courseDetailsForm.validateFields().then((res) => {

    //       // copyValue.incompletedSteps = [0,1];
    //       if (allValues?.completedSteps?.length > 0) {
    //         copyValue.completedSteps = [...allValues?.completedSteps, 0,1];
    //       } else {
    //         copyValue.completedSteps = [0,1];
    //       }
    //       setAllValues((prev) => {
    //         return { ...prev, ...copyValue };
    //       });
    //     }).catch((err)=>{
    //
    // })
    // courseDetailsForm.validateFields().catch(() => {
    //   // copyValue.incompletedSteps = [0,1];
    //   if (allValues?.incompletedSteps?.length > 0) {
    //     copyValue.incompletedSteps = [...allValues?.incompletedSteps, 1];
    //   } else {
    //     copyValue.incompletedSteps = [1];
    //   }
    // });

    // feesDetailsForm.validateFields().catch(() => {
    //   if (allValues?.incompletedSteps?.length > 0) {
    //     copyValue.incompletedSteps = [...allValues?.incompletedSteps, 2];
    //   } else {
    //     copyValue.incompletedSteps = [2];
    //   }
    // });

    // studentReferencesForm.validateFields().catch(() => {
    //   if (allValues?.incompletedSteps?.length > 0) {
    //     copyValue.incompletedSteps = [...allValues?.incompletedSteps, 3];
    //   } else {
    //     copyValue.incompletedSteps = [3];
    //   }
    // });

    // parentDetailsForm.validateFields().catch(() => {
    //   if (allValues?.incompletedSteps?.length > 0) {
    //     copyValue.incompletedSteps = [...allValues?.incompletedSteps, 4];
    //   } else {
    //     copyValue.incompletedSteps = [4];
    //   }
    // });

    // uploadDocumentForm.validateFields().catch(() => {
    //   if (allValues?.incompletedSteps?.length > 0) {
    //     copyValue.incompletedSteps = [...allValues?.incompletedSteps, 5];
    //   } else {
    //     copyValue.incompletedSteps = [5];
    //   }
    // });

    const findedKeys = Object.keys(copyValue);
    if (!checkComplete.includes(0)) {
      if (findedKeys?.includes('primaryEmail')) {
        // copyValue.completedSteps = [0];
        setCheckComplete([0]);
      }
    }

    if (!checkComplete.includes(1)) {
      if (findedKeys?.includes('lookingFor')) {
        // copyValue.completedSteps = [0, 1];
        setCheckComplete([0, 1]);
      }
    }
    if (!checkComplete.includes(2)) {
      if (copyValue?.feePayment?.totalFees) {
        // copyValue.completedSteps = [0, 1, 2];
        setCheckComplete([0, 1, 2]);
      }
    }
    if (!checkComplete.includes(3)) {
      if (copyValue.References?.length > 0) {
        // copyValue.completedSteps = [0, 1, 2, 3];
        setCheckComplete([0, 1, 2, 3]);
      }
    }
    if (!checkComplete.includes(2)) {
      if (copyValue.References?.length === 0) {
        // copyValue.completedSteps = [0, 1, 2];
        setCheckComplete([0, 1, 2]);
      }
    }
    if (!checkComplete.includes(4)) {
      if (findedKeys?.includes('emergencyContact')) {
        // copyValue.completedSteps = [0, 1, 2, 3, 4];
        setCheckComplete([0, 1, 2, 3, 4]);
      }
    }

    if (findedKeys?.includes('passPortNo')) {
      // copyValue.completedSteps = [0, 1, 2, 3, 4, 5];
      setCheckComplete([0, 1, 2, 3, 4, 5]);
    }

    if (currentStepForStudent === 2) {
      copyValue.feeDetailsFormItems = copyValue.items;
      delete copyValue.items;
    }
    switch (currentStepForStudent) {
      case 0:
        firstFormSubmit(copyValue);
        break;
      case 1:
        secondFormSubmit(copyValue);
        break;
      case 2:
        ThirdFormSubmit(copyValue);
        break;
      case 3:
        fourFormSubmit(copyValue);
        break;
      case 4:
        fifthFormSubmit(copyValue);
        break;
      case 5:
        sixthFormSubmit(copyValue);
        break;
      default:
        break;
    }

    // setAllValues((prev) => {
    //   return { ...prev, ...copyValue };
    // });
    // if (currentStepForStudent === 5) {
    //   payloadFunction({ ...allValues, ...copyValue });
    // }
  };

  useEffect(() => {
    firstForm.setFieldsValue({
      qualifications: [undefined],
    });
    studentReferencesForm.setFieldsValue({
      References: [undefined],
    });
    parentDetailsForm.setFieldsValue({
      ParentDetails: [undefined],
    });
    if (addStudentOption) {
      dispatch({
        type: 'leads/getStudentLeadData',
        payload: {
          query: {
            leadTypeId: 'LEAD_STUDENT',
            viewSize: 10000,
            isLead: true,
          },
        },
      });
    }
    dispatch({
      type: 'leads/getStaffMembers',
      payload: {
        query: {
          statusId: 'PARTYINV_SENT',
        },
      },
    }).then((res) => {
      setReferenceBy(res?.invitationList?.filter((items) => items?.id || items?.name));
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
  }, [dispatch, addStudentOption, firstForm, parentDetailsForm, studentReferencesForm]);

  useEffect(() => {
    dispatch({
      type: 'courses/getCoursesCategory',
      payload: {
        query: { viewSize: 1000 },
      },
    });
    dispatch({
      type: 'courses/getCourses',
      payload: {
        query: { viewSize: 1000 },
      },
    });
    dispatch({
      type: 'student/getParentOccupations',
      payload: {},
    });
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
      }).then((leadInfo) => {
        setContactMacId({
          partyAddressId: leadInfo?.personContactDetails?.partyAddress?.contactMechId,
          partyTelecomId: leadInfo?.personContactDetails?.partyTelecom?.contactMechId,
        });
        if (leadInfo?.id) {
          setFormDisabled(false);
          const items = courseDetailsForm.getFieldValue('items') || [];
          setPurposeChange(leadInfo?.lookingFor?.map((info) => info?.description));
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
              modulesItems: need?.modules?.map((item) => {
                return {
                  ...item,
                  moduleId: item?.id,
                  displayName: item?.name,
                };
              }),
              courseModulesArray: need?.allModules?.map((val) => {
                return { ...val, moduleId: val?.id, displayName: val?.name };
              }),
              fees: need?.fees,
            };
            return {
              ...need,
              productId: need?.id,
              courseCategory: need?.categoryName,
              categoryId: need?.categoryId,
              subCategoryId: need?.subCategoryId,
              subCourseCategory: need?.subCategoryName,
              displayName: need?.name,
              modulesList: need?.modules?.map((val) => val?.id),
              modulesItems: need?.modules?.map((item) => {
                return {
                  ...item,
                  moduleId: item?.id,
                  displayName: item?.name,
                };
              }),
              courseModulesArray: need?.allModules?.map((val) => {
                return { ...val, displayName: val?.name, moduleId: val?.id };
              }),
            };
          });
          setCourseList(courses);
          setOnCountryChange(leadInfo?.personContactDetails?.partyAddress?.countryGeoId);
          if (leadInfo?.courses) {
            let newCategory = [];
            newCategory = leadInfo?.courses?.map((item) => {
              return {
                categoryId: item?.categoryId,
                categoryName: item?.categoryName,
                subCategoryId: item?.subCategoryId,
                subCategoryName: item?.subCategoryName,
              };
            });
            setCoursesSubCategory(newCategory);
          } else {
            setCoursesFromSubCategory([]);
          }
          if (leadInfo?.courses) {
            let newSubCategory = [];
            newSubCategory = leadInfo?.courses?.map((val) => {
              return {
                categoryId: val?.categoryId,
                categoryName: val?.categoryName,
                subCategoryId: val?.subCategoryId,
                subCategoryName: val?.subCategoryName,
                id: val?.id,
                fees: val?.fees?.map((ite) => ite),
                displayName: val?.name,
              };
            });
            setCoursesFromSubCategory(newSubCategory);
          } else {
            setCoursesFromSubCategory([]);
          }
          const lookingForData = leadInfo?.lookingFor?.filter(
            (info) => info?.description === 'Courses',
          );
          courseDetailsForm.setFieldsValue({
            items,
            lookingFor: lookingForData?.map((info) => info?.description),
            // leadInfo?.lookingFor?.map((info) => info?.description)?.includes('Courses') &&
            // leadInfo?.lookingFor?.filter((info) => info?.description==='Courses'),
            language_course_category: leadInfo?.courses?.map((need) => need?.id),
            courseCategory: leadInfo?.courses?.map((catCourse) => catCourse?.categoryId),
            subCourseCategory: leadInfo?.courses?.map((subCat) => subCat?.subCategoryId),
          });
          feesDetailsForm.setFieldsValue({
            items,
          });
          const qualificationDetails = leadInfo?.qualifications?.map((item) => {
            return {
              qualificationTypeId: item?.description?.toUpperCase(),
              fromDate: moment(item?.fromDate),
              thruDate: moment(item?.thruDate),
            };
          });
          firstForm.setFieldsValue({
            prefix: leadInfo?.personalTitle,
            firstName: leadInfo?.firstName,
            middleName: leadInfo?.middleName,
            lastName: leadInfo?.lastName,
            primaryEmail: leadInfo?.email,
            dob: moment(leadInfo?.dob),
            gender: leadInfo?.gender?.toUpperCase(),
            maritalStatus: leadInfo?.maritalStatus === 'Married' ? 'MARRIED' : 'UNMARRIED',
            guardianName: leadInfo?.guardianName,
            primaryPhone: {
              countryCode: leadInfo?.personContactDetails?.partyTelecom?.countryCode,
              phone: leadInfo?.personContactDetails?.partyTelecom?.areaCode?.concat(
                leadInfo?.personContactDetails?.partyTelecom?.contactNumber,
              ),
            },

            qualifications: qualificationDetails,
            address: {
              addressLine1: leadInfo?.personContactDetails?.partyAddress?.address1,
              city: leadInfo?.personContactDetails?.partyAddress?.city,
              postalCode: leadInfo?.personContactDetails?.partyAddress?.postalCode,
              countryCode: leadInfo?.personContactDetails?.partyAddress?.countryGeoId,
              stateCode: leadInfo?.personContactDetails?.partyAddress?.stateProvinceGeoId,
            },
          });

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
      });
  }, [dispatch, leadId, courseDetailsForm, firstForm, feesDetailsForm]);

  const studentLeadList = studentLeadData?.records?.filter((item) => item?.displayName);
  useEffect(() => {
    if (leadPartyId) {
      setLeadId(leadPartyId);
      firstForm.setFieldsValue({
        selectStudentLead: partyId,
      });
      setAddStudentOption(true);
    }
  }, [partyId, firstForm, studentLeadList]);

  // let incompletedSteps = [];
  // const copyValue = {};

  // eslint-disable-next-line consistent-return
  // const validationOfSteps = (steps) => {
  //   // let knwColor = '';
  //   switch (steps) {
  //     case 0:
  //       firstForm.validateFields().catch(() => {
  //         setIncompletedSteps([(incompletedSteps[steps] = 'bg-green-600 text-white')]);
  //         // return 'bg-green-600 text-white'
  //       });
  //       break;

  //     default:
  //       return 'bg-gray-200 text-black';
  //     // break;
  //   }
  // };

  // useEffect(() => {
  //   validationOfSteps();
  //   firstForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 0) };
  //     });
  //   });

  //   courseDetailsForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 1) };
  //     });
  //   });

  //   feesDetailsForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 2) };
  //     });
  //   });

  //   studentReferencesForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 3) };
  //     });
  //   });

  //   parentDetailsForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 4) };
  //     });
  //   });

  //   uploadDocumentForm.validateFields().catch(() => {
  //     setAllValues((prev) => {
  //       return { ...prev, completedSteps: prev?.completedSteps?.filter((item) => item !== 5) };
  //     });
  //   });

  //   // copyValue.incompletedSteps = incompletedSteps;
  //   // setAllValues((prev) => {
  //   //   return { ...prev, ...copyValue };
  //   // });
  // }, [currentStepForStudent]);

  const onCheckValidateAndSubmit = (step) => {
    switch (step) {
      case 0:
        firstFormSubmit();
        break;
      case 1:
        secondFormSubmit();
        break;
      case 2:
        ThirdFormSubmit();
        break;
      case 3:
        fourFormSubmit();
        break;
      case 4:
        fifthFormSubmit();
        break;

      default:
        break;
    }
  };

  return (
    <Form.Provider
      onFormFinish={(_, { values, forms }) => {
        addStudentSubmitHandler(values, forms);
        // form
        //             .validateFields(['email'])
        //             .then(({ email }) => {
        //               checkUniqueness(email.toLowerCase()).then(({ isUnique }) => {
        //                 if (!isUnique) {
        //                   form.setFields([
        //                     {
        //                       name: 'email',
        //                       errors: ['This email already exist'],
        //                     },
        //                   ]);
        //                 }
        //               });
        //             })
        //             .catch(() => {});
      }}
    >
      <Page
        title={
          <>
            <h1 className="text-xl font-semibold text-blue-900 capitalize">Add student</h1>{' '}
          </>
        }
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'students',
                path: '/students',
              },
              {
                name: 'new',
                path: '/students/new',
              },
            ]}
          />
        }
      >
        <Spin spinning={Boolean(loadingForGetLead)}>
          <div className="flex flex-nowrap justify-center w-full space-x-0.5">
            {addStudentSteps?.map((item) => (
              <div
                key={item?.value}
                className={`text-base md:text-sm sm:text-xs cursor-pointer ${item?.color} ${
                  // eslint-disable-next-line no-nested-ternary
                  colorState?.includes(item?.stepNo - 1)
                    ? 'bg-red-500 text-white'
                    : allValues !== null && checkComplete?.includes(item?.stepNo - 1)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-black'
                  // incompletedSteps[item?.stepNo - 1]
                } font-semibold p-2 ${item?.stepNo === 6 && 'rounded-r-full'} ${
                  item?.stepNo === 1 && 'rounded-l-full'
                } shadow-lg w-1/5 text-center h-max py-1`}
                onClick={() => {
                  // onCheckValidate();
                  onCheckValidateAndSubmit(item?.stepNo - 1);
                  setIsFirstFormValidate(true);
                  // firstForm.submit();
                  // validationOfSteps();
                  if (checkComplete?.includes(item?.stepNo - 1) !== undefined) {
                    if (checkComplete?.includes(item?.stepNo - 1) !== false) {
                      setCurrentStepForStudent(
                        checkComplete?.find((items) => items === item?.stepNo - 1),
                      );
                      // handleClieck(i);

                      // setCurrentStepForStudent(item?.stepNo - 1)
                    }
                  }

                  // firstForm
                  // .validateFields().catch((err1) => {

                  //   // if (err1) {

                  //   //   // incompletedSteps = [...incompletedSteps, 0];
                  //   //   setIncompletedSteps((prev) => [...prev, 0]);
                  //   // }
                  // })
                }}
              >
                {item?.stepNo}. {item?.name}
              </div>
            ))}
          </div>

          {/* Student step label */}

          <div className={`${style.stepsMarginWrapperClass} mt-12`}>
            {studentLeadRecord !== null && (
              <div className="flex justify-end mt-0 ">
                <p className="bg-blue-100 w-max py-1 px-2 rounded-full flex justify-evenly shadow-md">
                  {studentLeadRecord?.photoUrl && (
                    <img src={studentLeadRecord?.photoUrl} className="rounded-full h-6 w-6" />
                  )}
                  <p className="ml-2 font-smilebold">{studentLeadRecord?.displayName}</p>
                </p>
              </div>
            )}
            <div className={`${style.uploadStyleOverrideWrapper}  mt-5 `}>
              <StepsWrapper
                purpose="Add student"
                formDisabled={formDisabled}
                onNextClick={onNextClick}
                onBackClick={onBackClick}
                onOptionChange={onOptionChange}
                setLeadId={setLeadId}
                leadId={leadId}
                setLeadPartyId={setLeadPartyId}
                setFormDisabled={setFormDisabled}
                studentLeadList={studentLeadList}
                addStudentOption={addStudentOption}
                currentStepForStudent={currentStepForStudent}
                setCurrentStepForStudent={setCurrentStepForStudent}
                firstForm={firstForm}
                courseDetailsForm={courseDetailsForm}
                feesDetailsForm={feesDetailsForm}
                studentReferencesForm={studentReferencesForm}
                parentDetailsForm={parentDetailsForm}
                uploadDocumentForm={uploadDocumentForm}
                phoneType="primaryPhone"
                checkUnmarried={checkUnmarried}
                setCheckUnmarried={setCheckUnmarried}
                gender={gender}
                setGender={setGender}
                addStudentStepsArray={addStudentSteps}
                // Address details states
                onCountryChange={onCountryChange}
                setOnCountryChange={setOnCountryChange}
                // course visa details states
                setPurposeChange={setPurposeChange}
                setCourseList={setCourseList}
                setVisaCategory={setVisaCategory}
                setVisaOption={setVisaOption}
                setSelectedService={setSelectedService}
                setDisplayServicesDropBox={setDisplayServicesDropBox}
                purposeChange={purposeChange}
                setCoursesSubCategory={setCoursesSubCategory}
                coursesSubCategory={coursesSubCategory}
                coursesFromSubCategory={coursesFromSubCategory}
                setCoursesFromSubCategory={setCoursesFromSubCategory}
                // Student course details states
                courseList={courseList}
                getCoursesCategory={getCoursesCategory}
                feePaymentLangSet={feePaymentLangSet}
                setFeePaymentLangSet={setFeePaymentLangSet}
                resizePurposeDetails={resizePurposeDetails}
                setResizePurposeDetails={setResizePurposeDetails}
                installmentsLevel={installmentsLevel}
                setInstallmentsLevel={setInstallmentsLevel}
                paymentMode={paymentMode}
                setPaymentMode={setPaymentMode}
                //  Student visa details
                getValues={getValues}
                visaCategory={visaCategory}
                displayOtherVisaDropBox={displayOtherVisaDropBox}
                setDisplayOtherVisaDropBox={setDisplayOtherVisaDropBox}
                visaOption={visaOption}
                // student other services
                displayServicesDropBox={displayServicesDropBox}
                otherServicesChange={otherServicesChange}
                setOtherServicesChange={setOtherServicesChange}
                selectedService={selectedService}
                referenceBy={referenceBy}
                // Upload document details
                contents={contents}
                setContents={setContents}
              />
            </div>
          </div>
        </Spin>
      </Page>

      <FixedFooter classes="text-right">
        <div
          className="flex m-auto"
          style={{
            maxWidth: '87.5rem',
          }}
        >
          <div className="w-full ml-5">
            <Row gutter={10}>
              <div
                className={`flex ${
                  currentStepForStudent > 0 && onBackClick ? 'justify-between ' : 'justify-end '
                } w-full`}
              >
                {currentStepForStudent > 0 && onBackClick && (
                  <Col className="">
                    <Button
                      onClick={() => onBackClick('Course details')}
                      type="default"
                      block
                      size="large"
                    >
                      <ArrowLeftOutlined />
                      Previous step
                    </Button>
                  </Col>
                )}
                <Col style={{ marginRight: '20px' }}>
                  <Button
                    onClick={() => {
                      switch (currentStepForStudent) {
                        case 0:
                          firstForm.submit();
                          // setLoadingForForms(true);
                          // setAllValues((prev) => {
                          //   if (prev?.completedSteps?.lenght > 0) {
                          //     return { ...prev, completedSteps:[...prev?.completedSteps,0]
                          //     };
                          //   // eslint-disable-next-line no-else-return
                          //   } else {
                          //     return { ...prev, completedSteps:[0]
                          //     };
                          //   }
                          // });
                          break;
                        case 1:
                          courseDetailsForm.submit();
                          // setLoadingForForms(true);
                          // setAllValues((prev) => {
                          //   if (prev?.completedSteps?.lenght > 0) {
                          //     return { ...prev, completedSteps:[...prev?.completedSteps,1]
                          //     };
                          //   // eslint-disable-next-line no-else-return
                          //   } else {
                          //     return { ...prev, completedSteps:[1]
                          //     };
                          //   }
                          // });
                          // setAllValues((prev) => {
                          //   return { ...prev, completedSteps:[0,1]};
                          // });
                          break;
                        case 2:
                          feesDetailsForm.submit();
                          // setLoadingForForms(true);
                          // setAllValues((prev) => {
                          //   if (prev?.completedSteps?.lenght > 0) {
                          //     return { ...prev, completedSteps:[...prev?.completedSteps,2]
                          //     };
                          //   // eslint-disable-next-line no-else-return
                          //   } else {
                          //     return { ...prev, completedSteps:[2]
                          //     };
                          //   }
                          // });
                          // setAllValues((prev) => {
                          //   return { ...prev, completedSteps:[0,1,2]};
                          // });
                          break;
                        case 3:
                          studentReferencesForm.submit();
                          // setLoadingForForms(true);
                          // setAllValues((prev) => {
                          //   if (prev?.completedSteps?.lenght > 0) {
                          //     return { ...prev, completedSteps:[...prev?.completedSteps,3]
                          //     };
                          //   // eslint-disable-next-line no-else-return
                          //   } else {
                          //     return { ...prev, completedSteps:[3]
                          //     };
                          //   }
                          // });
                          // setAllValues((prev) => {
                          //   return { ...prev, completedSteps:[0,1,2,3]};
                          // });
                          break;
                        case 4:
                          parentDetailsForm.submit();
                          // setLoadingForForms(true);
                          // setAllValues((prev) => {
                          //   if (prev?.completedSteps?.lenght > 0) {
                          //     return { ...prev, completedSteps:[...prev?.completedSteps,4]
                          //     };
                          //   // eslint-disable-next-line no-else-return
                          //   } else {
                          //     return { ...prev, completedSteps:[4]
                          //     };
                          //   }
                          // });
                          // setAllValues((prev) => {
                          //   return { ...prev, completedSteps:[0,1,2,3,4]};
                          // });
                          break;
                        case 5:
                          uploadDocumentForm.validateFields().then(() => {
                            uploadDocumentForm.submit();
                            // setLoadingForForms(true);
                            // setAllValues((prev) => {
                            //   if (prev?.completedSteps?.lenght > 0) {
                            //     return { ...prev, completedSteps:[...prev?.completedSteps,5]
                            //     };
                            //   // eslint-disable-next-line no-else-return
                            //   } else {
                            //     return { ...prev, completedSteps:[5]
                            //     };
                            //   }
                            // });
                            // setAllValues((prev) => {
                            //   return { ...prev, completedSteps:[0,1,2,3,4,5]};
                            // });
                          });
                          break;

                        default:
                          break;
                      }
                    }}
                    type="primary"
                    block
                    size="large"
                    loading={loadData}
                  >
                    {currentStepForStudent === 5 ? (
                      'Add student'
                    ) : (
                      <span>
                        Save & proceed <ArrowRightOutlined />
                      </span>
                    )}
                  </Button>
                </Col>
              </div>
            </Row>
          </div>
        </div>
      </FixedFooter>
    </Form.Provider>
  );
};

export default connect(({ leads, courses, loading }) => ({
  studentLeadData: leads?.leadData,
  allCourses: courses?.allCourses,
  loadData: loading.effects['student/addStudent'],
  studentLeadRecord: leads?.studentLeadRecord,
  getCoursesCategory: courses?.getCoursesCategory,
  loadingForGetLead: loading?.effects['leads/getStudentLeadData'],
}))(AddStudent);
