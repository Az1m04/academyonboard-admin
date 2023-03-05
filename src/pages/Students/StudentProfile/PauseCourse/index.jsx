import { Button, Form, Row, Col, message, Input } from 'antd';

import { connect, history, useParams } from 'umi';
import React from 'react';

const PauseCourse = ({ dispatch, idx, setShowDrawer, showDrawer }) => {
  const [form] = Form.useForm();
  const { studentId } = useParams();

  const onCommentFinish = (value) => {
    const body = {
      courseStatus: 'PRTYASGN_PAUSE',
      remarks: value?.remarks,
    };
    dispatch({
      type: 'student/withdrawCourse',
      payload: {
        body,
        pathParams: { studentId, courseId: idx },
      },
    }).then((res) => {
      if (res?.status === 'ok') {
        message.success('Course withdrew successfully');
        history.push(`/students/${studentId}`);
      } else {
        console.log(res, 'RESSA');
      }
    });
  };

  return (
    <div>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
        <Row gutter={16}>
          {/* <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Course</p>
            <Form.Item
              name="course"
              rules={[
                {
                  required: true,
                  message: 'Please select the course category',
                },
              ]}
            >
              <Input
                size="middle"
                placeholder={'Please select the course'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col> */}

          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <span className="font-medium text-gray-800">Remarks</span>
            <Form.Item
              name="remarks"
              rules={[
                {
                  required: true,
                  message: 'Please enter remark ',
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div className="flex justify-end ">
        <div className="">
          <Button
            size="large"
            onClick={() => {
              setShowDrawer(!showDrawer);
              if (!idx) form.resetFields();
            }}
            className="mr-4"
          >
            Cancel
          </Button>
        </div>
        <div className="">
          <div className="flex items-center cursor-pointer ">
            <Button
              type="primary"
              size="large"
              onClick={() => {
                form.submit();
              }}
            >
              Pause course
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(({ student, user }) => ({
  studentDetails: student?.studentDetails,
  getStudentCourses: student?.getStudentCourses,
  currentUser: user.currentUser,
}))(PauseCourse);
