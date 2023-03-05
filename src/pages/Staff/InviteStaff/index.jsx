import React, { useState } from 'react';
import Page from '@/components/Page';
import Card from '@/components/Structure/Card';
import FixedFooter from '@/components/FixedFooter';
import Address from '@/components/Address';
import { Button, Divider, Form, message } from 'antd';
import BasicDetails from './BasicDetails';
import { connect } from 'umi';
import Qualification from './Qualification';
import OtherQualification from './OtherQualification';
import Experience from './Experience';
import EmergencyContact from './EmergencyContact';
import JobInformation from './JobInformation';
import UploadInfo from './UploadInfo';
import { decodeDollarsToDigits, getPhoneObject } from '@/utils/utils';
import Breadcrumbs from '@/components/BreadCrumbs';
import BankDetails from './BankDetails';

const InviteStaff = ({ loading, dispatch, departmentList, history, currentUser }) => {
  const [contents, setContents] = useState([]);
  const [form] = Form.useForm();
  const [changedField, setChangedField] = useState(null);
  const [selectedDepartment, setselectedDepartment] = useState();
  const [onCountryChange, setOnCountryChange] = useState('');

  const createDepartment = (department) =>
    dispatch({
      type: 'staff/createDepartment',
      payload: {
        body: {
          name: department,
          companyId: currentUser?.personalDetails?.organizationDetails?.orgPartyGroupId,
        },
      },
    }).catch(() => {});

  const onFinish = async (values) => {
    const guardian = {
      ...values?.guardian,
      primaryPhone: getPhoneObject(
        values?.guardian?.primaryPhone?.phone,
        values?.guardian?.primaryPhone?.countryCode,
      ),
    };
    // const phone = getPhoneObject(values?.phone?.phone, values?.phone?.countryCode);

    const attributes =
      values?.certifications?.examScore !== undefined
        ? Object?.keys(values?.certifications?.examScore)?.map((item) => {
            return {
              attributeName: item,
              attributeValue: Number(values?.certifications?.examScore[item]),
            };
          })
        : [];

    let certifications = [];
    if (values?.certifications?.qualificationName && values?.certifications?.fromDate) {
      certifications = certifications.concat({
        ...values?.certifications,
        typeId: 'CERTIFICATION',
        fromDate: values?.certifications?.fromDate?.toISOString(),
        attributes,
      });
    }

    const qualifications = values?.qualifications?.map((val) => ({
      ...val,
      typeId: 'DEGREE',
      fromDate: val?.fromDate?.toISOString(),
    }));

    const salary = [];
    if (values?.jobInformation?.salary?.amount) {
      salary.push({
        ...values?.jobInformation?.salary,
        amount: decodeDollarsToDigits(values?.jobInformation?.salary?.amount),
        salaryTypeId: 'BASIC',
      });
    }
    if (values?.jobInformation?.incentive?.amount) {
      salary.push({
        ...values?.jobInformation?.incentive,
        salaryTypeId: 'INCENTIVE',
      });
    }
    if (values?.jobInformation?.allowance?.length > 0) {
      salary.push(...values?.jobInformation?.allowance);
    }
    let employmentDurations = [];
    if (values?.jobInformation?.startTime && values?.jobInformation?.endTime) {
      employmentDurations = employmentDurations.concat({
        startTime: values?.jobInformation?.startTime?.toISOString(),
        endTime: values?.jobInformation?.endTime?.toISOString(),
      });
    }
    if (
      values?.jobInformation?.flexiTime?.startTime &&
      values?.jobInformation?.flexiTime?.endTime
    ) {
      employmentDurations = employmentDurations.concat({
        startTime: values?.jobInformation?.flexiTime?.startTime?.toISOString(),
        endTime: values?.jobInformation?.flexiTime?.endTime?.toISOString(),
      });
    }
    const bankDetail = {
      bankName: values?.bankName,
      accountNum: values?.accountNumber,
      ifscCode: values?.ifscCode,
    };
    const jobInformation = {
      ...values?.jobInformation,
      startDate: values?.jobInformation?.startDate?.toISOString(),
      department: {
        id: selectedDepartment,
      },

      phone: getPhoneObject(
        values?.jobInformation?.phone?.phone,
        values?.jobInformation?.phone?.countryCode,
      ),
      employmentDurations,
      salary,
    };

    const body = {
      ...values,
      dob: values?.dob && values?.dob?.toISOString(),
      guardian,
      certifications,
      address: { ...values.address },
      qualifications,
      bankDetail,
      experiences: values?.experiences?.map((experience) => ({
        ...experience,
        fromDate: experience?.fromDate?.toISOString(),
        thruDate: experience?.thruDate?.toISOString(),
        salary: experience?.salary ? decodeDollarsToDigits(experience?.salary) : undefined,
      })),

      jobInformation,
      contents,
    };

    // check if there is otherqualification
    if (values?.otherQualification?.length > 0) {
      body.otherQualification = values?.otherQualification?.map((data) => ({
        ...data,
        fromDate: data?.fromDate?.toISOString(),
      }));
    } else {
      delete body.otherQualifications;
    }

    // checking if user have entered new department
    if (
      !values?.jobInformation?.department?.id ||
      departmentList?.records?.find((data) => data?.id === values?.jobInformation?.department?.id)
        ?.name !== values?.departmentInput
    ) {
      try {
        const department = await createDepartment(values?.jobInformation?.department?.id);

        body.jobInformation.department = { id: department?.departmentId };
        delete body.departmentInput;
      } catch (error) {
        // log error silently
      }
    }
    delete body.departmentInput;
    if (values?.phone?.phone) {
      body.phone = getPhoneObject(values?.phone?.phone, values?.phone?.countryCode);
    } else {
      delete body.phone;
    }
    if (values?.alternatePhone?.phone) {
      body.alternatePhone = getPhoneObject(
        values?.alternatePhone?.phone,
        values?.alternatePhone?.countryCode,
      );
    } else {
      delete body.alternatePhone;
    }
    if (values?.emergencyContact?.primaryPhone?.phone) {
      body.emergencyContact = {
        ...values?.emergencyContact,
        primaryPhone: getPhoneObject(
          values?.emergencyContact?.primaryPhone?.phone,
          values?.emergencyContact?.primaryPhone?.countryCode,
        ),
      };
    }
    dispatch({
      type: 'staff/addStaff',
      payload: {
        body: [body],
      },
    })
      .then((res) => {
        if (res) {
          message.success('Staff invited successfully.');
          history.push('/staff/list/all');
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <div className="container mx-auto">
        <Page
          title="Invite staff"
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'All staff',
                  path: '/staff/list/all',
                },
                { path: '#', name: 'new' },
              ]}
            />
          }
        >
          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={(changedValue, allValues) => {
              setChangedField(allValues);
            }}
            scrollToFirstError
            initialValues={{
              prefix: 'Mr',
              maritalStatus: 'UNMARRIED',
              gender: 'MALE',
              qualifications: [null],
              experiences: [null],
              otherQualifications: [null],
            }}
          >
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Basic details</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <BasicDetails form={form} />
              </Card.Section>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Address details</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <Address
                  form={form}
                  mainHeading="Street/Village"
                  secondaryHeadingVisibility={false}
                  type="address"
                  pinCodeHeading="PIN code"
                  stateHeading="Province"
                  onCountryChange={onCountryChange}
                  setOnCountryChange={setOnCountryChange}
                />
              </Card.Section>
            </Card>{' '}
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Emergency contact</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <EmergencyContact form={form} />
              </Card.Section>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Bank Details</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <BankDetails form={form} />
              </Card.Section>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Qualification</h2>

              <Card className="mb-4">
                <Qualification form={form} />
              </Card>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Other qualification</h2>

              <Card>
                <OtherQualification form={form} />
              </Card>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Experience</h2>
              <Card>
                <Experience form={form} />
              </Card>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Job information</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <JobInformation
                  form={form}
                  changedField={changedField}
                  setselectedDepartment={setselectedDepartment}
                  selectedDepartment={selectedDepartment}
                />
              </Card.Section>
            </Card>
            <Card>
              <h2 className="p-5 text-xl font-semibold text-gray-800">Upload</h2>
              <Divider style={{ marginTop: '0' }} />
              <Card.Section>
                <UploadInfo form={form} setContents={setContents} contents={contents} />
              </Card.Section>
            </Card>
            <FixedFooter classes="text-right">
              <div
                className="flex m-auto"
                style={{
                  maxWidth: '80rem',
                }}
              >
                <div className="w-full ">
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={() => {
                      form.submit();
                    }}
                    size="large"
                  >
                    Invite staff
                  </Button>
                </div>
              </div>
            </FixedFooter>
          </Form>
        </Page>
      </div>
    </>
  );
};

export default connect(({ loading, staff, user }) => ({
  departmentList: staff.departmentList,
  currentUser: user.currentUser,
  loading: loading.effects['staff/addStaff'],
}))(InviteStaff);
