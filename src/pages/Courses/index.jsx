import Page from '@/components/Page';
import { Button } from 'antd';
import React from 'react';
import { Link } from 'umi';
import CoursesData from '@/components/CoursesData';
import Breadcrumbs from '@/components/BreadCrumbs';

const Courses = () => {
  return (
    <Page
      title="Courses"
      primaryAction={
        <Link to="/courses/new">
          <Button type="primary">Add course</Button>
        </Link>
      }
      breadcrumbs={
        <Breadcrumbs
          path={[
            {
              name: 'Dashboard',
              path: '/dashboard',
            },
            {
              name: 'All courses',
              path: '#',
            },
          ]}
        />
      }
    >
      <CoursesData />
    </Page>
  );
};

export default Courses;
