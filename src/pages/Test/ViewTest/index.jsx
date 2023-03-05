import React, { useState, useEffect } from 'react';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Row, Col, Button, notification } from 'antd';
import TestDetails from './TestDetails';
import QuestionAnswers from './QuestionAnswers';
import FixedFooter from '@/components/FixedFooter';
import { connect, Link } from 'umi';

const ViewTest = (props) => {
  const [questionAnsValues, setQuestionAnsValues] = useState([]);
  const [courseDetails, setCourseDetails] = useState(null);
  const [allTestDetails, setAllTestDetails] = useState(null);

  const {
    dispatch,
    match: {
      params: { testId },
    },
  } = props;

  useEffect(() => {
    if (testId) {
      dispatch({ type: 'courses/getTestById', payload: { pathParams: { testId } } })
        .then((res) => {
          if (res) {
            setAllTestDetails(res);
            dispatch({
              type: 'courses/getCourseDetails',
              payload: {
                pathParams: {
                  courseId: res?.course?.courseId,
                },
              },
            }).then((response) => {
              setCourseDetails(response);
            });

            setQuestionAnsValues(
              res?.questions?.map((rec) => ({
                ...rec,
                A: {
                  option: rec?.option1,

                  justification: rec?.answers?.filter((item) => item.value === rec.option1)[0]
                    ?.description,
                },
                B: {
                  option: rec?.option2,
                  justification: rec?.answers?.filter((item) => item.value === rec.option2)[0]
                    ?.description,
                },
                C: {
                  option: rec?.option3,
                  justification: rec?.answers?.filter((item) => item.value === rec.option3)[0]
                    ?.description,
                },
                D: {
                  option: rec?.option4,
                  justification: rec?.answers?.filter((item) => item.value === rec.option4)[0]
                    ?.description,
                },
              })),
            );
          }
        })
        .catch((err) => {
          notification.error({
            message: 'Oops Something went wrong!',
            description: err?.data?.message,
          });
        });
    }
  }, [testId]);
  return (
    <div className="container mx-auto">
      <Page
        title="View test"
        breadcrumbs={
          <Breadcrumbs
            path={[
              {
                name: 'Dashboard',
                path: '/dashboard',
              },
              {
                name: 'All tests',
                path: '/tests',
              },
              {
                name: 'View test',
                path: `/tests/${testId}/details`,
              },
            ]}
          />
        }
      >
        <div className="container mx-auto">
          <Row gutter={16} className="py-6">
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <TestDetails
                {...props}
                courseDetails={courseDetails}
                allTestDetails={allTestDetails}
              />
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <QuestionAnswers {...props} questionAnsValues={questionAnsValues} />
            </Col>
          </Row>
        </div>
        <FixedFooter classes="text-right">
          <div
            className="flex justify-end"
            style={{
              maxWidth: '95rem',
            }}
          >
            <Link to={`/tests/${testId}/edit`}>
              <Button type="primary">Update</Button>
            </Link>
            {/* <div className="w-full cursor-pointer">
              <Button type="primary" size="middle">
                Update
              </Button>
            </div> */}
          </div>
        </FixedFooter>
      </Page>
    </div>
  );
};

export default connect(({ loading }) => ({
  loading: loading.effects['courses/getCourseDetails'],
}))(ViewTest);
