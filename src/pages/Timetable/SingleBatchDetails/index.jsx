import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  GroupOutlined,
  Loading3QuartersOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { connect, history, useParams } from 'umi';
import {
  Button,
  Select,
  Table,
  Form,
  message,
  Row,
  Pagination,
  Popover,
  Calendar,
  Spin,
  Radio,
} from 'antd';
import CheckValidation from '@/components/CheckValidation';
import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons';
import customCalendarHeaderRenderer from '@/components/customCalendarHeaderRenderer';
import EmptyState from '@/components/EmptyState';
import styles from '../index.less';
import { CircleFill } from 'react-bootstrap-icons';

const SingleBatchDetails = ({
  dispatch,
  singleBatchSlot,
  BatchesDetails,
  trainersOfCurrentBatch,
  listloading,
  loading,
}) => {
  const [form] = Form.useForm();
  const { batchId, mode } = useParams();
  const [moduleId, setModuleId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [partyId, setPartyId] = useState();
  const [startIndex, setStartIndex] = useState(0);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [increaseDecrease, setIncreaseDecrease] = useState(0);
  const [dateFilter, setDateFilter] = useState(
    moment()
      .calendar()
      .replace(` at ${moment().format('LT')}`, ''),
  );
  const getTrainerAssignToBatch = (batch) =>
    dispatch({
      type: 'timetable/getTrainerAssignToBatch',
      payload: { pathParams: { batchId: batch } },
    }).catch(() => {});
  const getBatches = (filterByDate) => {
    dispatch({
      type: 'timetable/getBatches',
      payload: {
        query: {
          isFetchAll: true,
          filterByDate,
          modeId: mode?.toUpperCase() === 'ALL' ? '' : mode?.toUpperCase(),
        },
      },
    })
      .then((res) => {
        if (res?.batchList?.length > 0 && batchId === 'id') {
          form.setFieldsValue({ batchSelect: res?.batchList[0]?.id });
          history.push(
            `/timetable/batch/${(mode !== undefined && mode?.toLowerCase()) || 'all'}/${
              res?.batchList[0]?.id
            }`,
          );
        } else if (batchId !== 'id') {
          form.setFieldsValue({ batchSelect: batchId });
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong to get batches');
        }
      });
  };
  const getSingleBatch = (batch, module, staffId, filterByDate) => {
    dispatch({
      type: 'timetable/getBatchesModuleSlots',
      payload: { query: { filterByDate, batchId: batch, moduleId: module, staffId } },
    });
  };
  useEffect(() => {
    if (batchId !== 'id') {
      getSingleBatch(
        batchId,
        moduleId,
        partyId,
        moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss'),
      );
    }
  }, [batchId, moduleId, partyId, increaseDecrease]);
  useEffect(() => {
    if (batchId !== 'id') {
      getTrainerAssignToBatch(batchId);
    }
  }, [batchId]);
  useEffect(() => {
    if (increaseDecrease > -2) {
      setDateFilter(
        moment()
          .add(increaseDecrease, 'days')
          .calendar()
          .replace(` at ${moment().format('LT')}`, ''),
      );
    } else {
      setDateFilter(moment().add(increaseDecrease, 'days').format('L'));
    }
    getBatches(moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss'));
  }, [increaseDecrease, mode]);
  const columns = [
    {
      title: 'Sr.no.',
      dataIndex: 'srno',
      align: 'center',
      width: '5rem',
      render: (_, __, index) => (
        <p className="text-gray-900 font-medium capitalize m-0">
          {index + 1 + 10 * (currentPage - 1)}
        </p>
      ),
    },
    {
      title: 'From',
      dataIndex: 'startTime',
      key: 'startTime:',
      render: (text) => (
        <p className="m-0 text-gray-900 font-medium capitalize">
          {(text && moment(text)?.format('hh:mm A')) || '--'}
        </p>
      ),
    },
    {
      title: 'To',
      dataIndex: 'endTime',
      key: 'endTime:',
      render: (text) => (
        <p className="m-0 text-gray-900 font-medium capitalize">
          {(text && moment(text)?.format('hh:mm A')) || '--'}
        </p>
      ),
    },
    {
      title: 'Module name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p className="m-0 text-gray-900 font-medium capitalize">{text || '--'}</p>,
    },
    {
      title: 'Activity',
      dataIndex: 'activityType',
      key: 'activityType',
      render: (text) => <p className="m-0 text-gray-900 font-medium capitalize">{text || '--'}</p>,
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (text) => (
        <p className="m-0 text-gray-900 font-medium capitalize">{text?.displayName || '--'}</p>
      ),
    },
  ];
  function handleChangePagination(current, size) {
    setStartIndex(current * size - 10);
    setCurrentPage(current);
  }
  return (
    <Page
      title="Single batch timetable"
      primaryAction={
        <div className="flex  items-center">
          <div className="flex">
            <Radio.Group
              className={styles?.customRadioButtonDesign}
              size="middle"
              buttonStyle="solid"
              defaultValue=""
              value={(mode && mode?.toUpperCase()) || 'ALL'}
              onChange={(e) => {
                history.push(`/timetable/batch/${e.target.value?.toLocaleLowerCase()}/id`);
              }}
            >
              <Radio.Button value="ALL">
                <p className="font-medium m-0 tracking-wide">All</p>
              </Radio.Button>
              <Radio.Button value="ONLINE">
                <p className="font-medium m-0 tracking-wide">Online</p>
              </Radio.Button>
              <Radio.Button value="OFFLINE">
                <p className="font-medium m-0 tracking-wide">Offline</p>
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className="flex  items-center">
            {(!listloading && (
              <Button
                style={{
                  border: 'none',
                  background: 'none',
                  boxShadow: 'none',
                  width: 'max-content',
                }}
                onClick={() => {
                  setIncreaseDecrease(increaseDecrease - 1);
                }}
              >
                <CaretLeftFill className=" text-xl " />
              </Button>
            )) || (
              <Loading3QuartersOutlined
                spin={true}
                style={{ fontSize: '15px', padding: '4px 15px' }}
                className=""
              />
            )}
            <div className="">
              <div>
                <Popover
                  overlayClassName="mmo-popup"
                  trigger="click"
                  placement="bottomLeft"
                  visible={isCalendarVisible}
                  onVisibleChange={() => setIsCalendarVisible(!isCalendarVisible)}
                  content={
                    <div className="pb-2 mb-2 border-b" style={{ maxWidth: '300px' }}>
                      <Calendar
                        fullscreen={false}
                        headerRender={({ value, type, onChange, onTypeChange }) => {
                          return customCalendarHeaderRenderer({
                            value,
                            type,
                            onChange,
                            onTypeChange,
                          });
                        }}
                        onSelect={(momentDate) => {
                          setSelectedDate(momentDate);
                        }}
                      />
                      <div className="flex-auto flex space-x-2 justify-end">
                        <Button
                          onClick={() => setIsCalendarVisible(false)}
                          type="text"
                          size="large"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="link"
                          size="large"
                          className="font-semibold"
                          onClick={() => {
                            const date1 = new Date(selectedDate.format('L'));
                            const date2 = new Date(moment().format('L'));
                            const DifferenceInTime = date2.getTime() - date1.getTime();
                            const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
                            setIncreaseDecrease(-DifferenceInDays);
                            setIsCalendarVisible(false);
                          }}
                        >
                          OK
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <h1 className="hover:bg-gray-50 px-2.5 m-0 py-1 cursor-pointer text-gray-900 font-bold  tracking-wide  text-center select-none outline-hidden">
                    {dateFilter.replace(` at ${moment().format('LT')}`, '')}
                  </h1>
                </Popover>
              </div>
            </div>
            {(!listloading && (
              <Button
                style={{ border: 'none', background: 'none', boxShadow: 'none' }}
                onClick={() => {
                  setIncreaseDecrease(increaseDecrease + 1);
                }}
              >
                <CaretRightFill className=" text-xl  " />
              </Button>
            )) || (
              <Loading3QuartersOutlined
                spin={true}
                style={{ fontSize: '15px', padding: '4px 15px' }}
              />
            )}
          </div>
        </div>
      }
    >
      <Spin spinning={listloading}>
        <CheckValidation
          show={BatchesDetails?.batchList?.length > 0}
          fallback={
            <EmptyState
              emptyState={emptyStateSvg}
              emptyHeaderText={<span>No batch found yet</span>}
            />
          }
        >
          <Form form={form}>
            <div className="">
              <div className="border px-4 py-2 bg-white  mb-3 flex items-center justify-between">
                <div className="">
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <GroupOutlined className="mt-1" style={{ color: '#1B568F' }} />
                      <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                        Batch:
                      </h1>
                    </div>
                    <p className="text-gray-500 font-medium m-0">
                      {singleBatchSlot?.batchList[0]?.name || '--'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <FileTextOutlined className="mt-1" style={{ color: '#1B568F' }} />
                      <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                        Course:
                      </h1>
                    </div>
                    <p className="text-gray-500 font-medium m-0">
                      {singleBatchSlot?.batchList[0]?.course?.name || '--'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <ClockCircleOutlined className="mt-1" style={{ color: '#1B568F' }} />
                      <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                        Timing:
                      </h1>
                    </div>
                    <p className="text-gray-500 font-medium m-0">
                      {(singleBatchSlot?.batchList[0]?.startsAt &&
                        moment(singleBatchSlot?.batchList[0]?.startsAt).format('hh:mm a')) ||
                        '--'}{' '}
                      to{` `}
                      {(singleBatchSlot?.batchList[0]?.endsAt &&
                        moment(singleBatchSlot?.batchList[0]?.endsAt).format('hh:mm a')) ||
                        '--'}
                    </p>
                  </div>
                </div>
                <div className="">
                  <h1>Choose batch</h1>
                  <Form.Item name="batchSelect">
                    <Select
                      style={{ width: '15rem' }}
                      onChange={(e) => {
                        history.push(`/timetable/batch/${mode?.toLocaleLowerCase()}/${e}`);
                        setPartyId();
                        setModuleId();
                      }}
                      placeholder="Select batch"
                      showSearch
                      optionFilterProp="filter"
                      filterOption
                    >
                      {BatchesDetails?.batchList?.map((item) => (
                        <Select.Option key={item?.id} filter={item?.name} value={item?.id}>
                          <div className="m-0 flex items-center justify-between">
                            {item?.name}
                            {item?.modeId === 'ONLINE' && (
                              <CircleFill className="text-green-500 mt-0.5 pl-1" />
                            )}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <Spin spinning={loading}>
                <div className="bg-white">
                  <div className="px-4 py-2 flex justify-end">
                    <div className="flex gap-4">
                      <Select
                        style={{ width: '15rem' }}
                        placeholder="Select module"
                        value={moduleId}
                        allowClear
                        onChange={(e) => setModuleId(e)}
                        showSearch
                        optionFilterProp="filter"
                        filterOption
                      >
                        {singleBatchSlot?.batchList[0]?.modules?.map((item) => (
                          <Select.Option key={item?.id} filter={item?.name} value={item?.id}>
                            {item?.name}
                          </Select.Option>
                        ))}
                      </Select>
                      <Select
                        allowClear
                        value={partyId}
                        onChange={(e) => setPartyId(e)}
                        style={{ width: '15rem' }}
                        placeholder="Select teacher"
                        showSearch
                        optionFilterProp="filter"
                        filterOption
                      >
                        {trainersOfCurrentBatch?.map((trainer) => (
                          <Select.Option
                            key={trainer?.id}
                            filter={trainer?.displayName}
                            value={trainer?.id}
                          >
                            {trainer?.displayName}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={singleBatchSlot?.batchList[0]?.moduleSlots?.filter(
                      (_, index) => index >= startIndex && index < startIndex + 10,
                    )}
                    locale={{
                      emptyText: (
                        <div className="text-center py-20">
                          <div className="flex justify-center">
                            <img
                              src={emptyStateSvg}
                              alt="No task assign found!"
                              style={{ height: '100px' }}
                            />
                          </div>
                          <h1 className="text-lg font-bold text-blue-700">
                            No timeslot found yet for this batch
                          </h1>
                          <p className="text-gray-900">
                            Let add some now and they will show up here.
                          </p>
                        </div>
                      ),
                    }}
                    pagination={false}
                    scroll={{ x: 1220 }}
                    footer={() => (
                      <CheckValidation
                        show={singleBatchSlot?.batchList[0]?.moduleSlots?.length > 5}
                      >
                        <Row className="mt-2" type="flex" justify="end">
                          <Pagination
                            key={`page-${currentPage}`}
                            showSizeChanger={false}
                            onShowSizeChange={() => {
                              setCurrentPage(1);
                            }}
                            defaultCurrent={1}
                            current={currentPage}
                            pageSize={10}
                            total={singleBatchSlot?.batchList[0]?.moduleSlots?.length}
                            showTotal={(total, range) =>
                              `${range[0]}-${range[1]} of ${total} items`
                            }
                            onChange={handleChangePagination}
                          />
                        </Row>
                      </CheckValidation>
                    )}
                  />
                </div>
              </Spin>
            </div>
          </Form>
        </CheckValidation>
      </Spin>
    </Page>
  );
};

export default connect(({ timetable, loading }) => ({
  BatchesDetails: timetable?.BatchesList,
  trainersOfCurrentBatch: timetable?.trainersOfCurrentBatch,
  loading: loading?.effects['timetable/getBatchesModuleSlots'],
  listloading: loading?.effects['timetable/getBatches'],
  singleBatchSlot: timetable?.singleBatchSlot,
}))(SingleBatchDetails);
