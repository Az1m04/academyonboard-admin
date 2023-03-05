/* eslint-disable no-console */
import React, { useEffect } from 'react';
import Page from '@/components/Page';
import { connect } from 'umi';

const CourseDetails = (props) => {
  // const { form } = Form.useForm();
  useEffect(() => {
    props.dispatch({
      type: 'courses/getCourseDetails',
      payload: {
        pathParams: {
          courseId: props.match?.params?.courseId,
        },
      },
    });
  }, []);
  // const onFinish = (values) => {
  //   console.log(`Form values`, values);
  // };

  return (
    <Page title="Course details" PrevNextNeeded="N">
      {/* <Form form={form} onFinish={onFinish} hideRequiredMark autoComplete="off">
        <div>
          <AddCourses form={form} />
        </div>
        <FixedFooter classes="text-right">
          <div
            className="flex m-auto"
            style={{
              maxWidth: '80rem',
            }}
          >
            <div className="w-full ">
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Add course
                </Button>
              </Form.Item>
            </div>
          </div>
        </FixedFooter>
      </Form> */}
    </Page>
  );
};

export default connect()(CourseDetails);
