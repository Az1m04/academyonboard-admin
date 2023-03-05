import React from 'react';
import { Tooltip, Popconfirm, Popover } from 'antd';
import {
  ClockCircleOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MoreOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { connect } from 'umi';
import moment from 'moment';
import styles from './index.less';

function BatchTime({
  time,
  allBatch,
  setModalVisible,
  dispatch,
  addForm,
  setSingleBatchDetail,
  deleteModuleTimeslot,
  setReplaceModalVisible,
  replaceTeacherform,
  getFreeTeachersList,
  setIdTimetable,
  setStartEndTime,
  dateFilter,
  setChangeTeacherFor,
}) {
  const statesNull = () => {
    dispatch({
      type: 'timetable/setStates',
      payload: {
        freeTeachersList: null,
      },
      key: 'freeTeachersList',
    });
  };
  return (
    <div>
      {time?.map((item) => (
        <div key={item?.time} className="flex relative" style={{ width: 'max-content' }}>
          <div
            className="flex-none w-28 sticky top-0 left-0 border bg-white  text-center"
            style={{ zIndex: '700', backgroundColor: '#1B568F', color: 'white' }}
          >
            <h1 className=" mb-0 mt-12" style={{ color: 'white' }}>
              {item?.time}
            </h1>
          </div>
          <div className="flex">
            {allBatch?.map((batch) => (
              <>
                <div
                  key={batch?.id}
                  style={{ height: '124px' }}
                  className="border w-48 hover:bg-gray-100 relative flex-none cursor-pointer"
                  onClick={() => {
                    setSingleBatchDetail(batch);
                    setModalVisible('create');
                    setStartEndTime({});
                    addForm?.resetFields();
                    statesNull();
                  }}
                >
                  {batch?.moduleSlots
                    ?.filter(
                      (module) =>
                        module?.startTime && moment(module?.startTime).format('h a') === item?.time,
                    )
                    ?.map((items) =>
                      items?.startTime && moment(items?.startTime).format('h a') === item?.time ? (
                        <>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalVisible('update');
                              setIdTimetable(items?.timetableId);
                              setStartEndTime({
                                startsAt:
                                  items?.startTime &&
                                  moment(
                                    `${moment().format('YYYY-MM-DD')} ${moment(
                                      items?.startTime,
                                    ).format('HH:mm:ss')}`,
                                  ),
                                endsAt:
                                  items?.endTime &&
                                  moment(
                                    `${moment().format('YYYY-MM-DD')} ${moment(
                                      items?.endTime,
                                    ).format('HH:mm:ss')}`,
                                  ),
                              });
                              statesNull();
                              setSingleBatchDetail(batch);
                              addForm?.setFieldsValue({
                                teacher: { id: items?.teacher?.displayName },
                                startTime: moment(
                                  `${moment().format('YYYY-MM-DD')} ${moment(
                                    items?.startTime,
                                  ).format('HH:mm:ss')}`,
                                ),
                                endTime: moment(
                                  `${moment().format('YYYY-MM-DD')} ${moment(items?.endTime).format(
                                    'HH:mm:ss',
                                  )}`,
                                ),
                                activityId: items?.activityType,
                                moduleId: items?.id,
                              });
                              // @JOSHAN COMMENT THIS CODE FOR A REASON
                              // getFreeTeachersList({
                              //   batchId: batch?.id,
                              //   startsAt: items?.startTime,
                              //   endsAt: items?.endTime,
                              //   startDate:
                              //     batch?.startDate &&
                              //     moment(batch?.startDate)?.format('YYYY-MM-DD HH:mm:ss'),
                              //   endDate:
                              //     batch?.endDate &&
                              //     moment(batch?.endDate)?.format('YYYY-MM-DD HH:mm:ss'),
                              // });
                            }}
                            style={{
                              height: `${
                                items?.minutes <= 60
                                  ? items?.minutes * 2 + 1
                                  : items?.minutes * 2 + (items?.minutes / 32) * 2
                              }px`,
                              borderColor: '#1B568F',
                              zIndex: '500',
                              marginTop: `${
                                items?.startTime && moment(items?.startTime).format('m') * 2
                              }px`,
                            }}
                            className={`${'bg-blue-100'} pl-2 ${
                              items?.minutes > 15 ? 'py-2' : 'pt-0.5'
                            } rounded-md  absolute w-full  shadow-md border`}
                          >
                            <div
                              className={`absolute ${
                                items?.minutes > 15 ? 'bottom-2 right-2' : 'bottom-0 right-2'
                              } flex gap-2`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Popover
                                content={
                                  <div
                                    style={{ padding: '0px' }}
                                    className="bg-white flex flex-col w-max"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Popconfirm
                                      title="Are you sure you want to delete this timeslot?"
                                      okText="Delete"
                                      okType="danger"
                                      onConfirm={() =>
                                        deleteModuleTimeslot(
                                          batch?.id,
                                          items?.timetableId,
                                          items?.startTime,
                                        )
                                      }
                                    >
                                      <a
                                        className="text-gray-900 font-medium hover:text-red-500 hover:bg-gray-50 pl-4 pr-14 py-1.5 border-b"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                        }}
                                      >
                                        Delete
                                      </a>
                                    </Popconfirm>
                                    {moment()
                                      .add(dateFilter, 'days')
                                      .format('YYYY-MM-DD HH:mm:ss') >=
                                      moment().format('YYYY-MM-DD HH:mm:ss') && (
                                      <a
                                        className="text-gray-900 font-medium hover:text-blue-900 hover:bg-gray-50 pl-4 pr-14 py-1.5 border-b"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIdTimetable(items?.timetableId);
                                          setReplaceModalVisible(true);
                                          replaceTeacherform?.setFieldsValue({
                                            oldTeacher: items?.teacher?.displayName,
                                            startTime: moment(items?.startTime),
                                            endTime: moment(items?.endTime),
                                            activityId: items?.activityType,
                                            moduleId: items?.id,
                                            teacher: undefined,
                                          });
                                          setSingleBatchDetail(batch);
                                          setChangeTeacherFor({ type: 'TODAY', callApi: true });
                                          setStartEndTime({
                                            startsAt:
                                              items?.startTime &&
                                              moment(
                                                `${moment().format('YYYY-MM-DD')} ${moment(
                                                  items?.startTime,
                                                ).format('HH:mm:ss')}`,
                                              ),
                                            endsAt:
                                              items?.endTime &&
                                              moment(
                                                `${moment().format('YYYY-MM-DD')} ${moment(
                                                  items?.endTime,
                                                ).format('HH:mm:ss')}`,
                                              ),
                                          });
                                          getFreeTeachersList({
                                            batchId: batch?.id,
                                            startsAt: items?.startTime,
                                            endsAt: items?.endTime,
                                            startDate:
                                              batch?.startDate &&
                                              moment(batch?.startDate)?.format(
                                                'YYYY-MM-DD HH:mm:ss',
                                              ),
                                            endDate:
                                              batch?.endDate &&
                                              moment(batch?.endDate)?.format('YYYY-MM-DD HH:mm:ss'),
                                          });
                                        }}
                                      >
                                        Replace teacher
                                      </a>
                                    )}
                                  </div>
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                trigger={'click'}
                                placement="topRight"
                                overlayClassName={`${styles.customPopOver}`}
                              >
                                <Tooltip title="Quick actions">
                                  <MoreOutlined className="m-0" />
                                </Tooltip>
                              </Popover>
                            </div>
                            <div className="flex m-0 gap-1">
                              <ClockCircleOutlined
                                className="text-xs mt-0.5"
                                style={{ color: '#1B568F' }}
                              />
                              <h1 className="text-gray-900 font-medium text-xs  mb-0">
                                {moment(items?.startTime).format('h:mm a')}
                                {' - '}
                                {moment(items?.endTime).format('h:mm a')}
                              </h1>
                            </div>

                            {items?.minutes > 15 && (
                              <div className="flex gap-1">
                                <FileTextOutlined
                                  className="text-xs mt-0.5"
                                  style={{ color: '#1B568F' }}
                                />
                                <h1 className="text-gray-900 font-medium text-xs mb-0">
                                  {items?.name}
                                </h1>
                              </div>
                            )}
                            {items?.minutes >= 30 && (
                              <div className="flex gap-1">
                                <UserOutlined
                                  className="text-xs mt-0.5"
                                  style={{
                                    color: `${
                                      items?.teacher?.confirmationStatus === 'TODAY' ||
                                      items?.teacher?.confirmationStatus === 'FROM_TO' ||
                                      items?.teacher?.confirmationStatus === 'DATE'
                                        ? '#ea580c'
                                        : '#1B568F'
                                    }`,
                                  }}
                                />
                                <h1
                                  style={{
                                    color: `${
                                      items?.teacher?.confirmationStatus === 'TODAY' ||
                                      items?.teacher?.confirmationStatus === 'FROM_TO' ||
                                      items?.teacher?.confirmationStatus === 'DATE'
                                        ? '#ea580c'
                                        : '#111827'
                                    }`,
                                  }}
                                  className={` font-medium text-xs  mb-0`}
                                >
                                  {items?.teacher?.displayName}
                                </h1>
                              </div>
                            )}
                            {items?.minutes >= 40 && (
                              <div className="flex gap-1">
                                <ExperimentOutlined
                                  className="text-xs mt-0.5"
                                  style={{ color: '#1B568F' }}
                                />
                                <h1 className="text-gray-900 font-medium text-xs mb-0">
                                  {items?.activityType}
                                </h1>
                              </div>
                            )}
                          </div>
                        </>
                      ) : null,
                    )}
                </div>
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default connect(() => ({}))(BatchTime);
