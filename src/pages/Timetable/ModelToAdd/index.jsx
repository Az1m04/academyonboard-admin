import React from 'react';
import {
  FieldTimeOutlined,
  FileTextOutlined,
  GroupOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Modal, Form, Row, Col, Select, Spin, TimePicker, Tooltip, Button, Avatar } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import { ArrowRightShort } from 'react-bootstrap-icons';
import { getInitials } from '@/utils/common';

function ModelToAdd({
  setModalVisible,
  modalVisible,
  addForm,
  singleBatchDetail,
  createModuleSlot,
  setStartEndTime,
  startEndTime,
  freeTeachersList,
  createModuleSlotLoading,
  getFreeSlotLoading,
  freeTeachersListLoading,
  updateModuleSlot,
  idTimetable,
  updateLoading,
  dispatch,
}) {
  const { Option } = Select;

  return (
    <div>
      <Modal
        title={
          <>
            <span className="flex items-center gap-2">
              <span className="" style={{ color: '#1B568F' }}>
                <FieldTimeOutlined className=" text-4xl" style={{ color: '#1B568F' }} />
              </span>
              <div className="flex flex-col">
                <span className="font-semibold " style={{ color: '#1B568F' }}>
                  {modalVisible !== 'create' ? 'Update module timeslot' : 'Add timeslot for module'}
                </span>
                <span className="font-normal  text-sm" style={{ color: '#1B568F' }}>
                  {modalVisible !== 'create' ? 'Update timeslot' : 'assign module to teacher'}
                </span>
              </div>
            </span>
          </>
        }
        visible={modalVisible}
        onCancel={() => {
          setModalVisible('');
          addForm?.resetFields();
        }}
        footer={
          <div>
            <Button
              onClick={() => {
                setModalVisible('');
                addForm?.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={Boolean(createModuleSlotLoading) || Boolean(updateLoading)}
              onClick={() => addForm.submit()}
            >
              {modalVisible === 'update' ? 'Update Slot' : 'Add Slot'}
            </Button>
          </div>
        }
        maskClosable={false}
      >
        <Spin
          spinning={
            Boolean(!singleBatchDetail) ||
            Boolean(createModuleSlotLoading) ||
            Boolean(getFreeSlotLoading) ||
            Boolean(freeTeachersListLoading)
          }
        >
          <Form
            form={addForm}
            hideRequiredMark
            onFinish={(values) => {
              if (modalVisible === 'create') {
                createModuleSlot(values);
              } else {
                updateModuleSlot(values, idTimetable);
              }
            }}
          >
            <div className="border px-4 py-2 rounded-md  mb-3">
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <GroupOutlined className="mt-1" style={{ color: '#1B568F' }} />
                  <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                    Batch:
                  </h1>
                </div>
                <p className="text-gray-500 font-medium m-0">{singleBatchDetail?.name || '--'}</p>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <FileTextOutlined className="mt-1" style={{ color: '#1B568F' }} />
                  <h1 style={{ color: '#1B568F' }} className="font-medium mb-0">
                    Course:
                  </h1>
                </div>
                <p className="text-gray-500 font-medium m-0">
                  {singleBatchDetail?.course?.name || '--'}
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
                  {(singleBatchDetail?.startsAt &&
                    moment(singleBatchDetail?.startsAt).format('hh:mm a')) ||
                    '--'}{' '}
                  to{` `}
                  {(singleBatchDetail?.endsAt &&
                    moment(singleBatchDetail?.endsAt).format('hh:mm a')) ||
                    '--'}
                </p>
              </div>
            </div>
            <Row gutter={16}>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Module Name</span>
                <Form.Item
                  name="moduleId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select module first',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="select module name"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    {singleBatchDetail?.modules?.map((item) => (
                      <Option key={item?.id} value={item?.id}>
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={12} xl={12} md={24} sm={24} xs={24}>
                <span className="block mb-2 font-medium text-gray-800">Module Activity</span>
                <Form.Item
                  name="activityId"
                  rules={[
                    {
                      required: true,
                      message: 'Please select module activity',
                    },
                  ]}
                >
                  <Select
                    size="large"
                    placeholder="select module activity"
                    getPopupContainer={(node) => node.parentNode}
                  >
                    <Option value="TEACHING">Teaching</Option>
                    <Option value="EXTRA_CURRICULUM">Extra Curriculum</Option>
                    <Option value="TEST">Test</Option>
                    <Option value="JUSTIFICATION">justification</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                <div className="flex  cursor-pointer">
                  <div className="w-full">
                    <p className="m-1 font-medium">Start time</p>
                    <Form.Item
                      name={'startTime'}
                      rules={[
                        {
                          required: true,
                          message: 'Please select start time',
                        },
                        () => ({
                          validator(_, value) {
                            if (
                              moment(value).format('HH:mm') >=
                                moment(singleBatchDetail?.startsAt).format('HH:mm') &&
                              moment(value).format('HH:mm') <
                                moment(singleBatchDetail?.endsAt).format('HH:mm')
                            ) {
                              if (modalVisible === 'create') {
                                setStartEndTime((prev) => ({
                                  ...prev,
                                  startsAt: value,
                                  call: true,
                                }));
                              }
                              return Promise.resolve();
                              // eslint-disable-next-line no-else-return
                            } else if (
                              moment(value).format('HH:mm') ===
                              moment(singleBatchDetail?.endsAt).format('HH:mm')
                            ) {
                              return Promise.reject(
                                new Error(
                                  `${
                                    moment(value).format('HH:mm') ===
                                    moment(singleBatchDetail?.endsAt).format('HH:mm')
                                      ? "End time of batch and start time couldn't be same"
                                      : `${'please select valid ends time'}`
                                  }`,
                                ),
                              );
                            } else {
                              return Promise.reject(
                                value &&
                                  new Error(
                                    `${
                                      moment(value).format('HH:mm') >
                                      moment(singleBatchDetail?.endsAt).format('HH:mm')
                                        ? "Start time couldn't greater than batch ends time"
                                        : `${'please select vaild start time'}`
                                    }`,
                                  ),
                              );
                            }
                          },
                        }),
                      ]}
                    >
                      <TimePicker
                        onChange={() =>
                          addForm?.setFieldsValue({
                            endTime: undefined,
                          })
                        }
                        disabled={modalVisible !== 'create'}
                        size="large"
                        format="h:mm a"
                        allowClear={false}
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-center mt-8">
                    <ArrowRightShort className="text-4xl text-gray-400" />
                  </div>
                  {/* End time */}
                  <div className="w-full">
                    <p className="m-1 font-medium">End time</p>
                    <Tooltip title={!startEndTime?.startsAt && 'please select start time first'}>
                      <Form.Item
                        name={'endTime'}
                        rules={[
                          {
                            required: startEndTime?.startsAt && true,
                            message: startEndTime?.startsAt && 'Please select end time',
                          },
                          () => ({
                            validator(_, value) {
                              if (
                                moment(value).format('HH:mm') >
                                  moment(startEndTime?.startsAt).format('HH:mm') &&
                                moment(value).format('HH:mm') <=
                                  moment(singleBatchDetail?.endsAt).format('HH:mm') &&
                                moment(value, 'YYYY-MM-DD HH:mm').diff(
                                  startEndTime?.startsAt?.format('YYYY-MM-DD HH:mm'),
                                  'minutes',
                                ) >= 30
                              ) {
                                if (modalVisible === 'create') {
                                  if (freeTeachersList?.freeTeachersList === null) {
                                    setStartEndTime((prev) => ({
                                      ...prev,
                                      endsAt: value,
                                      call: true,
                                    }));
                                  }
                                }
                                return Promise.resolve();
                                // eslint-disable-next-line no-else-return
                              } else if (
                                moment(value).format('HH:mm') ===
                                moment(singleBatchDetail?.startsAt).format('HH:mm')
                              ) {
                                return Promise.reject(
                                  new Error(
                                    `${
                                      moment(value).format('HH:mm') ===
                                      moment(singleBatchDetail?.startsAt).format('HH:mm')
                                        ? "Start time of batch and ends time couldn't be same"
                                        : `${'please select valid ends time'}`
                                    }`,
                                  ),
                                );
                              } else {
                                return Promise.reject(
                                  value &&
                                    new Error(
                                      `${
                                        moment(value).format('HH:mm') >
                                        moment(singleBatchDetail?.endsAt).format('HH:mm')
                                          ? "End time couldn't greater than batch ends time"
                                          : `${
                                              moment(value).format('HH:mm') <
                                              moment(singleBatchDetail?.startsAt).format('HH:mm')
                                                ? "End time couldn't less than start time"
                                                : `${
                                                    moment(value).format('HH:mm') <
                                                    moment(startEndTime?.startsAt).format('HH:mm')
                                                      ? "End time couldn't less than start time"
                                                      : `${
                                                          moment(value).diff(
                                                            startEndTime?.startsAt?.toISOString(),
                                                            'minutes',
                                                          ) < 30
                                                            ? 'please select atleast 30min timeslot '
                                                            : 'please select valid ends time'
                                                        }`
                                                  }`
                                            }`
                                      }`,
                                    ),
                                );
                              }
                            },
                          }),
                        ]}
                      >
                        <TimePicker
                          size="large"
                          disabled={!startEndTime?.startsAt || modalVisible !== 'create'}
                          format="h:mm a"
                          onSelect={() =>
                            dispatch({
                              type: 'timetable/setStates',
                              payload: {
                                freeTeachersList: null,
                              },
                              key: 'freeTeachersList',
                            })
                          }
                          allowClear={false}
                        />
                      </Form.Item>
                    </Tooltip>
                  </div>
                </div>
              </Col>
              {freeTeachersList?.teachers?.length > 0 || modalVisible !== 'create' ? (
                <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                  <span className="block mb-2 font-medium text-gray-800">Select teacher</span>
                  <Form.Item
                    name={['teacher', 'id']}
                    rules={[
                      {
                        required: true,
                        message: 'Please select teacher',
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      disabled={modalVisible !== 'create'}
                      placeholder="select teacher"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {freeTeachersList?.teachers?.map((item) => (
                        <Option key={item?.id} value={item?.id} item={item}>
                          <div className="flex m-0">
                            <div className="">
                              <div className="m-0 p-0">
                                <Avatar
                                  style={{ backgroundColor: '#f56a00', fontSize: '12px' }}
                                  size={30}
                                  src={item?.photoUrl}
                                >
                                  {getInitials(item?.displayName)}
                                </Avatar>
                              </div>
                            </div>
                            <div className="pl-2 pb-2">
                              <p className="mb-0 capitalize ">{item?.displayName}</p>
                              <p className="mb-0 text-gray-600">{item?.email}</p>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default connect(({ timetable, loading }) => ({
  freeTeachersList: timetable?.freeTeachersList,
  createModuleSlotLoading: loading?.effects['timetable/postModuleTimeSlot'],
  updateLoading: loading?.effects['timetable/updateModuleTimeSlot'],
  getFreeSlotLoading: loading?.effects['timetable/getIsTimeslotExit'],
  freeTeachersListLoading: loading?.effects['timetable/getFreeTeachers'],
}))(ModelToAdd);
