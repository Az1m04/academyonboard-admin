import moment from 'moment';
import { Select, DatePicker, Divider, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect, useParams, history } from 'umi';

const CommunicationalLogs = ({ dispatch, communicationalLogs, loadingCommunicationalLogs }) => {
  const { RangePicker } = DatePicker;
  const { studentId } = useParams();
  const { Option } = Select;
  const [selectedDate, setSelectedDate] = useState('');
  const [range, setRange] = useState([moment().subtract(7, 'day'), moment()]);

  const activityTimeList = [
    {
      label: 'Today',
      id: 'TODAY',
    },
    {
      label: 'Yesterday',
      id: 'YESTERDAY',
    },
    {
      label: 'Last 7 days',
      id: 'WEEK',
    },
    {
      label: 'Last 15 days',
      id: 'FORTNIGHT',
    },
    {
      label: 'Last 30 days',
      id: 'MONTH',
    },

    {
      label: 'Last month',
      id: 'LAST_MONTH',
    },
    {
      label: 'Custom',
      id: 'CUSTOM',
    },
  ];

  const getCommunicationalRecord = () => {
    const data = {};
    switch (selectedDate) {
      case 'TODAY':
        data.interval = 'TODAY';
        history.push('?interval=TODAY');
        break;
      case 'YESTERDAY':
        data.interval = 'YESTERDAY';
        history.push('?interval=YESTERDAY');
        break;
      case 'WEEK':
        data.interval = 'WEEK';
        history.push('?interval=Last-7-days');
        break;
      case 'FORTNIGHT':
        data.interval = 'FORTNIGHT';
        history.push('?interval=Last-15-days');
        break;
      case 'MONTH':
        data.interval = 'MONTH';
        history.push('?interval=Last-30-days');
        break;
      case 'LAST_MONTH':
        data.interval = 'LAST_MONTH';
        history.push('?interval=LAST-MONTH');
        break;
      case 'CUSTOM':
        history.push('?interval=CUSTOM');
        break;

      default:
        data.interval = '';
        history.push('?interval=TODAY');
        break;
    }

    const payload = {
      pathParams: { studentId },

      query: {
        ...data,
        startDate:
          selectedDate === 'CUSTOM' && range !== null ? range[0].format('YYYY-MM-DD HH:mm:ss') : '',
        endDate:
          selectedDate === 'CUSTOM' && range !== null ? range[1].format('YYYY-MM-DD HH:mm:ss') : '',
        viewSize: 1000,
      },
    };
    dispatch({
      type: 'student/getCommunicationalLogs',
      payload,
    });
  };

  useEffect(() => {
    getCommunicationalRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, range]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-blue-600 font-semibold text-lg">Communicational Logs</div>
        <div className="flex justify-between">
          <div className="flex justify-between">
            <div className={`mr-2`}>
              <Select
                style={{ width: '12rem', color: '#3B82F6' }}
                onChange={(value) => {
                  setSelectedDate(value);
                }}
                placeholder="select..."
                listHeight={400}
              >
                {activityTimeList?.map((item) => (
                  <Option
                    key={item?.id}
                    value={item?.id}
                    className={`bg-gray-100 rounded-lg mx-2 mt-2 `}
                    style={{ color: '#3B82F6' }}
                  >
                    {item?.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div>
              {selectedDate === 'CUSTOM' && (
                <RangePicker
                  value={range}
                  format="DD MMM, YYYY"
                  onChange={(val) => {
                    setRange(val);
                  }}
                  placeholder={['Search by', 'date']}
                  style={{ width: '12rem' }}
                  disabledDate={(date) => date > moment().add(1, 'day')}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Divider style={{ marginTop: '0.5rem', marginBottom: '0.8rem' }} />
      <div>
        <Spin spinning={Boolean(studentId) && loadingCommunicationalLogs}>
          <div className="my-4">
            <div className="text-gray-800 text-base font-semibold">SMS Summary</div>
            <div className="flex space-x-4">
              <div className="flex mt-2">
                <div className="bg-green-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center">
                      {' '}
                      {communicationalLogs?.smsLogs?.sent || 0}
                    </div>
                    <div className="flex justify-center items-center font-semibold">SMS Sent</div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-yellow-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center text-gray-500 font-semibold items-center">
                      {communicationalLogs?.smsLogs?.delivered || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      SMS Delivered
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-red-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center text-gray-500 font-semibold">
                      {communicationalLogs?.smsLogs?.failed || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      SMS Failed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            {' '}
            <div className="text-gray-800 text-base text-base font-semibold">Email Summary</div>
            <div className="flex space-x-4">
              <div className="flex mt-2">
                <div className="bg-green-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center text-gray-500 font-semibold">
                      {communicationalLogs?.emailLogs?.sent || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      E-mail Sent
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-yellow-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.emailLogs?.delivered || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      E-mail Delivered
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            {' '}
            <div className="text-gray-800 text-base text-base font-semibold ">Call Summary</div>
            <div className="flex space-x-4">
              <div className="flex mt-2">
                <div className="bg-green-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.callLogs?.total || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Total Calls
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-yellow-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.phoneLogs?.COM_ANSWERED || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Answered
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-red-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.phoneLogs?.notPicked || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Not picked
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-blue-500 h-full w-2 " />
                <div className="border">
                  <div className=" py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.phoneLogs?.notReachable || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Not reachable
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-blue-800 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.phoneLogs?.switchOff || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Switch off
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            {' '}
            <div className="text-gray-800 text-base text-base font-semibold">WhatsApp Summary</div>
            <div className="flex space-x-4">
              <div className="flex mt-2">
                <div className="bg-green-500 h-full w-2 " />
                <div className="border">
                  <div className=" py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.whatsappLogs?.sent || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Message Sent
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4">
            <div className="text-gray-800 text-base text-base font-semibold">Meeting Summary</div>
            <div className="flex space-x-4">
              <div className="flex mt-2">
                <div className="bg-green-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.meetingLogs?.fixed || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Meeting fixed
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-yellow-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.meetingLogs?.done || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Meeting done
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex mt-2">
                <div className="bg-red-500 h-full w-2 " />
                <div className="border">
                  <div className="py-4 w-52">
                    <div className="flex justify-center items-center  text-gray-500 font-semibold">
                      {communicationalLogs?.meetingLogs?.COM_MEETING_CANCELED || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Meeting canceled
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-blue-500 h-full w-2 " />
                <div className="border">
                  <div className=" py-4 w-52">
                    <div className="flex justify-center items-center text-gray-500 font-semibold">
                      {communicationalLogs?.meetingLogs?.notDone || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Meeting not done
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="bg-blue-800 h-full w-2 " />
                <div className="border">
                  <div className=" py-4 w-52">
                    <div className="flex justify-center items-center text-gray-500 font-semibold">
                      {communicationalLogs?.meetingLogs?.reschedule || 0}
                    </div>
                    <div className="flex justify-center items-center text-gray-700 font-semibold">
                      Meeting reschedule
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Spin>
      </div>
    </div>
  );
};

export default connect(({ student, loading }) => ({
  communicationalLogs: student?.communicationalLogs,
  loadingCommunicationalLogs: loading?.effects['student/getCommunicationalLogs'],
}))(CommunicationalLogs);
