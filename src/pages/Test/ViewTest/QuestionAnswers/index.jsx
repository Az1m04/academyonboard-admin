import React from 'react';
import { Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const QuestionAnswers = ({ questionAnsValues }) => {
  return (
    <>
      <div className="bg-white rounded shadow">
        <div className="px-4 py-2 text-base font-semibold text-blue-900 border-b">
          Questions and answers
        </div>
        <div className="pt-1 ">
          <div style={{ padding: '20px' }}>
            {questionAnsValues?.length >= 1 ? (
              <Collapse
                className="p-5 mb-5"
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
              >
                {questionAnsValues.map((item, index) => {
                  const key = `${item?.categoryId + (index + 1)}`;

                  return (
                    <Panel
                      header={
                        <div className="px-4 text-base font-semibold text-blue-900">
                          {`${index + 1} : ${item?.name}`}
                        </div>
                      }
                      key={key}
                    >
                      <p className="mb-2 font-semibold">
                        Answer:
                        {item?.answers?.map((answer, i, arr) => (
                          <span
                            key=""
                            className="ml-2 font-semibold border rounded p-1 text-green-400"
                          >
                            {` ${answer?.value}${i < arr.length - 1 ? ',' : ''}`}
                          </span>
                        ))}
                      </p>

                      <div className="flex flex-wrap justify-between wrap">
                        <div>
                          <p className="font-semibold">
                            Option A:{' '}
                            <span className="font-semibold text-blue-800"> {item?.A?.option}</span>
                          </p>
                          {item?.A?.justification && (
                            <p className="mb-2 font-semibold">
                              Justification:{' '}
                              <span className="font-semibold text-blue-800">
                                {item?.A?.justification}
                              </span>
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            Option B:{' '}
                            <span className="font-semibold text-blue-800"> {item?.B?.option}</span>
                          </p>
                          {item?.B?.justification && (
                            <p className="mb-2 font-semibold">
                              Justification:{' '}
                              <span className="font-semibold text-blue-800">
                                {item?.B?.justification}
                              </span>
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            Option C:{' '}
                            <span className="font-semibold text-blue-800"> {item?.C?.option}</span>
                          </p>
                          {item?.C?.justification && (
                            <p className="mb-2 font-semibold">
                              Justification:{' '}
                              <span className="font-semibold text-blue-800">
                                {item?.C?.justification}
                              </span>
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            Option D:{' '}
                            <span className="font-semibold text-blue-800"> {item?.D?.option}</span>
                          </p>
                          {item?.D?.justification && (
                            <p className="mb-2 font-semibold">
                              Justification:{' '}
                              <span className="font-semibold text-blue-800">
                                {item?.D?.justification}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </Panel>
                  );
                })}
              </Collapse>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionAnswers;
