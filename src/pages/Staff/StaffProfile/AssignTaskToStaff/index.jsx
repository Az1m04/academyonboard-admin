import React, { useState } from 'react';
import {
  Form,
  Button,
  Input,
  Tooltip,
  message,
  Row,
  Select,
  Col,
  Popover,
  Upload,
  DatePicker,
  Spin,
} from 'antd';

import { CalendarX } from '@/utils/AppIcons';
import moment from 'moment';
import {
  isMomentToday,
  isMomentThisWeek,
  dayNameShort,
  dayNameAndDateShort,
} from '@/utils/dateTime/dateTimeUtils';

import PeoplePicker from '@/components/People/PeoplePicker';
import { getSingularPlural } from '@/utils/common';

import { DeleteOutlined } from '@ant-design/icons';

import CustomRecurrenceModal from '@/components/AddTaskModal/CustomRecurrenceModal';
import { connect } from 'umi';

const { Dragger } = Upload;
const { TextArea } = Input;
const renderTaskDueDate = (dueDate, setDueDate) => {
  let dueDateLabel = '';

  if (dueDate) {
    const due = moment(dueDate);
    const isToday = isMomentToday(due);
    const wasDueThisWeek = isMomentThisWeek(due);
    // check if past due
    if (due.isBefore(moment(), 'day')) {
      // check if task was due this week
      if (wasDueThisWeek) {
        // Show in red color with Mon format
        dueDateLabel = dayNameShort(due.format('Do MMMM YYYY h:mm:ss a'));
        return (
          <Tooltip title={`Was due ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
        );
      }
      // past due since more than this week ago, show in Jan 14 format
      dueDateLabel = dayNameAndDateShort(due.format('Do MMMM YYYY h:mm:ss a'));
      return (
        <div className="flex">
          <Tooltip title={`Past due since ${due.fromNow()}`}>
            <div className="text-red-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }
    // Due today, show Today text
    if (isToday) {
      dueDateLabel = `Today, ${moment(due).format('Do MMMM YYYY h:mm:ss a')}`;
      return (
        <div className="flex">
          <Tooltip title={`Due ${due.fromNow()}`}>
            <div className="text-blue-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }

    // Due in the future, show Feb 12 text
    if (due.isAfter(moment(), 'day')) {
      dueDateLabel = `${moment(due).format('dddd')}, ${moment(due).format(
        'Do MMMM YYYY h:mm:ss a',
      )}`;

      return (
        <div className="flex">
          <Tooltip title={`Due ${due.fromNow()} on ${due.format('MMM DD')}`}>
            <div className="text-blue-700">{dueDateLabel}</div>
          </Tooltip>
          <Popover content={'Clear date'}>
            <span className="text-red-500 mx-1 cursor-pointer" onClick={() => setDueDate()}>
              <DeleteOutlined />
            </span>
          </Popover>
        </div>
      );
    }

    return (
      <Tooltip title="No due date">
        <div className="opacity-50">No due date</div>
      </Tooltip>
    );
  }
  return '';
};

export const getWeekNumber = () => {
  let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
  weeks = (weeks + 52) % 52;
  switch (weeks) {
    case 1:
      return 'first ';
    case 2:
      return 'second ';
    case 3:
      return 'third ';
    case 4:
      return 'four ';
    case 5:
      return 'five ';
    default:
      return 'first ';
  }
};
export const TimeDuration = [
  {
    title: `Daily`,
    value: 'DAILY',
  },
  {
    title: `Weekly on ${moment().format('dddd')}`,
    value: 'WEEKLY',
  },
  {
    title: `Monthly on ${getWeekNumber()}${moment().format('dddd').toLowerCase()}`,
    value: 'MONTHLY',
  },
  {
    title: `Yearly on ${moment().format('MMMM Do')}`,
    value: 'YEARLY',
  },
  {
    title: 'Custom...',
    value: 'CUSTOM',
  },
];
export const priority = [
  {
    title: 'Very High',
    value: 'VERY_HIGH',
  },
  {
    title: 'High',
    value: 'HIGH',
  },
  {
    title: 'Low',
    value: 'LOW',
  },
  {
    title: 'Medium',
    value: 'MEDIUM',
  },
];
const AssignTaskToStaff = ({
  dispatch,
  staffId,
  loadingForUploadTask,
  setVisibleDrawer,
  setOption,
}) => {
  const [form] = Form.useForm();

  const [customRecurrenceForm] = Form.useForm();
  const [dueDate, setDueDate] = useState();

  const [showAddFollowerModal, setShowAddFollowerModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [addFollowerLoading, setAddFollowerLoading] = useState(false);

  const [contentsForTask, setContentsForTask] = useState([]);
  const [isRecurrenceModalVisible, setIsRecurrenceModalVisible] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [repeatOption, setRepeatOption] = useState('WEEKLY');
  const [repeatEnds, setRepeatEnds] = useState('never');
  const [recurrencePayload, setRecurrencePayload] = useState();

  const createTask = () => {
    const allValues = form.getFieldsValue();

    const taskPayload = {
      priorityTypeId: allValues?.priorityTypeId,
      dueDate: dueDate && dueDate?.toISOString(),

      name: allValues?.title || 'Untitled Task',

      description: allValues?.remark,
      contents: contentsForTask?.map((item) => {
        return { encodedFile: item?.encodedFile, name: item?.name, typeId: item?.typeId };
      }),
      ...recurrencePayload,
    };

    dispatch({
      type: 'staff/uploadStaffTask',
      payload: { body: taskPayload, pathParams: { staffId } },
    }).then((res) => {
      if (res) {
        setVisibleDrawer(false);
        setOption();
      }
    });
  };
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // eslint-disable-next-line consistent-return
  const createRecurrencePayload = (value) => {
    let weeks = moment().weeks() - moment().startOf('month').weeks() + 1;
    weeks = (weeks + 52) % 52;
    switch (value) {
      case 'DAILY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'WEEKLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'MONTHLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            recurrenceType: value,
            repetitionType: value,
            repetitionOn: [moment().format('ddd').toUpperCase()],
            repetitionFrequency: 1,
            repetitionOnType: 'DAY',
            repeatByDay: weeks,
            startDate: moment().toISOString(),
            isEnds: false,
          },
        });
      case 'YEARLY':
        return setRecurrencePayload({
          isRecurrence: true,
          recurrence: {
            startDate: '2022-02-11T04:40:52.040Z',
            recurrenceType: 'YEARLY',
            isEnds: false,
            repetitionFrequency: 1,
            repetitionType: 'YEARLY',
            repetitionOnType: 'DATE',
          },
        });
      default:
        break;
    }
  };
  return (
    <div>
      <div>
        <Form form={form} requiredMark={false} onFinish={createTask}>
          <CustomRecurrenceModal
            setIsRecurrenceModalVisible={setIsRecurrenceModalVisible}
            isRecurrenceModalVisible={isRecurrenceModalVisible}
            createTaskForm={form}
            customRecurrenceForm={customRecurrenceForm}
            repeatCount={repeatCount}
            setRepeatCount={setRepeatCount}
            repeatOption={repeatOption}
            setRepeatOption={setRepeatOption}
            repeatEnds={repeatEnds}
            setRepeatEnds={setRepeatEnds}
            getWeekNumber={getWeekNumber}
            setRecurrencePayload={setRecurrencePayload}
            recurrencePayload={recurrencePayload}
          />
          <Spin spinning={Boolean(loadingForUploadTask)}>
            <div className="flex"></div>
            <div className="">
              <Row gutter={16}></Row>
            </div>
            <p className="text-sm font-semibold ">Add work title</p>
            <Form.Item
              name="title"
              style={{ margin: '5px 0px' }}
              label={false}
              rules={[
                {
                  required: true,
                  message: 'Please input the title of the task!',
                },
              ]}
            >
              <TextArea
                minRows={2}
                onKeyDown={(event) => {
                  if (event.keyCode === 50) {
                    if (event.shiftKey) {
                      //   TODO:
                    }
                  }
                }}
                autoSize
                size="large"
                placeholder="Work Description"
              />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div>
                  <p className="text-sm font-semibold mt-4">Select type of work</p>
                  <Form.Item
                    name="durationUnitId"
                    style={{ margin: '' }}
                    rules={[{ required: true, message: 'Please select type of work!' }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select work type"
                      getPopupContainer={(node) => node.parentNode}
                      onSelect={(value) => {
                        createRecurrencePayload(value);
                        if (value === 'CUSTOM') {
                          setIsRecurrenceModalVisible(true);
                        }
                      }}
                    >
                      {TimeDuration?.map((dru) => (
                        <Select.Option value={dru?.value} key={dru?.value}>
                          {dru?.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <div>
                  <p className="text-sm font-semibold mt-4">Select Priority</p>
                  <Form.Item name="priorityTypeId" style={{ margin: '' }}>
                    <Select
                      size="large"
                      placeholder="Select priority"
                      getPopupContainer={(node) => node.parentNode}
                    >
                      {priority?.map((prior) => (
                        <Select.Option value={prior?.value} key={prior?.value}>
                          {prior?.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
            </Row>

            <div className="flex items-center justify-between my-4">
              <Button style={{ display: 'flex', alignItems: 'center', padding: '0%' }}>
                <span className="relative w-32">
                  <DatePicker
                    showTime={{ use12Hours: true }}
                    showNow={false}
                    disabledDate={(date) => date.valueOf() < moment().subtract(1, 'days').valueOf()}
                    suffixIcon={<></>}
                    style={{ cursor: 'pointer', width: '100%' }}
                    bordered={false}
                    allowClear={false}
                    value={dueDate}
                    onChange={(e) => setDueDate(e)}
                  />
                  <span
                    style={{ pointerEvents: 'none' }}
                    className="absolute bg-white flex gap-2 px-2 w-full left-0 top-0 mt-1 cursor-pointer"
                  >
                    <span className="">
                      <CalendarX />
                    </span>
                    <span className="mt-0.5">Due date</span>
                  </span>
                </span>
              </Button>
              <div>{renderTaskDueDate(dueDate, setDueDate)}</div>
            </div>

            <p className="text-sm font-semibold ">Add remarks</p>
            <Form.Item name="remark" style={{ margin: '5px 0px' }} label={false}>
              <TextArea
                minRows={2}
                onKeyDown={(event) => {
                  if (event.keyCode === 50) {
                    if (event.shiftKey) {
                      //   TODO:
                    }
                  }
                }}
                autoSize
                size="large"
                placeholder="Enter any remark"
              />
            </Form.Item>
            <div className="mt-3">
              <Form.Item name="uploadedFiles">
                <Dragger
                  name={'file'}
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif,.pdf,.doc,.docx,.xlsx ,.tiff|image/*"
                  onChange={(info) => {
                    const { status } = info.file;
                    if (status === 'done') {
                      message.success(`${info.file.name} file uploaded successfully.`);
                    } else if (status === 'error') {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                  }}
                  onRemove={(data) => {
                    setContentsForTask(contentsForTask?.filter((del) => del?.uId !== data?.uid));
                    return true;
                  }}
                  multiple={true}
                  beforeUpload={async (data) => {
                    await toBase64(data)
                      .then((res) => {
                        const obj = {
                          encodedFile: res,
                          name: data?.name,
                          typeId: 'DOCUMENT',
                          uId: data?.uid,
                        };
                        setContentsForTask((prev) => [...prev, obj]);
                      })
                      .catch(() => {});
                    return false;
                  }}
                  style={{
                    display: 'block',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <p className="">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </p>
                  <p className="ant-upload-text">
                    <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-1.5">
                      Upload a file
                    </span>
                    or drag and drop
                  </p>
                </Dragger>
              </Form.Item>
            </div>
            <PeoplePicker
              setVisible={setShowAddFollowerModal}
              visible={showAddFollowerModal}
              savedValues={followers}
              title={() => 'Select followers of this task'}
              buttonName="Select"
              loading={addFollowerLoading}
              onChange={(values) => {
                setAddFollowerLoading(true);
                const peopleToBeNotified = [
                  ...values.map((value) => ({
                    id: value.id,
                    name: value.displayName,
                    email: value.email,
                    photoUrl: value.photoUrl,
                  })),
                  ...followers,
                ];
                setFollowers(peopleToBeNotified);

                setAddFollowerLoading(false);
                setShowAddFollowerModal(false);
                message.success(
                  `${values.length} ${getSingularPlural(
                    'follower',
                    values?.length,
                  )} added successfully!`,
                );
              }}
            />

            <div className="flex justify-end">
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </div>
          </Spin>
        </Form>
      </div>
    </div>
  );
};

export default connect(({ loading }) => ({
  loadingForUploadTask: loading?.effects['staff/uploadStaffTask'],
}))(AssignTaskToStaff);
