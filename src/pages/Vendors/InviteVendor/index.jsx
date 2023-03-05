import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import Page from '@/components/Page';
import { Form, message } from 'antd';
import React from 'react';
import InviteVendorForm from './InviteVendorForm';
import { connect, history } from 'umi';

const InviteVendor = ({ dispatch }) => {
  const [form] = Form.useForm();

  return (
    <div className="container mx-auto">
      <Page
        title="Invite vendor"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Vendors',
                path: '/vendors',
              },
              {
                name: 'Invite',
                path: '/vendors/invite',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          hideRequiredMark
          layout="vertical"
          colon={false}
          onFinish={(values) => {
            const body = {
              title: values.title,
              firstName: values.firstName,
              middleName: values.middleName,
              lastName: values.lastName,
              email: values.email,
              role: values.role,
              phone: {
                phone: values.phone.phone.substring(3),
                countryCode: values.phone.countryCode,
                areaCode: values.phone.phone.substring(0, 3),
              },
            };

            dispatch({
              type: 'vendor/inviteVendor',
              payload: {
                body,
              },
            }).then((res) => {
              if (res) {
                message.success('Invitation sent successfully');
                history.push('/vendors/awaiting');
              }
            });
          }}
        >
          <CardSection
            noPadding
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Vendor details</div>
                <div className="text-gray-600">
                  <p className="mt-4">
                    Fill vendor details like name, phone, email and type of reference.
                  </p>
                  <p className="mt-4">An invitation will be send to example@gmail.com via email</p>
                </div>
              </div>
            }
            rightContent={<InviteVendorForm form={form} />}
          />
        </Form>
      </Page>
    </div>
  );
};

export default connect(null)(InviteVendor);
