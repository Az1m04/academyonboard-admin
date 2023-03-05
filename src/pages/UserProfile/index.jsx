import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import Page from '@/components/Page';
import React from 'react';
import BasicDetailsForm from './BasicDetailsForm';
import { connect } from 'umi';
import VendorDetailsForm from './VendorDetailsForm';

const UserProfile = () => {
  return (
    <div className="container mx-auto">
      <Page
        title="Profile"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Profile',
                path: '/profile',
              },
            ]}
          />
        }
      >
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Your details</div>
              <div className="text-gray-600">
                <p className="mt-4">Fill your details like name, phone and upload your picture.</p>
              </div>
            </div>
          }
          rightContent={<BasicDetailsForm />}
        />
        <CardSection
          className="mt-4"
          leftContent={
            <div className="pr-8 ">
              <div className="text-blue-900 font-semibold text-xl">Company address </div>
              <div className="text-gray-600">
                <p className="mt-4">Enter your company address here.</p>
              </div>
            </div>
          }
          rightContent={<VendorDetailsForm />}
        />
      </Page>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(UserProfile);
