import PaymentModal from '@/components/PaymentModal';
import { Button, Popconfirm } from 'antd';
import Icon from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Calendar3Icon } from '@/utils/AppIcons';
import { connect, useParams } from 'umi';
import styles from './index.less';
import dayjs from 'dayjs';
import TruncateText from '@/components/TruncateText';

const Payments = ({ dispatch }) => {
  const [paymentVisible, setPaymentVisible] = useState(false);
  const { studentId } = useParams();
  const getPaymentStats = () => {
    dispatch({
      type: 'student/getPaymentStats',
      payload: {
        pathParams: {
          partyId: studentId,
        },
      },
    });
  };
  useEffect(() => {
    getPaymentStats();
  }, []);
  return (
    <div className="p-4">
      <div className="text-right m-3">
        <Button
          type="primary"
          onClick={() => {
            setPaymentVisible(true);
          }}
        >
          Receive payment
        </Button>
      </div>
      <PaymentModal showModal={paymentVisible} setShowModal={setPaymentVisible} />
      <div>
        {[1, 2, 3, 4]?.map((history) => (
          <div className={`m-2 rounded shadow ${styles.PaymentWrapper}`} key={history}>
            <div className=" p-2 flex justify-between">
              <div className="text-2xl p-2" style={{ color: '#0d6efd' }}>
                {Calendar3Icon()}
                {/* Beginning date month short code */}
                <div className="text-sm font-medium uppercase">
                  {dayjs().format('MMM D, YYYY')?.substring(0, 3)}
                </div>
              </div>

              <div className="flex-auto w-full border-l ml-1 pl-2">
                <div className="flex justify-between w-full mb-2">
                  <div>
                    <div className="text-lg text-blue-800 font-semibold cursor-pointer">
                      Received by Amit mathur{' '}
                    </div>
                    <p className="flex text-sm">
                      <div className="text-gray-600 text-xs">
                        <span className="font-medium text-gray-900">454511</span> Paid via
                        <span className="inline-block rounded-full text-white px-2 text-xs font-bold ml-2 bg-purple-600">
                          cash
                        </span>
                        <span className="text-gray-700 font-medium text-sm text-center px-2">
                          <Icon type="clock-circle" /> {dayjs().format('MMM D, YYYY h:mm A')}
                        </span>
                      </div>
                    </p>

                    <div className="text-gray-600 font-medium text-sm pt-1">
                      Request Taker Email: amit.mathur@simbaquartz.com
                    </div>
                    <TruncateText buttonPosition="right" className="text-xs font-medium" lines="2">
                      Lorem ipsum dolor sit amet, consectetur adipis.....
                    </TruncateText>
                  </div>
                  <div>
                    <div className={`flex  text-xs text-right ${styles.PaymentButton}`}>
                      <div onClick={() => {}} className="text-blue-600 cursor-pointer ">
                        {' '}
                        <span>
                          <span>
                            <Icon type="edit" />
                          </span>
                          <span> Edit </span>
                        </span>{' '}
                      </div>
                      <div className="text-red-600 pl-2 cursor-pointer">
                        <Popconfirm
                          title="Are you sure you want to delete this payment"
                          onConfirm={() => {}}
                          okText="Delete"
                          okType="danger"
                          cancelText="Cancel"
                        >
                          <span>
                            <span>
                              <Icon type="delete" />
                            </span>
                            <span> Delete </span>
                          </span>{' '}
                        </Popconfirm>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 text-xl text-center px-2 my-1">
                      $1789
                    </div>
                    <div className="text-right pr-2">
                      <span className="inline-block rounded-full text-gray-700 px-2 text-xs font-medium ml-2 bg-gray-400">
                        Received
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect(({ student }) => ({
  studentRecord: student.studentRecord,
}))(Payments);
