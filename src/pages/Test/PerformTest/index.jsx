import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import AppIcons from '@/utils/AppIcons';
import { Radio, Space, Form, Pagination } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { connect, useParams, useLocation } from 'umi';

const PerformTest = ({ dispatch, testRecordById, history }) => {
  const [form] = useForm();
  const [currentQuestions, setCurrentQuestions] = useState(1);
  const { testId } = useParams();
  const {
    query: { question },
  } = useLocation();

  const createQuestion = (qs) => {
    const options = Object.keys(qs)?.filter((data) => data?.includes('option'));

    return options?.map((option, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <Radio key={`${idx}${qs[option]}`} value={qs[option]}>
        {qs[option]}
      </Radio>
    ));
  };

  useEffect(() => {
    dispatch({
      type: 'courses/getTestById',
      payload: { pathParams: { testId } },
    });
  }, [dispatch, testId]);

  useEffect(() => {
    setCurrentQuestions(Number(question) || 1);
  }, [question]);
  return (
    <Page
      title={
        <h1 className="text-xl font-semibold text-blue-900 capitalize">{testRecordById?.name}</h1>
      }
      subTitle={
        <div className="flex justify-between">
          <p className="text-sm font-normal text-gray-800">Assess your test here.</p>

          <div className="text-xl text-blue-900 font-bold flex items-center gap-2">
            <span>{AppIcons.ClockFill()}</span>
            <span>1 hr : 00 mins</span>
          </div>

          <div className="flex items-center gap-1 text-xl text-blue-900 font-bold">
            <p>Total Marks :</p>
            <p>{testRecordById?.totalMarks}</p>
          </div>
        </div>
      }
    >
      <div className="bg-white flex flex-col justify-between" style={{ minHeight: '65vh' }}>
        <div className="">
          <Form form={form} onFinish={null} onFinishFailed={null}>
            <div className=" flex py-8 ">
              <div className="h-full w-full py-5 ml-12 ">
                {/* <p className="text-xl  px-5    mb-0 py-3 px-4 font-bold ">{}</p> */}{' '}
                <p className="text-xl  px-5  text-blue-900 font-bold mb-0 bg-white p-4  ">
                  <span className="">{currentQuestions}.</span>{' '}
                  {testRecordById?.questions?.[currentQuestions - 1]?.name}
                </p>
                <div className=" px-9 py-2 ">
                  <Form.Item name="answer">
                    <Radio.Group>
                      <Space size="middle" direction="vertical">
                        {testRecordById?.questions?.[currentQuestions - 1] &&
                          createQuestion(testRecordById?.questions?.[currentQuestions - 1])}
                      </Space>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div className="flex justify-end pb-4 pr-4">
          <Pagination
            current={currentQuestions}
            onChange={(pageNo) => {
              history.push(`/tests/${testId}/perform?question=${pageNo}`);
            }}
            defaultPageSize={1}
            total={testRecordById?.questions?.length}
          />
        </div>
      </div>
    </Page>
  );
};

export default connect(({ courses }) => ({ testRecordById: courses.testRecordById }))(PerformTest);
