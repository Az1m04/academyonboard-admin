import React, { useState } from 'react';
import Page from '@/components/Page';
import { Form, Button, Divider, message, Spin } from 'antd';
// import Address from '@/components/Address';
import { connect, useParams } from 'umi';
import BasicDetailsInviteClient from '../BasicDetailsInviteClient';
import BusinessDetails from './BusinessDetails';
import ServiceInformation from './ServiceInformation';
import FixedFooter from '@/components/FixedFooter';
import Breadcrumbs from '@/components/BreadCrumbs';

const InviteClientForm = ({ dispatch, loadData, history, singleLoading, loading }) => {
  const [form] = Form.useForm();
  const [contents, setContents] = useState([]);
  const [onCountryChange, setOnCountryChange] = useState('IN');
  const [type, setType] = useState();
  const { clientId } = useParams();
  const [singleClientLeadData, setSingleClientLeadData] = useState();

  const onFinish = (values) => {
    const data = values;
    data.primaryPhone.areaCode = data?.primaryPhone?.phone?.slice(0, 3);
    data.primaryPhone.phone = data?.primaryPhone?.phone?.slice(
      3,
      data?.primaryPhone?.phone?.length,
    );
    data.purpose = data?.assignAccess;
    data.clientPoc = {
      prefix: data?.salutation,
      firstName: data?.firstName,
      middleName: data?.middleName,
      lastName: data?.lastName,
      primaryEmail: data?.clientPrimaryEmail,
      reference: data?.referredBy,
      address: data?.address,
      id: singleClientLeadData?.id,
    };
    data.clientPoc.referredBy = {
      id: data?.leadReferencedBy?.id,
    };
    if (data?.alternatePhone?.phone) {
      data.clientPoc.alternatePhone = {
        areaCode: data?.alternatePhone?.phone?.slice(0, 3),
        phone: data?.alternatePhone?.phone?.slice(3, data?.alternatePhone?.phone?.length),
        countryCode: data?.alternatePhone?.countryCode,
        id: singleClientLeadData?.personContactDetails?.alternatePhone?.contactMechId,
      };
    } else {
      delete data?.alternatePhone;
    }

    data.clientPoc.primaryPhone = {
      areaCode: data?.clientPrimaryPhone?.phone?.slice(0, 3),
      phone: data?.clientPrimaryPhone?.phone?.slice(3, data?.clientPrimaryPhone?.phone?.length),
      countryCode: data?.clientPrimaryPhone?.countryCode,
      id: singleClientLeadData?.personContactDetails?.partyTelecom?.contactMechId,
    };
    data.clientPoc.lookingFor = [data?.lookingFor];

    data.bankDetail = {
      bankName: data?.bankName,
      accountNum: data?.accountNumber,
      ifscCode: data?.ifscCode,
      gstNum: data?.gstNumber,
      panCard: data?.panNumber,
    };
    data.bankDetail.contents = [...contents];
    delete data.lookingFor;
    delete data.address;
    delete data.leadReferencedBy;
    delete data.referredBy;

    if (data) {
      dispatch({
        type: 'leads/uploadClientLead',
        payload: {
          pathParams: { leadId: singleClientLeadData?.company?.id },
          body: data,
        },
      }).then((res) => {
        if (res?.status === 'okk') {
          message.success('Client invited successfully');
          history.push('/clients/active');
          form.resetFields();
        }
        if (res?.data?.message?.includes('exists')) {
          message.error('client with same email is already exists please enter different email');
        }
      });
    }
  };

  return (
    <div className="mt-8 ">
      <Page
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All clients',
                path: '/clients/all',
              },
              { path: '#', name: 'new' },
            ]}
          />
        }
        getPopupContainer={(node) => node.parentNode}
        title="Invite client"
        PrevNextNeeded="N"
      >
        <Spin spinning={Boolean(loading || singleLoading)}>
          <Form
            form={form}
            onFinish={onFinish}
            hideRequiredMark
            autoComplete="off"
            name="InviteClientForm"
          >
            <div className="">
              <BasicDetailsInviteClient
                form={form}
                type={type}
                setType={setType}
                onCountryChange={onCountryChange}
                setOnCountryChange={setOnCountryChange}
                setSingleClientLeadData={setSingleClientLeadData}
              />
              {/* <div className="bg-white rounded-lg mb-5 shadow">
              <p className="text-base text-gray-800 font-semibold px-5 pt-5">Address details</p>
              <Divider />
              <div className="px-5 pb-3">
                <Address
                  form={form}
                  mainHeading="Street/Village (Optional)"
                  type={'address'}
                  pinCodeHeading="PIN code (Optional)"
                  onCountryChange={onCountryChange}
                  setOnCountryChange={setOnCountryChange}
                />
              </div>
            </div> */}
              <div className="bg-white rounded-lg mb-5 shadow">
                <p className="text-base text-gray-800 font-semibold px-5 pt-5">Business details</p>
                <Divider />
                <div className="px-5 pb-3">
                  <BusinessDetails
                    form={form}
                    setContents={setContents}
                    contents={contents}
                    disabled={!clientId}
                    setSingleClientLeadData={setSingleClientLeadData}
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg mb-5 shadow">
                <p className="text-base text-gray-800 font-semibold px-5 pt-5">
                  Service information
                </p>
                <Divider />
                <div className="px-5 pb-3">
                  <ServiceInformation form={form} disabled={!clientId} />
                </div>
              </div>
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
                      onClick={() => form?.submit()}
                      size="large"
                      loading={loadData}
                    >
                      Invite client
                    </Button>
                  </div>
                </div>
              </FixedFooter>
            </div>
          </Form>
        </Spin>
      </Page>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadData: loading?.effects['leads/uploadClientLead'],
  loading: loading?.effects['leads/getClientLeadData'],
  singleLoading: loading?.effects['leads/getParticularStudentLeadData'],
}))(InviteClientForm);
