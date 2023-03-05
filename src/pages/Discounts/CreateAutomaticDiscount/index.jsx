import Breadcrumbs from '@/components/BreadCrumbs';
import CardSection from '@/components/CardSection';
import FixedFooter from '@/components/FixedFooter';
import Page from '@/components/Page';
import { Button, Form } from 'antd';
import React from 'react';
import { connect } from 'umi';
import AutomaticDiscountForm from './AutomaticDiscountForm';
// import DiscountCodeForm from './DiscountCodeForm';

const CreateAutomaticDiscount = () => {
  const [form] = Form.useForm();
  return (
    <div className="container mx-auto">
      <Page
        title="New collection"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Discounts',
                path: '/discounts',
              },
              {
                name: 'Create automatic discount',
                path: '/discounts/automatic/new',
              },
            ]}
          />
        }
      >
        <Form form={form} hideRequiredMark layout="vertical" colon={false} onFinish={() => {}}>
          <CardSection
            className="mt-4"
            leftContent={
              <div className="pr-8 ">
                <div className="text-blue-900 font-semibold text-xl">Basic Details</div>
                <div className="text-gray-600">
                  <p className="mt-2">Enter basic details of collections.</p>
                </div>
              </div>
            }
            rightContent={<AutomaticDiscountForm form={form} />}
          />

          <FixedFooter classes="text-right">
            <div
              className="flex m-auto"
              style={{
                maxWidth: '68rem',
              }}
            >
              <div className="w-full">
                <Button type="primary" htmlType="submit" className="capitalize" size="large">
                  Save
                </Button>
              </div>
            </div>
          </FixedFooter>
        </Form>
      </Page>
    </div>
  );
};

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(CreateAutomaticDiscount);
