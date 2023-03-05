import { Button, Form, Row, Col, message, Popconfirm, Input } from 'antd';

import { connect, history, useParams } from 'umi';
import React, { useEffect } from 'react';

import { currencyFormatter, currencyParser, decodeDollarsToDigits } from '@/utils/utils';
import { QuestionCircleOutlined } from '@ant-design/icons';

const WithdrawCourse = ({ dispatch, idx, setShowDrawer, showDrawer, coursePaidFee }) => {
  const [form] = Form.useForm();
  const { studentId } = useParams();

  useEffect(() => {
    if (idx)
      form.setFieldsValue({
        course: coursePaidFee?.name,
        amountPaid: currencyFormatter?.format(
          coursePaidFee?.amountPaid ? coursePaidFee?.amountPaid : '0',
        ),
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCommentFinish = (value) => {
    const body = {
      courseStatus: 'PRTYASGN_WITHDRAW',
      remarks: value?.remarks,

      amount: parseFloat(decodeDollarsToDigits(value?.amount)),
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
      }
    });
  };

  return (
    <div>
      <Form form={form} onFinish={onCommentFinish} hideRequiredMark autoComplete="off">
        <Row gutter={16}>
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
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
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Amount paid</p>
            <Form.Item name="amountPaid">
              <Input
                disabled
                bordered={false}
                className="text-right"
                size="middle"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xl={12} md={12} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Refund amount</p>
            <Form.Item
              name="amount"
              rules={[
                {
                  required: true,
                  message: 'Please select the refund amount',
                },
              ]}
            >
              <Input
                size="medium"
                onFocus={(e) => e.target.select()}
                placeholder="₹0.00"
                autoComplete="off"
                className="text-right"
                onBlur={(event) => {
                  let i = 0;
                  let res = event.target.value
                    // replace the dots with empty string if value contains more than one dot
                    // leave first decimal
                    .replace(/\./g, () => {
                      i += 1;
                      return i >= 2 ? '' : '.';
                    })
                    // replace the commas too with empty string if have any
                    .replace(/,/g, '');
                  let mod;
                  if (res) {
                    res = res[0] === '₹' ? res.substring(1, res.length).trim() : res;
                    mod = Number(res).toFixed(2);
                  } else {
                    mod = event.target.value;
                  }

                  form.setFieldsValue({
                    amount: currencyFormatter.format(currencyParser(mod)),
                  });
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={24} xl={24} md={24} sm={24} xs={24}>
            <p className="font-medium text-gray-800">Reason for withdrawing </p>
            <Form.Item
              name="remarks"
              rules={[
                {
                  required: true,
                  message: 'Please enter withdrawal reason ',
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
          <Popconfirm
            title="Are you sure want to withdraw this course？"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => {
              form.submit();
            }}
            okText="Yes"
            cancelText="No"
          >
            <div className="flex items-center cursor-pointer ">
              <Button type="primary" size="large">
                Withdraw
              </Button>
            </div>
          </Popconfirm>
        </div>
      </div>
    </div>
  );
};

export default connect(({ student, user }) => ({
  studentDetails: student?.studentDetails,
  getStudentCourses: student?.getStudentCourses,
  currentUser: user.currentUser,
}))(WithdrawCourse);
