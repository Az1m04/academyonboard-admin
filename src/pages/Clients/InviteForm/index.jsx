/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { Form, Button } from 'antd';
import Page from '@/components/Page';
import Address from '@/components/Address';
import Layout from '@/components/Structure/Layout';
import Card from '@/components/Structure/Card';
import FixedFooter from '@/components/FixedFooter';
import { connect } from 'dva';
// import AddressForm from '@/pages/Customers/OnBoradCustomer/AddressForm';
import BasicDetailsForm from './BasicDetailsForm';

const InviteForm = () => {
  const [form] = Form.useForm();
  const finalInvitation = (values) => {
    console.log(values);
  };
  const [selectedCountry, setSelectedCountry] = useState('IN');
  return (
    <div>
      <Page
        title="Invite client"
        PrevNextNeeded="N"
        subTitle={
          <div className="text-sm text-gray-800 font-normal">Invite your clients here.</div>
        }
      >
        <Form form={form} onFinish={finalInvitation} hideRequiredMark autoComplete="off">
          <div className="mb-8">
            <Layout>
              <Layout.AnnotatedSection
                title={<div className="text-xl text-gray-800 font-semibold">Basic details</div>}
                description="Add basic details like company name, email id and reference details in
                order to invite client."
              >
                <Card>
                  <Card.Section>
                    <BasicDetailsForm form={form} />
                  </Card.Section>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
            <Layout>
              <Layout.AnnotatedSection
                title={<div className="text-xl text-gray-800 font-semibold">Address details</div>}
                description="Add address details like street, province and PIN code in
                order to invite client."
              >
                <Card>
                  <Card.Section>
                    <Address
                      mainHeading="Street/Village"
                      secondaryHeadingVisibility={false}
                      pinCodeHeading="PIN code"
                      stateHeading="Province"
                      selectedCountry={selectedCountry}
                      setSelectedCountry={setSelectedCountry}
                      type="address"
                      form={form}
                    />
                  </Card.Section>
                </Card>
              </Layout.AnnotatedSection>
            </Layout>
          </div>
          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '80rem',
              }}
            >
              <div className=" w-full">
                <Button type="primary" htmlType="submit" className="capitalize" size="large">
                  Invite Client
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Form>
      </Page>
    </div>
  );
};

export default connect(() => ({}))(InviteForm);
