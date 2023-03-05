import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import { Form, Button, message } from 'antd';
import CompanyDetails from './CompanyDetails';
import PointOfContact from './PointOfContact';
import Reference from './Reference';
import FixedFooter from '@/components/FixedFooter';
import { connect, history, useParams } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';
import moment from 'moment';
import ClientLeadServicesModal from './ClientLeadServicesModal';

export const productList = [
  {
    name: 'Lead management',
    id: 'Lead management',
  },
  {
    name: 'School management',
    id: 'School management',
  },
  {
    name: 'Institute management',
    id: 'Institute management',
  },
  {
    name: 'Batch management',
    id: 'Batch management',
  },
  {
    name: 'Fee management',
    id: 'Fee management',
  },
  {
    name: 'Staff management',
    id: 'Staff management',
  },
  {
    name: 'Admission management',
    id: 'Admission management',
  },
  {
    name: 'Attendance management',
    id: 'Attendance management',
  },
  {
    name: 'Student visa management',
    id: 'Student visa management',
  },
  {
    name: 'Income management',
    id: 'Income management',
  },
  {
    name: 'Tuiton centre management',
    id: 'Tuiton centre management',
  },
  {
    name: 'Salary management',
    id: 'Salary management',
  },
];
export const getClientType = (key) => {
  switch (key) {
    case 'SCHOOL':
      return 'School';
    case 'COMPANY':
      return 'Company';
    case 'INSTITUTE':
      return 'Institute';
    case 'LANGUAGE_SCHOOL':
      return 'Language School';
    default:
      return '';
  }
};
const AddClientLead = ({
  dispatch,
  loadData,
  clientLeadRecord,
  staffList,
  getAllEnabledStudentList,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [optionRefChange, setOptionRefChange] = useState(false);
  const [sourceType, setSourceType] = useState();
  const [renderReferred, setRenderReferred] = useState();
  const [socialMediaReferred, setSocialMediaReferred] = useState();
  const [code, setCode] = useState('');
  const [type, setType] = useState();
  const [lookingFor, setLookingFor] = useState();
  const [form] = Form.useForm();
  const [onCountryChange, setOnCountryChange] = useState('IN');

  const { clientId } = useParams();

  useEffect(() => {
    if (clientId) {
      dispatch({
        type: 'leads/getParticularClientLeadData',
        payload: {
          query: { leadTypeId: 'LEAD_CUSTOMER' },
          pathParams: { leadId: clientId },
        },
      })
        .then((res) => {
          let clientData = { ...res };
          setType(getClientType(clientData?.company?.type));
          setOnCountryChange(res?.company?.primaryAddress?.countryGeoId);
          clientData = {
            ...clientData,
            company: {
              name: clientData?.company?.name,
              totalBranches: clientData?.company?.companyTotalBranches,
            },
            designation: res?.designation,
            primaryAddress: {
              ...clientData?.company?.primaryAddress,
              addressLine1: clientData?.company?.primaryAddress?.address1,
              stateCode: clientData?.company?.primaryAddress?.stateProvinceGeoId,
              countryCode: clientData?.company?.primaryAddress?.countryGeoId,
            },
            prefix: clientData?.personalTitle,
            primaryEmail: clientData?.email,
            lookingFor: clientData?.lookingFor?.map((purpose) => purpose.description),

            source: clientData?.leadDataSource?.sourceType,
            alternatePhone: {
              phone: `${clientData?.personContactDetails?.alternatePhone?.areaCode}${clientData?.personContactDetails?.alternatePhone?.contactNumber}`,
              countryCode: clientData?.personContactDetails?.alternatePhone?.countryCode,
            },
            phone: {
              phone:
                clientData?.personContactDetails?.partyTelecom &&
                `${clientData?.personContactDetails?.partyTelecom?.areaCode}${clientData?.personContactDetails?.partyTelecom?.contactNumber}`,
              countryCode:
                clientData?.personContactDetails?.partyTelecom &&
                clientData?.personContactDetails?.partyTelecom?.countryCode,
            },
            SocialMedia:
              clientData?.leadDataSource?.sourceType === 'Social Media'
                ? clientData?.leadDataSource?.description
                : undefined,
            onlineReference:
              clientData?.leadDataSource?.sourceType === 'Online'
                ? clientData?.leadDataSource?.description
                : undefined,
            offlineReference:
              clientData?.leadDataSource?.sourceType === 'Offline'
                ? clientData?.leadDataSource?.description
                : undefined,
            printedMedia:
              clientData?.leadDataSource?.sourceType !== undefined &&
              clientData?.leadDataSource?.description,
          };
          if (clientData?.leadDataSource?.sourceType)
            setSourceType(clientData?.leadDataSource?.sourceType);
          if (
            clientData?.leadDataSource?.description === 'Others' ||
            clientData?.leadDataSource?.description === 'Current Staff' ||
            clientData?.leadDataSource?.description === 'Old Staff' ||
            clientData?.leadDataSource?.description === 'Friend' ||
            clientData?.leadDataSource?.description === 'Current Student' ||
            clientData?.leadDataSource?.description === 'Old Student'
          ) {
            setRenderReferred(clientData?.leadDataSource?.description);
            clientData.referredBy = clientData?.leadDataSource?.description;
            clientData.leadReferencedBy = { id: clientData?.leadReference?.partyId };
          }
          if (
            clientData?.leadDataSource?.sourceType === 'Social Media' &&
            clientData?.leadDataSource?.description === 'Other Sources'
          ) {
            setSocialMediaReferred('Others');
          }
          if (res?.lookingFor?.length > 1) {
            clientData.lookingFor = 'Service And Software';
            setLookingFor('Service And Software');
            clientData.services = res?.lookingFor?.map((purpose) => purpose.description);
          }
          form.setFieldsValue(clientData);

          if (res?.leadDataSource?.dataSourceId === 'EMPLOYEE') {
            form.setFieldsValue({
              leadReferencedBy: { id: res?.leadReference?.partyId },
            });
            setOptionRefChange(true);
          }
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, clientId]);

  const getType = (key) => {
    switch (key) {
      case 'School':
        return 'SCHOOL';
      case 'Company':
        return 'COMPANY';
      case 'Institute':
        return 'INSTITUTE';
      case 'Language School':
        return 'LANGUAGE_SCHOOL';
      default:
        return '';
    }
  };
  const onFinish = (values) => {
    const data = {
      ...values,
      leadTypeId: 'LEAD_CUSTOMER',
      company: {
        ...values.company,
        type: getType(type),
        id: clientLeadRecord?.leadCompanyPartyId,
        primaryAddress: {
          id: clientLeadRecord?.company?.primaryAddress?.contactMechId,
          ...values?.primaryAddress,
        },
      },
      inquiryDate: moment()?.toISOString(),
      phone: {
        id: clientLeadRecord?.personContactDetails?.partyTelecom?.contactMechId,
        phone: values?.phone?.phone?.split('').slice(3).join(''),
        areaCode: values?.phone?.phone?.split('').slice(0, 3).join(''),
        countryCode: `+${code}`,
      },
      lookingFor: [values?.lookingFor],
      alternatePhone: {
        id: clientLeadRecord?.personContactDetails?.alternatePhone?.contactMechId,
        phone: values?.alternatePhone?.phone?.split('').slice(3).join(''),
        areaCode: values?.alternatePhone?.phone?.split('').slice(0, 3).join(''),
        countryCode: values?.alternatePhone?.countryCode,
      },
    };
    if (data?.printedMedia) {
      data.source = data?.printedMedia;
    }
    if (Array.isArray(data?.lookingFor[0])) {
      data.lookingFor = data?.lookingFor[0];
    }
    if (data?.onlineReference) {
      data.source = data?.onlineReference;
      delete data?.onlineReference;
    }
    if (data?.offlineReference) {
      data.source = data?.offlineReference;
      delete data?.offlineReference;
    }
    if (data?.SocialMedia) {
      data.source = data?.SocialMedia;
      delete data?.SocialMedia;
    }

    if (data?.referredBy) {
      data.source = data?.referredBy;
      delete data?.referredBy;
    }

    if (data.lookingFor?.find((i) => i === 'Service And Software')) {
      data.lookingFor = [...data.services];
      delete data?.services;
    }
    if (!clientId) {
      delete data?.company?.id;
      delete data?.company?.primaryAddress?.id;
      delete data?.alternatePhone?.id;
      delete data?.phone?.id;
    }
    if (clientId) {
      dispatch({
        type: 'leads/updateClientLead',
        payload: {
          body: data,
          pathParams: { clientID: clientId },
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          form.resetFields();
          history.push('/leads/client/leads/all');
          message.success('Client Lead updated successfully');
        } else {
          message.error('Something went wrong ');
        }
      });
      return;
    }

    if (data) {
      dispatch({
        type: 'leads/addClientLead',
        payload: {
          body: data,
        },
      }).then((res) => {
        if (res?.status === 'ok') {
          form.resetFields();
          history.push('/leads/client/leads/all');
          message?.success('Client Lead added successfully');
        } else if (res?.data?.message?.includes('exists')) {
          message.error('Lead with same email is already exists please enter different email');
        } else {
          message.error('Something went wrong. please check your details');
        }
      });
    }
  };

  return (
    <div className="mt-8 ">
      <Page
        title={clientId ? 'Edit client lead' : 'Add client lead'}
        PrevNextNeeded="N"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Leads',
                path: '/leads/clients-list/newleads',
              },
              {
                name: clientId ? clientLeadRecord?.companyName : 'new',
                path: '#',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          hideRequiredMark
          autoComplete="off"
          name="AddClientLead"
        >
          <div className="">
            <div className="pb-10">
              <CompanyDetails
                form={form}
                company={['company', 'name']}
                type={type}
                onCountryChange={onCountryChange}
                setOnCountryChange={setOnCountryChange}
              />

              <PointOfContact form={form} setCode={setCode} code={code} />

              <Reference
                dispatch={dispatch}
                totalBranches={['company', 'totalBranches']}
                lookingFor={lookingFor}
                setLookingFor={setLookingFor}
                form={form}
                optionRefChange={optionRefChange}
                setOptionRefChange={setOptionRefChange}
                staffList={staffList}
                sourceType={sourceType}
                setSourceType={setSourceType}
                renderReferred={renderReferred}
                setRenderReferred={setRenderReferred}
                socialMediaReferred={socialMediaReferred}
                setSocialMediaReferred={setSocialMediaReferred}
                getAllEnabledStudentList={getAllEnabledStudentList}
                productList={productList}
              />
            </div>
            {(!isModalVisible && !clientId) || clientId ? (
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
                      onClick={() => {
                        form?.submit();
                      }}
                      size="large"
                      loading={loadData}
                    >
                      {clientId ? 'Update client lead' : 'Add client lead'}
                    </Button>
                  </div>
                </div>
              </FixedFooter>
            ) : null}
          </div>
        </Form>
        <ClientLeadServicesModal
          visible={isModalVisible}
          setVisible={setIsModalVisible}
          type={type}
          setType={setType}
          form={form}
          lookingFor={lookingFor}
          setLookingFor={setLookingFor}
          productList={productList}
        />
      </Page>
    </div>
  );
};

export default connect(({ loading, leads, staff, student }) => ({
  loadData: loading.effects['leads/addClientLead'],
  clientLeadRecord: leads.clientLeadRecord,
  staffList: staff?.staffList,
  getAllEnabledStudentList: student?.getAllEnabledStudentList,
}))(AddClientLead);
