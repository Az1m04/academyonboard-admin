import Breadcrumbs from '@/components/BreadCrumbs';
import Page from '@/components/Page';
import React from 'react';
import { Form, Button } from 'antd';
import BranchProfileForm from './BranchProfileForm';
import { connect } from 'umi';
import FixedFooter from '@/components/FixedFooter';

const BranchProfile = () => {
  const { form } = Form.useForm();
  return (
    <div className="container mx-auto">
      <Page
        title="Branch Profile"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'Branch Profile',
              },
            ]}
          />
        }
      >
        <Form
          form={form}
          onFinish={(val) => console.log(val)}
          hideRequiredMark
          autoComplete="off"
          name="addbranch"
        >
          <BranchProfileForm form={form} />
          <FixedFooter classes="text-right">
            <div className="container mx-auto">
              <div className="flex justify-end xl:mr-20 py-2 ">
                <Button type="primary" htmlType="submit">
                  Update Branch
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
}))(BranchProfile);
