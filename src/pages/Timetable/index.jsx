/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import { Select, Form, Spin, notification, message, Button, Calendar, Popover, Radio } from 'antd';
import ModelToAdd from './ModelToAdd';
import { connect } from 'umi';
import ModalToReplaceTeacher from './ModelToReplaceTeacher';
import AllBatches from './AllBatches';
import BatchTime from './BatchTime';
import moment from 'moment';
import CheckValidation from '@/components/CheckValidation';
import EmptyState from '@/components/EmptyState';
import emptyStateSvg from '@/assets/icons/space-empty.svg';
import customCalendarHeaderRenderer from '@/components/customCalendarHeaderRenderer';
import {
  ApartmentOutlined,
  ClusterOutlined,
  Loading3QuartersOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { CaretLeftFill, CaretRightFill } from 'react-bootstrap-icons';
import styles from './index.less';
import { TeacherWithBlackBoard } from '@/utils/AppIcons';

const { Option } = Select;

function TimeTable({ dispatch, listloading, BatchesList, allTeachersList, deleteLoading }) {
  const [addForm] = Form.useForm();
  const [replaceTeacherform] = Form.useForm();
  const [modalVisible, setModalVisible] = useState();
  const [singleBatchDetail, setSingleBatchDetail] = useState();
  const [replaceModalVisible, setReplaceModalVisible] = useState(false);
  const [timeList, setTimeList] = useState([]);
  const [startEndTime, setStartEndTime] = useState({});
  const [idTimetable, setIdTimetable] = useState();
  const [teacherFilter, setTeacherFilter] = useState();
  const [changeTeacherFor, setChangeTeacherFor] = useState({ type: 'TODAY', callApi: true });
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [increaseDecrease, setIncreaseDecrease] = useState(0);
  const [modeId, setModeId] = useState('ALL');

  const [dateFilter, setDateFilter] = useState(
    moment()
      .calendar()
      .replace(` at ${moment().format('LT')}`, ''),
  );
  const timeTableType = [
    {
      title: 'Leave',
    },
    {
      title: 'Absent',
    },
    {
      title: 'First half leave',
    },
    {
      title: 'Second half leave',
    },
  ];
  const createTimeSlot = (startTime, endTime) => {
    let startFrom = startTime;

    const timeLine = [];
    let srNo = 1;
    if (
      moment(
        `${moment().format('YYYY-MM-DD')} ${moment(endTime).format('HH:mm:ss')}`,
        'YYYY-MM-DD HH:mm',
      ).diff(
        moment(`${moment().format('YYYY-MM-DD')} ${moment(startFrom).format('HH:mm:ss')}`).format(
          'YYYY-MM-DD HH:mm',
        ),
        'minutes',
      ) <= 59 ||
      moment(endTime).format('m') > 0
    ) {
      for (let i = moment(startFrom).format('H'); i <= moment(endTime).format('H'); i++) {
        timeLine?.push({
          key: srNo,
          time: moment(startFrom).format('h a'),
        });
        srNo++;
        startFrom = moment(startFrom).add(1, 'hours').format();
      }
    } else {
      for (let i = moment(startFrom).format('H'); i < moment(endTime).format('H'); i++) {
        timeLine?.push({
          key: srNo,
          time: moment(startFrom).format('h a'),
        });
        srNo++;
        startFrom = moment(startFrom).add(1, 'hours').format();
      }
    }

    setTimeList(timeLine);
  };
  const getBatches = (filterByDate, partyId) => {
    dispatch({
      type: 'timetable/getBatches',
      payload: {
        query: {
          isFetchAll: true,
          staffId: partyId,
          modeId: modeId === 'ALL' ? '' : modeId,
          filterByDate,
        },
      },
    })
      .then((res) => {
        createTimeSlot(res?.batchesTiming?.startingTime, res?.batchesTiming?.endingTime);
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong to get batches');
        }
      });
  };
  const createModuleSlot = (values) => {
    const body = {
      teacher: values?.teacher,
      activityId: values?.activityId,
      startTime: values?.startTime,
      endTime: values?.endTime,
    };
    dispatch({
      type: 'timetable/postModuleTimeSlot',
      payload: {
        pathParams: {
          batchId: singleBatchDetail?.id,
          moduleId: values?.moduleId,
        },
        body,
      },
    }).then((res) => {
      if (res) {
        message.success('Module timeslot created successfully');
        setModalVisible('');
        getBatches();
        addForm?.resetFields();
        setStartEndTime({});
      }
    });
  };
  const updateModuleSlot = (values, timetableId) => {
    const body = {
      activityId: values?.activityId,
      moduleId: values?.moduleId,
    };
    dispatch({
      type: 'timetable/updateModuleTimeSlot',
      payload: {
        pathParams: {
          batchId: singleBatchDetail?.id,
          timetableId,
        },
        body,
      },
    }).then((res) => {
      if (res) {
        message.success('Module timeslot created successfully');
        setModalVisible('');
        getBatches();
        addForm?.resetFields();
        setStartEndTime({});
      }
    });
  };
  const deleteModuleTimeslot = (batchId, timetableId, startTime) => {
    dispatch({
      type: 'timetable/deleteModuleTimeslot',
      payload: {
        pathParams: { batchId, timetableId },
        query: { startTime: startTime && moment(startTime)?.format('YYYY-MM-DD HH:mm:ss') },
      },
    })
      .then((res) => {
        if (res?.responseMessage === 'success') {
          getBatches();
          message.success('Module timeslot successfully deleted');
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong to delete module timeslot');
        }
      });
  };
  const getSingleBatch = (filterByDate, replaceFor) => {
    dispatch({
      type: 'timetable/getBatchesModuleSlots',
      payload: {
        query: { filterByDate, batchId: singleBatchDetail?.id, timetableId: idTimetable },
      },
    })
      .then((res) => {
        if (res?.batchList[0]) {
          replaceTeacherform.setFieldsValue({
            oldTeacher: res.batchList[0]?.moduleSlots[0]?.teacher?.displayName,
          });
          if (replaceFor) {
            setChangeTeacherFor({ type: replaceFor, callApi: true });
          } else setChangeTeacherFor({ ...changeTeacherFor, callApi: true });
        } else {
          message.error('Something went wrong');
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong');
        }
      });
  };
  const getFreeTeachersList = ({
    batchId,
    startsAt,
    endsAt,
    startDate,
    endDate,
    filterByStartDate,
    filterByEndDate,
    replaceFor,
  }) => {
    dispatch({
      type: 'timetable/getFreeTeachers',
      payload: {
        query: {
          batchId: singleBatchDetail?.id || batchId,
          startDate:
            (singleBatchDetail?.startDate &&
              moment(singleBatchDetail?.startDate)?.format('YYYY-MM-DD HH:mm:ss')) ||
            startDate,
          endDate:
            (singleBatchDetail?.endDate &&
              moment(singleBatchDetail?.endDate)?.format('YYYY-MM-DD HH:mm:ss')) ||
            endDate,
          startsAt:
            (startEndTime?.startsAt &&
              moment(startEndTime?.startsAt)?.format('YYYY-MM-DD HH:mm:ss')) ||
            (startsAt && moment(startsAt)?.format('YYYY-MM-DD HH:mm:ss')),
          endsAt:
            (startEndTime?.endsAt && moment(startEndTime?.endsAt)?.format('YYYY-MM-DD HH:mm:ss')) ||
            (endsAt && moment(endsAt)?.format('YYYY-MM-DD HH:mm:ss')),
          filterByStartDate:
            (filterByStartDate && moment(filterByStartDate)?.format('YYYY-MM-DD HH:mm:ss')) ||
            moment()?.add(increaseDecrease, 'days')?.format('YYYY-MM-DD HH:mm:ss'),
          filterByEndDate:
            filterByEndDate && moment(filterByEndDate)?.format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
      .then((res) => {
        if (filterByStartDate) {
          getSingleBatch(moment(filterByStartDate)?.format('YYYY-MM-DD HH:mm:ss'), replaceFor);
        }
        if (res?.teachers?.length === 0) {
          notification.error({
            message: 'Teachers not available',
            duration: 10,
            description: res?.message,
          });
          addForm?.setFieldsValue({ endTime: undefined });
        }
      })
      .catch((err) => {
        if (err?.status === 400) {
          notification.error({
            message: 'Teachers not assigned',
            duration: 10,
            description:
              'Batch does not has any assigned teachers, Please assign teachers to batch.',
          });
          addForm?.setFieldsValue({ endTime: undefined });
        }
        if (err?.status === 500) {
          message.error('Something went wrong to get teachers');
          addForm?.setFieldsValue({ endTime: undefined });
        }
      });
  };
  const replaceModuleTeacher = (values, timetableId) => {
    const body = {
      teacher: values?.teacher,
      startDate:
        values?.date?.toISOString() ||
        (values?.fromTo && values?.fromTo[0]?.toISOString()) ||
        (values?.replaceTypeId === 'TODAY' &&
          moment().add(increaseDecrease, 'days').toISOString()) ||
        (values?.replaceTypeId === 'PERMANENT' &&
          moment().add(increaseDecrease, 'days').toISOString()),

      endDate: values?.fromTo && values?.fromTo[1]?.toISOString(),
      replaceTypeId:
        (values?.replaceTypeId === 'TODAY' &&
          moment().add(increaseDecrease, 'days')?.format('YYYY-MM-DD') >
            moment()?.format('YYYY-MM-DD') &&
          'DATE') ||
        values?.replaceTypeId,
    };
    dispatch({
      type: 'timetable/replaceTeacher',
      payload: {
        pathParams: {
          batchId: singleBatchDetail?.id,
          timetableId,
        },
        body,
      },
    })
      .then((res) => {
        if (res) {
          getBatches(moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss'));
          setReplaceModalVisible(false);
          replaceTeacherform?.resetFields();
          message.success('Teacher replaced successfully');
          setChangeTeacherFor('TODAY');
        }
      })
      .catch((err) => {
        if (err) {
          message.error('Something went wrong to replace teacher');
        }
      });
  };
  const getExittingTimeslot = (batchId, startsAt, endsAt) => {
    dispatch({
      type: 'timetable/getIsTimeslotExit',
      payload: {
        pathParams: { batchId },
        query: {
          startsAt: startsAt?.format('YYYY-MM-DD HH:mm:ss'),
          endsAt: endsAt?.format('YYYY-MM-DD HH:mm:ss'),
        },
      },
    })
      .then((res) => {
        if (res?.message !== 'This time slot is available.') {
          notification.error({
            message: 'This time slot already occupied',
            duration: 10,
            description: `This batch have already ${moment(res?.startsAt).format(
              'hh:mm a',
            )} to ${moment(res?.endsAt).format('hh:mm a')} module timeslot`,
          });
          setStartEndTime({ startsAt, call: false });
          addForm?.setFieldsValue({ endTime: undefined });
        } else if (res?.message === 'This time slot is available.') {
          getFreeTeachersList({ batchId, startsAt, endsAt });
          setStartEndTime({ startsAt, call: false });
        }
      })
      .catch((err) => {
        if (err?.status === 400) {
          notification.error({
            message: 'INVALID REQUEST',
            duration: 10,
            description: err?.data?.message,
          });
          setStartEndTime({ startsAt });
          addForm?.setFieldsValue({ endTime: undefined });
        }
      });
  };
  useEffect(() => {
    if (startEndTime?.startsAt && startEndTime?.endsAt && startEndTime?.call) {
      getExittingTimeslot(singleBatchDetail?.id, startEndTime?.startsAt, startEndTime?.endsAt);
    }
  }, [startEndTime]);
  useEffect(() => {
    dispatch({
      type: 'timetable/getAllTeachers',
      payload: {
        query: {
          showAssignedTeachers: true,
          viewSize: 1000,
        },
      },
    });
  }, [dispatch]);
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
    getBatches(moment().add(increaseDecrease, 'days').format('YYYY-MM-DD HH:mm:ss'), teacherFilter);
  }, [increaseDecrease, teacherFilter, modeId]);

  return (
    <Page
      title="Timetable"
      primaryAction={
        <div className="flex">
          <Radio.Group
            className={styles?.customRadioButtonDesign}
            size="middle"
            buttonStyle="solid"
            defaultValue=""
            value={modeId}
            onChange={(e) => setModeId(e.target.value)}
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
      <Spin spinning={Boolean(deleteLoading)}>
        <div>
          <div className="flex justify-between font-semibold text-base px-5 py-2 text-gray-800 bg-white items-center">
            <div className="grid 2xl:grid-cols-4 xl:grid-cols-2 gap-2  lg:grid-cols-1 md:grid-cols-1 flex-none">
              <div
                style={{ border: '0.5px solid #1B568F' }}
                className="rounded flex  items-center justify-between bg-blue-100 pl-2"
              >
                <div
                  style={{ color: '#1B568F' }}
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <ClusterOutlined style={{ color: '#1B568F' }} /> Total Batches
                </div>
                <div
                  style={{ backgroundColor: '#1B568F', fontSize: '12px' }}
                  className=" text-white font-medium  w-8 text-center rounded "
                >
                  {BatchesList?.totalCount}
                </div>
              </div>
              <div
                style={{ border: '0.5px solid #08979c', backgroundColor: '#e6fffb' }}
                className="rounded flex  items-center justify-between pl-2"
              >
                <div
                  style={{ color: '#111827' }}
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <TeacherWithBlackBoard color="#111827" /> Free Teachers
                </div>
                <div
                  style={{ backgroundColor: '#08979c', fontSize: '12px' }}
                  className=" text-white font-medium  w-8 text-center rounded "
                >
                  {BatchesList?.classes?.availableTeacher}
                </div>
              </div>
              <div
                style={{ border: '0.5px solid #faad14', backgroundColor: '#fff7ed' }}
                className="rounded flex  items-center justify-between  pl-2"
              >
                <div
                  // style={{ color: '#faad14' }}
                  className="text-sm font-medium text-gray-900 flex items-center gap-1 mr-3"
                >
                  <ApartmentOutlined
                    className="text-gray-900"
                    //  style={{ color: '#faad14' }}
                  />{' '}
                  Classes Occupied
                </div>
                <div
                  style={{ backgroundColor: '#faad14', fontSize: '12px' }}
                  className=" text-gray-900 font-medium  w-8 text-center rounded "
                >
                  {BatchesList?.classes?.occupiedClasses}
                </div>
              </div>
              <div
                style={{ border: '0.5px solid #237804', backgroundColor: '#f6ffed' }}
                className="rounded flex  items-center justify-between pl-2"
              >
                <div
                  style={{ color: '#237804' }}
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <PieChartOutlined style={{ color: '#237804' }} /> Free classes
                </div>
                <div
                  style={{ backgroundColor: '#237804', fontSize: '12px' }}
                  className=" text-white font-medium  w-8 text-center rounded "
                >
                  {BatchesList?.classes?.availableClasses}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-60">
                <Select
                  className="w-full rounded-md"
                  getPopupContainer={(node) => node.parentNode}
                  placeholder="Choose type"
                  allowClear
                >
                  {timeTableType?.map((type) => (
                    <Option key={type?.id} value={type?.id}>
                      {type?.title}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="w-60">
                <Select
                  className="w-full rounded-md"
                  getPopupContainer={(node) => node.parentNode}
                  allowClear
                  showSearch
                  optionFilterProp="filter"
                  filterOption
                  onChange={(e) => setTeacherFilter(e)}
                  placeholder="Select teacher"
                >
                  {allTeachersList?.records?.map((teacher) => (
                    <Option
                      key={teacher?.partyId}
                      filter={teacher?.displayName}
                      value={teacher?.partyId}
                    >
                      {teacher?.displayName}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <CheckValidation
            show={BatchesList?.batchList?.length > 0}
            fallback={
              <EmptyState
                emptyState={emptyStateSvg}
                emptyHeaderText={<span>No batch found yet</span>}
              />
            }
          >
            <div
              className="w-full overflow-x-auto relative bg-white overflow-y-auto"
              style={{ height: '45rem' }}
            >
              {/* header */}
              <div className="bg-white w-full sticky top-0 " style={{ zIndex: '1000' }}>
                <AllBatches allBatch={BatchesList?.batchList} />
              </div>
              {/* time */}
              <BatchTime
                allBatch={BatchesList?.batchList}
                time={timeList}
                addForm={addForm}
                setModalVisible={setModalVisible}
                setSingleBatchDetail={setSingleBatchDetail}
                deleteModuleTimeslot={deleteModuleTimeslot}
                setReplaceModalVisible={setReplaceModalVisible}
                replaceTeacherform={replaceTeacherform}
                setStartEndTime={setStartEndTime}
                getFreeTeachersList={getFreeTeachersList}
                setIdTimetable={setIdTimetable}
                dateFilter={increaseDecrease}
                setChangeTeacherFor={setChangeTeacherFor}
              />
              <ModalToReplaceTeacher
                setReplaceModalVisible={setReplaceModalVisible}
                replaceModalVisible={replaceModalVisible}
                replaceTeacherform={replaceTeacherform}
                singleBatchDetail={singleBatchDetail}
                replaceModuleTeacher={replaceModuleTeacher}
                idTimetable={idTimetable}
                changeTeacherFor={changeTeacherFor}
                setChangeTeacherFor={setChangeTeacherFor}
                getFreeTeachersList={getFreeTeachersList}
                dateFilter={increaseDecrease}
              />
              <ModelToAdd
                setModalVisible={setModalVisible}
                addForm={addForm}
                singleBatchDetail={singleBatchDetail}
                modalVisible={modalVisible}
                setStartEndTime={setStartEndTime}
                startEndTime={startEndTime}
                idTimetable={idTimetable}
                updateModuleSlot={updateModuleSlot}
                createModuleSlot={createModuleSlot}
              />
            </div>
          </CheckValidation>
        </div>
      </Spin>
    </Page>
  );
}
export default connect(({ timetable, loading }) => ({
  BatchesList: timetable?.BatchesList,
  allTeachersList: timetable?.allTeachersList,
  listloading: loading?.effects['timetable/getBatches'],
  deleteLoading: loading?.effects['timetable/deleteModuleTimeslot'],
}))(TimeTable);
