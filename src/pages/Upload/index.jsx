import Page from '@/components/Page';
import { Button } from 'antd';
import React from 'react';
import { Link } from 'umi';
import Breadcrumbs from '@/components/BreadCrumbs';
import UploadCourseContent from '@/components/UploadCourseContent';

const Upload = () => {
  return (
    <Page
      title="Upload"
      primaryAction={
        <Link to="/upload/course-content/new">
          <Button type="primary">Upload course content</Button>
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
              name: 'Upload',
              path: '#',
            },
          ]}
        />
      }
    >
      <UploadCourseContent />
    </Page>
  );
};

export default Upload;
