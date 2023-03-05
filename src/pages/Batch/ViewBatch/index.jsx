import React, { useEffect, useState } from 'react';
import { connect, useParams } from 'umi';
import Page from '@/components/Page';
import Breadcrumbs from '@/components/BreadCrumbs';
import {
  Row,
  Col,
  Tabs,
  Button,
  Avatar,
  Spin,
  Popconfirm,
  message,
  notification,
  Tooltip,
} from 'antd';
import {
  ClockCircleOutlined,
  DeleteTwoTone,
  FileTextOutlined,
  ProfileOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import style from './index.less';
import AddStudentToBatchModal from './AddStudentToBatchModal';
import AddTeacherToBatchModal from './AddTeacherToBatchModal';
import { getInitials } from '@/utils/common';
import AddTeachingScheduleModel from './AddTeachingScheduleModel';

const { TabPane } = Tabs;

function ViewBatch({
  dispatch,
  currentBatchDetails,
  primaryColor,
  studentsOfCurrentBatch,
  loading,
  trainersOfCurrentBatch,
  deletingTeacher,
  deletingStudent,
  getAssignedTeachingSchedule,
  getTeachersLoading,
  studentListLoading,
}) {
  const { batchId } = useParams();
  const [isAddStudentToBatchVisible, setIsAddStudentToBatchVisible] = useState(false);
  const [isAddTeacherToBatchVisible, setIsAddTeacherToBatchVisible] = useState(false);
  const [isAddTeachingScheduleModel, setIsAddTeachingScheduleModel] = useState(false);
  const getTrainerAssignToBatch = () =>
    dispatch({
      type: 'batch/getTrainerAssignToBatch',
      payload: { pathParams: { batchId } },
    }).catch(() => {});

  const handleDeleteTrainer = (trainer) =>
    dispatch({
      type: 'batch/removeTrainerFromBatch',
      payload: {
        pathParams: {
          trainerId: trainer?.id,
          batchId,
        },
      },
    })
      .then(() => {
        message.success(`${trainer?.displayName || 'Teacher'} removed from the batch successfully`);
      })
      .catch((err) => {
        if (err?.status === 400) {
          notification.error({
            message: 'INVALID REQUEST',
            duration: 5,
            description: `${err?.data?.message} in timetable`,
          });
        }
      });

  const handleDeleteStudent = (student) => {
    return dispatch({
      type: 'batch/removeStudentFromBatch',
      payload: {
        pathParams: {
          batchId,
          studentId: student?.student?.id,
        },
      },
    })
      .then(() => {
        message.success(
          `${student?.student?.displayName || 'Student'}  removed from the batch successfully`,
        );
      })
      .catch(() => {});
  };
  const getTeachingSchedule = () => {
    dispatch({
      type: 'batch/getAssignedTeachingSchedule',
      payload: { pathParams: { batchId } },
    }).catch(() => {});
  };
  useEffect(() => {
    if (batchId) {
      getTrainerAssignToBatch();
      getTeachingSchedule();
      dispatch({
        type: 'batch/getStudentAssignToBatch',
        payload: { pathParams: { batchId } },
      }).catch(() => {});
      dispatch({
        type: 'batch/getBatchDetails',
        payload: { pathParams: { batchId } },
      }).catch(() => {});
    }
  }, [batchId, dispatch]);
  return (
    <Spin spinning={Boolean(loading) || Boolean(getTeachersLoading) || studentListLoading}>
      <div className="mt-8">
        <Page
          title={currentBatchDetails?.name}
          subTitle={
            <div className=" antd-pro-pages-courses-and-programs-program-schedule-index-mainHeader flex itmes-center">
              <div className="text-xs rounded-full px-3 text-center py-1 bg-blue-100 text-blue-800 uppercase font-medium border-white border-2">
                {currentBatchDetails?.status === 'Planned' ? 'Active' : 'Inactive'}
              </div>
              <div className="pl-2 font-medium text-sm text-gray-800">
                {dayjs(currentBatchDetails?.startsAt).format('hh:mm a')} to{` `}
                {dayjs(currentBatchDetails?.endsAt).format('hh:mm a')}
                {` `}
                {currentBatchDetails?.startDate &&
                  ` starts from ${dayjs(currentBatchDetails?.startDate).format('DD MMM, YYYY')}`}
              </div>
            </div>
          }
          breadcrumbs={
            <Breadcrumbs
              path={[
                {
                  name: 'Dashboard',
                  path: '/dashboard',
                },
                {
                  name: 'Batches',
                  path: '/batches/all',
                },
                { name: currentBatchDetails?.name, path: '#' },
              ]}
            />
          }
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <div className="rounded overflow-hidden shadow">
                <div className="border px-3 py-5 bg-white text-base uppercase text-gray-600 font-semibold flex  justify-between items-center">
                  <div className="flex  items-center">
                    {' '}
                    <UsergroupAddOutlined />
                    <div className="px-2">Teachers</div>
                  </div>
                  {trainersOfCurrentBatch?.length < 15 && (
                    <div>
                      <button
                        onClick={() => {
                          setIsAddTeacherToBatchVisible((prev) => !prev);
                        }}
                        type="button"
                        className="ant-btn ant-btn-sm"
                      >
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
                <div className={`overflow-y-auto ${trainersOfCurrentBatch?.length > 5 && 'h-80'}`}>
                  {trainersOfCurrentBatch?.map((trainer) => (
                    <div
                      key={trainer?.id}
                      className=" p-4 flex bg-gray-100 border-b justify-between items-center"
                    >
                      <div className="mr-2">
                        <Avatar style={{ background: primaryColor }} src={trainer?.avatarUrl}>
                          {getInitials(trainer?.displayName)}
                        </Avatar>
                      </div>
                      <div className="flex-auto">
                        <div className="font-semibold text-normal capitalize">
                          {trainer?.displayName}
                        </div>
                        <span className="text-sm">{trainer?.primaryEmail}</span>
                      </div>

                      <div className="   cursor-pointer text-red-600 px-3 py-1">
                        <Popconfirm
                          title="Are you sure you want to remove this teacher?"
                          onConfirm={() => {
                            handleDeleteTrainer(trainer);
                          }}
                          okType="danger"
                          okButtonProps={{ type: 'primary', loading: deletingTeacher }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteTwoTone twoToneColor="red" />
                        </Popconfirm>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border px-3 py-5 bg-white text-base uppercase text-gray-600 font-semibold flex  justify-between items-center">
                  <div className="flex  items-center">
                    <UserAddOutlined />
                    <div className="px-2">TEACHING SCHEDULE</div>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setIsAddTeachingScheduleModel((prev) => !prev);
                      }}
                      type="button"
                      className="ant-btn ant-btn-sm"
                    >
                      <span>Add</span>
                    </button>
                  </div>
                </div>
                {getAssignedTeachingSchedule?.scheduleDetails?.map((item) => (
                  <div className="px-4 py-3 flex justify-between mt-3" key={item?.id}>
                    <div className="">
                      <h1 className="text-gray-900 capitalize">{item?.name}</h1>
                    </div>
                    <div className="flex">
                      <div className="text-gray-900 font-medium flex">
                        <p>{item?.mockTestCapsule?.name}</p>
                        {item?.mockTestCapsule?.name && item?.capsule?.name && (
                          <span className="text-yellow-500 px-1">|</span>
                        )}
                        <p>{item?.capsule?.name}</p>
                      </div>
                      <Popconfirm
                        title="Are you sure you want to remove this teaching schedule?"
                        onConfirm={() => {
                          dispatch({
                            type: 'batch/removeTeachingSchedule',
                            payload: {
                              pathParams: {
                                batchId,
                                timesheetId: item?.timesheetId,
                              },
                            },
                          })
                            .then((res) => {
                              if (res?.responseMessage === 'success') {
                                message.success('Teaching schedule deleted successfully');
                                getTeachingSchedule();
                              } else {
                                message.error('Something went wrong');
                              }
                            })
                            .catch(() => message.error('Something went wrong'));
                        }}
                        okType="danger"
                        okButtonProps={{ type: 'primary', loading: deletingTeacher }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteTwoTone twoToneColor="red" className="mx-1 mt-1" />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
                {/* <div className=" p-4 flex bg-gray-100 justify-between items-center">
                  <div className="mr-2">
                    <Avatar style={{ background: primaryColor }}>DT</Avatar>
                  </div>
                  <div className="flex-auto">
                    <div className="font-semibold capitalize">Demo Trainer 2</div>
                  </div>
                  <div className="   cursor-pointer text-red-600 px-3 py-1">
                    <DeleteOutlined />
                  </div>
                </div> */}
                <div className="bg-white border-b">
                  <div className="border-b flex items-center font-semibold bg-white px-4 text-gray-600 text-base uppercase bg-white py-2">
                    <div className="pr-1  flex items-center">
                      {' '}
                      <FileTextOutlined />
                    </div>{' '}
                    Course details
                  </div>
                  <div className="bg-gray-100">
                    <div className="text-normal l font-semibold flex justify-between  px-4 py-2">
                      <span className="text-gray-500 uppercase">Name</span>{' '}
                      <span>{currentBatchDetails?.course?.name}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 text-normal l font-semibold flex justify-between mt px-4 py-2">
                    <span className="text-gray-500 uppercase">Category </span>{' '}
                    <span>{currentBatchDetails?.course?.categoryName}</span>
                  </div>
                  <div className="text-normal bg-gray-100 l font-semibold flex justify-between mt px-4 py-2">
                    <span className="text-gray-500 uppercase">SUB Category </span>{' '}
                    <span>{currentBatchDetails?.course?.subCategoryName}</span>
                  </div>
                  <div className="text-normal bg-gray-100 l font-semibold flex justify-between mt px-4 py-2">
                    <span className="text-gray-500 uppercase">MODULES </span>{' '}
                    <Tooltip
                      title={currentBatchDetails?.course?.courseModules?.map((item) => (
                        <span key={item?.id}>{`${item?.name}, `}</span>
                      ))}
                      getPopupContainer={(node) => node.parentNode}
                    >
                      <h1
                        style={{ width: '270px' }}
                        className="m-0 text-left flex justify-end truncate cursor-pointer select-none"
                      >
                        {currentBatchDetails?.course?.courseModules?.map((item, index) => (
                          <span
                            key={item?.id}
                            className={`${
                              index === 0
                                ? `border-l-4 pl-2 ml-2 border-r-4 pr-2 mr-2 border-yellow-500`
                                : `border-r-4 pr-2  border-yellow-500`
                            }`}
                          >
                            {item?.name}
                          </span>
                        ))}
                      </h1>
                    </Tooltip>
                  </div>
                </div>
                {currentBatchDetails?.classRoom && (
                  <div className="bg-gray-100 border-b border-t">
                    <div className="border-b flex items-center text-gray-600 font-semibold bg-white text-base uppercase bg-white  px-4 py-2">
                      <div className="w-5 h-5 pr-1 flex items-center">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="school"
                          className="svg-inline--fa fa-school fa-w-20"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill="currentColor"
                            d="M0 224v272c0 8.84 7.16 16 16 16h80V192H32c-17.67 0-32 14.33-32 32zm360-48h-24v-40c0-4.42-3.58-8-8-8h-16c-4.42 0-8 3.58-8 8v64c0 4.42 3.58 8 8 8h48c4.42 0 8-3.58 8-8v-16c0-4.42-3.58-8-8-8zm137.75-63.96l-160-106.67a32.02 32.02 0 0 0-35.5 0l-160 106.67A32.002 32.002 0 0 0 128 138.66V512h128V368c0-8.84 7.16-16 16-16h96c8.84 0 16 7.16 16 16v144h128V138.67c0-10.7-5.35-20.7-14.25-26.63zM320 256c-44.18 0-80-35.82-80-80s35.82-80 80-80 80 35.82 80 80-35.82 80-80 80zm288-64h-64v320h80c8.84 0 16-7.16 16-16V224c0-17.67-14.33-32-32-32z"
                          ></path>
                        </svg>
                      </div>
                      Class
                    </div>
                    <div className="text-normal l font-semibold flex justify-between mt px-4 py-2">
                      <span className="text-gray-500 uppercase">Name</span>{' '}
                      <span>{currentBatchDetails?.classRoom?.name}</span>
                    </div>
                    <div className="text-normal l font-semibold flex justify-between mt px-4 py-2">
                      <span className="text-gray-500 uppercase">Sitting capacity</span>
                      <span>{currentBatchDetails?.classRoom?.sittingCapacity}</span>
                    </div>
                    <div className="text-normal l font-semibold flex justify-between mt px-4 py-2">
                      <span className="text-gray-500 uppercase">Campus</span>
                      <span>{currentBatchDetails?.classRoom?.campusName}</span>
                    </div>{' '}
                    <div className="text-normal l font-semibold flex justify-between mt px-4 py-2">
                      <span className="text-gray-500 uppercase">Floor</span>
                      <span>{currentBatchDetails?.classRoom?.floor}</span>
                    </div>
                    <div className="text-normal l font-semibold flex justify-between mt px-4 py-2">
                      <span className="text-gray-500 uppercase">Type</span>
                      <span>{currentBatchDetails?.classRoom?.classType}</span>
                    </div>
                  </div>
                )}
                <div className="bg-white border-b">
                  <div className="border-b flex items-center font-semibold bg-white px-4 text-gray-600 text-base uppercase bg-white py-2">
                    <div className="pr-1  flex items-center">
                      {' '}
                      <ClockCircleOutlined />
                    </div>{' '}
                    Timing
                  </div>
                  <div className="bg-gray-100">
                    <div className="text-normal l font-semibold flex justify-between  px-4 py-2">
                      <span className="text-gray-500 uppercase">Mode</span>{' '}
                      <span>{currentBatchDetails?.mode}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 text-normal l font-semibold flex justify-between mt px-4 py-2">
                    <span className="text-gray-500 uppercase">Start time</span>{' '}
                    <span>{dayjs(currentBatchDetails?.startsAt).format('hh:mm a')}</span>
                  </div>
                  <div className="text-normal bg-gray-100 l font-semibold flex justify-between mt px-4 py-2">
                    <span className="text-gray-500 uppercase">End time</span>{' '}
                    <span>{dayjs(currentBatchDetails?.endsAt).format('hh:mm a')}</span>
                  </div>
                </div>
                {currentBatchDetails?.description && (
                  <div className="bg-white   ">
                    <p className="border-b flex items-center text-gray-600 font-semibold text-base uppercase bg-white  px-4 py-2 mb-0">
                      <div className="flex pr-1 items-center">
                        <ProfileOutlined />{' '}
                      </div>{' '}
                      Description
                    </p>
                    <div className="px-4 py-3 bg-gray-100 font-semibold">
                      {currentBatchDetails?.description}
                    </div>
                  </div>
                )}
              </div>
            </Col>
            <Col md={16} sx={24}>
              <div className="rounded overflow-hidden shadow bg-white">
                <Row className="py-4 px-6 flex justify-between. border-b">
                  <Col md={12} xs={24}>
                    <p className="mb-0 text-xl font-semibold">Manage batch </p>
                  </Col>
                  <Col md={12} xs={24}>
                    {currentBatchDetails?.classRoom && (
                      <div className="flex justify-end">
                        <span className="rounded-r-none bg-yellow-400 text-yellow-800 px-4 py-1 rounded-full text-xs uppercase font-medium">
                          <span className="pr-1"></span> {studentsOfCurrentBatch?.length} of{' '}
                          {currentBatchDetails?.classRoom?.sittingCapacity} booked
                        </span>
                        <span className="rounded-l-none bg-green-300 text-green-800 px-4 py-1 rounded-full text-xs uppercase font-medium">
                          {currentBatchDetails?.classRoom?.sittingCapacity -
                            studentsOfCurrentBatch?.length}{' '}
                          slots open
                        </span>
                      </div>
                    )}
                  </Col>
                </Row>
                <div className={style.overidetabs}>
                  <Tabs>
                    <TabPane tab={<span className="">Enrolled students</span>}>
                      <div className="bg-gray-100 px-6 py-2 flex justify-between border-b">
                        <div className="text-sm font-medium text-blue-700 text-center pt-2">
                          {studentsOfCurrentBatch?.length} Student
                        </div>
                        {currentBatchDetails?.modeId === 'ONLINE' ||
                        studentsOfCurrentBatch?.length <
                          currentBatchDetails?.classRoom?.sittingCapacity ? (
                          <div>
                            <Button
                              onClick={() => {
                                setIsAddStudentToBatchVisible((prev) => !prev);
                              }}
                              className="ant-btn ant-btn-default"
                            >
                              <span>Add students</span>
                            </Button>
                          </div>
                        ) : null}
                      </div>
                      {studentsOfCurrentBatch?.length > 0 &&
                        studentsOfCurrentBatch?.map((student, idx) => (
                          <div className="w-full" key={student?.student?.id}>
                            <div className="px-4 py-2 flex justify-between items-center border-b">
                              <div className="px-2">{idx + 1}</div>
                              <div className="mr-2">
                                <Avatar style={{ background: primaryColor }}>
                                  {getInitials(student?.student?.displayName)}
                                </Avatar>
                              </div>
                              <div className="flex-auto ">
                                <div
                                  className="ant-row"
                                  style={{ marginLeft: '-8px', marginRight: '-8px' }}
                                >
                                  <div
                                    className="ant-col ant-col-xs-24 ant-col-sm-12 ant-col-md-12 ant-col-lg-12 ant-col-xl-12 ant-col-xxl-12"
                                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                                  >
                                    <div>
                                      <div className="font-semibold cursor-pointer">
                                        {student?.student?.displayName}
                                      </div>
                                      <div>
                                        <p className="mb-0">
                                          {' '}
                                          {student?.student?.primaryPhone?.phoneFormatted}
                                        </p>
                                        <span className="ml-2">
                                          {student?.student?.emailAddresses[0]?.email}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <Popconfirm
                                  title="Are you sure you want to remove this student?"
                                  onConfirm={() => {
                                    handleDeleteStudent(student);
                                  }}
                                  okText="Yes"
                                  okType="danger"
                                  okButtonProps={{ type: 'primary', loading: deletingStudent }}
                                  cancelText="No"
                                >
                                  <Button type="primary" danger size="small">
                                    <span>Remove</span>
                                  </Button>
                                </Popconfirm>
                              </div>
                            </div>
                          </div>
                        ))}
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </Col>
          </Row>
        </Page>
        <AddStudentToBatchModal
          visible={isAddStudentToBatchVisible}
          courseId={currentBatchDetails?.course?.id}
          setVisible={setIsAddStudentToBatchVisible}
        />
        <AddTeacherToBatchModal
          visible={isAddTeacherToBatchVisible}
          setVisible={setIsAddTeacherToBatchVisible}
        />
        <AddTeachingScheduleModel
          isAddTeachingScheduleModel={isAddTeachingScheduleModel}
          setIsAddTeachingScheduleModel={setIsAddTeachingScheduleModel}
          courseId={currentBatchDetails?.course?.id}
          getTeachingSchedule={getTeachingSchedule}
        />
      </div>
    </Spin>
  );
}
export default connect(({ batch, settings, loading }) => ({
  primaryColor: settings.primaryColor,
  currentBatchDetails: batch?.currentBatchDetails,
  trainersOfCurrentBatch: batch?.trainersOfCurrentBatch,
  studentsOfCurrentBatch: batch?.studentsOfCurrentBatch,
  loading: loading?.effects['batch/getBatchDetails'],
  studentListLoading: loading?.effects['batch/getStudentAssignToBatch'],
  deletingTeacher: loading?.effects['batch/removeTrainerFromBatch'],
  deletingStudent: loading?.effects['batch/removeStudentFromBatch'],
  getTeachersLoading: loading?.effects['batch/getTrainerAssignToBatch'],
  getAssignedTeachingSchedule: batch?.getAssignedTeachingSchedule,
}))(ViewBatch);
